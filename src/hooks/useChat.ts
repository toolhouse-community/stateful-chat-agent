import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Message } from '../types';
import { sendInitialMessage, sendFollowUpMessage, loadConversationHistory } from '../services/api';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isReadOnly: null,
  runId: null,
  error: null,
};

export const useChat = () => {
  const [state, setState] = useState<ChatState>(() => {
    // Check if there's a run ID in the URL path
    const pathRunId = window.location.pathname.split('/')[1];
    return pathRunId ? { ...initialState, runId: pathRunId } : initialState;
  });

  useEffect(() => {
    const loadHistory = async () => {
      if (state.runId && state.messages.length === 0) {
        setState(prev => ({ ...prev, isLoading: true, isReadOnly: true }));
        const messages = await loadConversationHistory(state.runId);
        
        if (messages.length > 0) {
          setState(prev => ({
            ...prev,
            messages: messages.map(msg => ({
              ...msg,
              id: uuidv4(),
              isComplete: true,
            })),
            isLoading: false,
            isReadOnly: true,
          }));
        } else {
          setState(prev => ({
            ...prev,
            error: 'Failed to load conversation history',
            isLoading: false,
            isReadOnly: true,
          }));
        }
      }
    };
    
    loadHistory();
  }, [state.runId]);

  const addUserMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
    };

    setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, userMessage],
      isLoading: true,
    }));

    return userMessage;
  }, []);

  const startNewAssistantMessage = useCallback(() => {
    const assistantMessage: Message = {
      id: uuidv4(),
      content: '',
      role: 'assistant',
      isComplete: false,
    };

    setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, assistantMessage],
    }));

    return assistantMessage;
  }, []);

  const updateAssistantMessage = useCallback((id: string, chunk: string) => {
    setState((prevState) => {
      const updatedMessages = prevState.messages.map((message) => {
        if (message.id === id) {
          return {
            ...message,
            content: message.content + chunk,
          };
        }
        return message;
      });

      return {
        ...prevState,
        messages: updatedMessages,
      };
    });
  }, []);

  const completeAssistantMessage = useCallback((id: string) => {
    setState((prevState) => {
      const updatedMessages = prevState.messages.map((message) => {
        if (message.id === id) {
          return {
            ...message,
            isComplete: true,
          };
        }
        return message;
      });

      return {
        ...prevState,
        messages: updatedMessages,
        isLoading: false,
      };
    });
  }, []);

  const updateUrl = useCallback((runId: string) => {
    const newUrl = `/${runId}`;
    window.history.pushState({ runId }, '', newUrl);
    setState(prev => ({ ...prev, runId }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage = addUserMessage(message);
    const assistantMessage = startNewAssistantMessage();

    const handleChunk = (chunk: string) => {
      updateAssistantMessage(assistantMessage.id, chunk);
    };

    try {
      if (!state.runId) {
        // First message, need to get a run ID
        const runId = await sendInitialMessage(message, handleChunk);
        
        if (runId) {
          updateUrl(runId);
        } else {
          setState((prevState) => ({
            ...prevState,
            error: 'Failed to get run ID',
            isLoading: false,
          }));
        }
      } else {
        // Followup message with existing run ID
        await sendFollowUpMessage(state.runId, message, handleChunk);
      }

      completeAssistantMessage(assistantMessage.id);
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to send message',
        isLoading: false,
      }));
    }
  }, [state.runId, addUserMessage, startNewAssistantMessage, updateAssistantMessage, completeAssistantMessage, updateUrl]);

  const clearChat = useCallback(() => {
    setState(initialState);
    window.history.pushState({}, '', '/');
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearChat,
    isReadOnly: state.isReadOnly,
  };
};
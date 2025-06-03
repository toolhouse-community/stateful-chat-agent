import { APIResponse, Message } from '../types';

const TOOLHOUSE_BASE_URL = 'https://agents.toolhouse.ai';
const TOOLHOUSE_AGENT_ID = '8f22b375-f804-4fd6-b0cd-6f4869409531';

export const loadConversationHistory = async (runId: string): Promise<Message[]> => {
  try {
    const response = await fetch(
      `${TOOLHOUSE_BASE_URL}/${TOOLHOUSE_AGENT_ID}/${runId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const history = await response.json();
    const messages: Message[] = [];
    let foundFirstUser = false;

    // Process messages in order
    for (const msg of history) {
      if (msg.role === 'tool') continue;

      if (msg.role === 'user') {
        if (!foundFirstUser) {
          // First user message - extract from topic tags
          const topicMatch = msg.content.match(/<topic>(.*?)<\/topic>/);
          if (topicMatch) {
            messages.push({
              role: 'user',
              content: topicMatch[1],
            });
          }
          foundFirstUser = true;
        } else {
          // Subsequent user messages
          messages.push({
            role: 'user',
            content: msg.content,
          });
        }
      } else if (msg.role === 'assistant' && Array.isArray(msg.content)) {
        // For assistant messages, add each text content
        for (const content of msg.content) {
          if (content.text) {
            messages.push({
              role: 'assistant',
              content: content.text,
            });
          }
        }
      }
    }

    return messages;
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return [];
  }
};

export const sendInitialMessage = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${TOOLHOUSE_BASE_URL}/${TOOLHOUSE_AGENT_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vars: { topic: message } }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Get the run ID from the header
    const runId = response.headers.get('X-Toolhouse-Run-ID');

    // Process the streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
    }

    return runId;
  } catch (error) {
    console.error('Error sending initial message:', error);
    return null;
  }
};

export const sendFollowUpMessage = async (
  runId: string,
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    const response = await fetch(
      `${TOOLHOUSE_BASE_URL}/${TOOLHOUSE_AGENT_ID}/${runId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Process the streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
    }
  } catch (error) {
    console.error('Error sending follow-up message:', error);
  }
};
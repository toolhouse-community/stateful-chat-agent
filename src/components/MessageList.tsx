import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';
import ScrollToTop from './ScrollToTop';

interface MessageListProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onSendMessage, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    if (onSendMessage) {
      onSendMessage(question);
    }
  };

  // Show loading state when loading conversation history (no messages yet)
  if (isLoading && messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[rgb(0,136,255)] animate-spin" />
          <p className="text-lg text-gray-300">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto pt-[72px] md:pt-[128px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="max-w-md">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to Toolhouse Docs</h1>
              <h6 className="mb-12">Built with <a className="text-[rgb(0,136,255)]" href="https://toolhouse.ai">Toolhouse</a></h6>
              <p className="hidden md:block p-4 text-gray-400">
                Ask any question about Toolhouse, or try a suggestion
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
                {[
                  "How do I get started with Toolhouse?",
                  "Explain how to create an agent",
                  "How do I setup RAG in Toolhouse?",
                  "How do I deploy my agent?"
                ].map((suggestion, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[rgb(30,41,59)] rounded-lg hover:bg-[rgb(51,65,85)] cursor-pointer transition-colors text-sm"
                    onClick={() => handleQuestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://join.toolhouse.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[rgb(0,136,255)] hover:underline text-sm"
                >
                  Sign up for Toolhouse
                </a>
                <a 
                  href="https://discord.toolhouse.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[rgb(0,136,255)] hover:underline text-sm"
                >
                  Join our Discord community
                </a>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isLoading={isLoading && message === messages[messages.length - 1] && message.role === 'assistant'}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <ScrollToTop />
    </>
  );
};

export default MessageList;
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={`flex items-start gap-3 py-6 px-4 md:px-8 animate-fadeIn
        ${isUser ? 'bg-[rgb(15,23,42)]' : 'bg-[rgb(2,8,23)]'}`}
    >
      <div className={`flex-shrink-0 mt-1 rounded-full p-2
        ${isUser ? 'bg-[rgb(51,65,85)]' : 'bg-[rgb(0,136,255)]'}`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="font-medium text-sm text-gray-300 mb-1">
          {isUser ? 'You' : 'Toolhouse Docs'}
        </div>
        <div className="text-white">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <>
              {isLoading ? (
                <>
                <MarkdownRenderer content={message.content} />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[rgb(0,136,255)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[rgb(0,136,255)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[rgb(0,136,255)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                </>
              ) : (
                <MarkdownRenderer content={message.content} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
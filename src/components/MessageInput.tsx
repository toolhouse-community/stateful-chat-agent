import React, { useState, FormEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-[rgb(2,8,23)] p-4 pb-safe">
      <form 
        onSubmit={handleSubmit} 
        className="flex items-end max-w-3xl mx-auto bg-[rgb(30,41,59)] rounded-lg shadow-md overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[rgb(0,136,255)]"
      >
        <textarea
          ref={textareaRef}
          className="flex-grow min-h-[50px] max-h-[120px] bg-[rgb(30,41,59)] text-white resize-none p-3 focus:outline-none"
          placeholder="Ask a question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          style={{
            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
          }}
        />
        <button
          type="submit"
          className="p-3 text-white rounded-r hover:text-[rgb(0,136,255)] transition-colors disabled:opacity-50"
          disabled={!message.trim() || isLoading}
        >
          <Send size={20} />
        </button>
      </form>
      <div className="h-4 max-w-3xl mx-auto px-3 text-xs text-gray-400">
        {isLoading && <span className="animate-pulse">Toolhouse is thinking...</span>}
      </div>
    </div>
  );
};

export default MessageInput;
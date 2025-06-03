import React, { useState } from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { useChat } from '../hooks/useChat';

const ChatInterface: React.FC = () => {
  const { messages, isLoading, sendMessage, isReadOnly } = useChat();
  const [showCopied, setShowCopied] = useState(false);

  const handleNewChat = () => {
    window.location.href = '/';
  };

  const handleShare = async () => {
    try {
      if (navigator.share && navigator.canShare({ url: window.location.href })) {
        await navigator.share({
          title: 'Toolhouse Docs Chat',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share:', err);
      // Fallback to clipboard on error
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (clipboardErr) {
        console.error('Failed to copy to clipboard:', clipboardErr);
      }
    }
  };

  const showShareButton = window.location.pathname !== '/';

  return (
    <div className="flex flex-col h-screen bg-[rgb(2,8,23)] text-white overscroll-none">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[rgb(30,41,59)] py-2 px-4 md:px-6 flex items-center justify-between bg-[rgb(2,8,23)]">
        <div className="flex items-center">
          <div className="h-8 md:h-10 flex items-center">
            <a href="/">
              <img 
                src="/toolhouse-icon.svg" 
                alt="Toolhouse" 
                className="h-full w-auto"
                style={{ maxWidth: '120px' }}
              />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {messages.length > 0 && (
            <>
              <a 
                href="https://join.toolhouse.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Sign up
              </a>
              <a 
                href="https://discord.toolhouse.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex text-sm text-gray-400 hover:text-white transition-colors items-center gap-1"
              >
                Discord
              </a>
            </>
          )}
          <a 
            href="https://docs.toolhouse.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex text-sm text-gray-400 hover:text-white transition-colors items-center gap-1"
          >
            Classic Docs
          </a>
          {showShareButton && (
            <button
              onClick={handleShare}
              className="text-sm bg-[rgb(30,41,59)] hover:bg-[rgb(51,65,85)] px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
            >
              <Share2 size={16} />
              <span className="hidden md:inline">{showCopied ? 'Copied!' : 'Share'}</span>
            </button>
          )}
          <button 
            className="text-sm bg-[rgb(0,136,255)] hover:bg-[rgb(0,120,225)] px-3 py-1.5 rounded-md transition-colors"
            onClick={handleNewChat}
          >
            New Chat
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} onSendMessage={sendMessage} isLoading={isLoading} />
        {isReadOnly === true && (
          <div className="sticky bottom-0 w-full bg-[rgb(2,8,23)] py-4 px-4 md:px-0">
            <div className="max-w-3xl mx-auto bg-[rgb(30,41,59)] rounded-lg p-4 text-center">
              <p className="text-gray-300 mb-3">This is a read-only conversation.</p>
              <button
                onClick={handleNewChat}
                className="bg-[rgb(0,136,255)] hover:bg-[rgb(0,120,225)] px-4 py-2 rounded-md transition-colors text-white"
              >
                Start Your Own Chat
              </button>
            </div>
          </div>
        )}
        
        {isReadOnly !== true && (
          <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
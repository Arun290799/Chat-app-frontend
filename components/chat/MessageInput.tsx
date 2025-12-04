'use client';

import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isConnected: boolean;
  disabled?: boolean;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export default function MessageInput({ 
  onSendMessage, 
  isConnected,
  disabled = false,
  onTypingStart,
  onTypingStop
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected || disabled) return;
    
    // Stop typing when message is sent
    if (isTypingRef.current && onTypingStop) {
      onTypingStop();
      isTypingRef.current = false;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    onSendMessage(message);
    setMessage('');
    
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Emit typing:start if not already typing
    if (!isTypingRef.current && value.trim() && onTypingStart) {
      onTypingStart();
      isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing:stop after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && onTypingStop) {
        onTypingStop();
        isTypingRef.current = false;
      }
    }, 2000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && onTypingStop) {
        onTypingStop();
      }
    };
  }, [onTypingStop]);

  return (
    <div className="relative">
      {!isConnected && (
        <div className="absolute -top-6 left-0 right-0 text-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            Connecting...
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 shadow-sm shadow-slate-900/70">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full max-h-32 resize-none border-0 bg-transparent py-2 px-0 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
            rows={1}
            disabled={!isConnected || disabled}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || !isConnected || disabled}
          className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </form>
    </div>
  );
}
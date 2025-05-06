// src/components/ChatMessage.jsx
import React from 'react';

export default function ChatMessage({ sender, text }) {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-xs p-3 my-1 rounded-lg
        ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
      `}>
        {text}
      </div>
    </div>
  );
}

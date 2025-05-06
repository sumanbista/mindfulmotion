import React from 'react';

export default function ChatHistory({ messages }) {
  return (
    <div className="space-y-4">
      {messages.map((m,i) => (
        <div
          key={i}
          className={`p-4 rounded-lg ${
            m.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
          } max-w-xl`}
        >
          <strong className="block mb-1">
            {m.role === 'user' ? 'You' : 'Counselor'}
          </strong>
          <p>{m.text}</p>
        </div>
      ))}
    </div>
  );
}

// src/components/ChatSessionsList.jsx
import React from 'react';

export default function ChatSessionsList({ sessions, currentId, onSelect, onNew }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Your Chats</h2>
      <button
        onClick={onNew}
        className="mb-4 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
      >
        + New Chat
      </button>
      <ul className="overflow-y-auto flex-1">
        {sessions.map(s => (
          <li key={s._id}>
            <button
              onClick={() => onSelect(s)}
              className={`w-full text-left px-3 py-2 rounded mb-2 transition-colors ${
                s._id === currentId
                  ? 'bg-pink-100 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {new Date(s.createdAt).toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

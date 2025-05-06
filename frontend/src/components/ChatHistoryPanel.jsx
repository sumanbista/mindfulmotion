// src/components/ChatHistoryPanel.jsx
import React from 'react';

export default function ChatHistoryPanel({ sessions, onSelect, onNew }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Past Conversations</h2>
      <button
        onClick={onNew}
        className="mb-4 bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
      >
        + Start New Chat
      </button>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No previous chats.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, i) => (
            <div
              key={i}
              onClick={() => onSelect(session)}
              className="cursor-pointer p-3 rounded-lg hover:bg-pink-100 transition-all"
            >
              <div className="font-semibold text-pink-600">
                {session.title || 'Untitled'}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(session.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

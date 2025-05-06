// src/components/ChatInput.jsx
import React from 'react';

export default function ChatInput({ onSend, sending, input, setInput }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return; // Don't send if input is empty or sending is in progress
    onSend(input);
    setInput(''); // Reset input after sending
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 mt-4 bg-white p-3 rounded-lg shadow-md">
      <input
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your counselor..."
        disabled={sending}
      />
      <button
        type="submit"
        className={`px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-200
          ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={sending}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}

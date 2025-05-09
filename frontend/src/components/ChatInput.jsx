// src/components/ChatInput.jsx
import React from 'react';

// Receive disabled prop
export default function ChatInput({ onSend, sending, input, setInput, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || sending || disabled) return; // Check disabled prop
    onSend(input);
    // setInput(''); // Input is now cleared in the parent AIChatPage after optimistic update
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"> {/* Themed container, increased gap/padding */}
      <input
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed" // Themed input, disabled state
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your AI counselor..." // Updated placeholder
        disabled={disabled} // Use disabled prop
        aria-label="Type your message" // Accessibility
      />
      <button
        type="submit"
        className={`px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`} // Themed button, disabled state
        disabled={disabled} // Use disabled prop
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
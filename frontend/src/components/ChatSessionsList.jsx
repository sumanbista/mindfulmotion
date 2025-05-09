// src/components/ChatSessionsList.jsx
import React from 'react';

// Receive 'sending' prop to disable new chat button while sending
export default function ChatSessionsList({ sessions, currentId, onSelect, onNew, sending }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col border border-gray-200"> {/* Themed container */}
      <h2 className="text-xl font-semibold mb-4 text-teal-700">Your Chats</h2> {/* Themed title */}
      <button
        onClick={onNew}
        className={`mb-4 w-full py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${sending // Disable if any message is sending
           ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
           : 'bg-teal-600 text-white hover:bg-teal-700'
        }`}
        disabled={sending} // Disable button while sending
      >
        + Start New Chat
      </button>
      {sessions.length === 0 ? (
        <p className="text-gray-600 italic text-center">No previous chats.</p> 
      ) : (
        <ul className="overflow-y-auto flex-1 -mr-2 pr-2 custom-scrollbar"> {/* Added padding/margin for scrollbar */}
          {sessions.map((session) => (
            <li key={session._id}>
              <button
                onClick={() => onSelect(session)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  session._id === currentId
                    ? 'bg-teal-100 font-semibold text-teal-800 border border-teal-400'
                    : 'hover:bg-gray-100 text-gray-700 border border-transparent'
                }`}
              >
                <div className="font-semibold text-base">
                  {session.title || `Chat on ${new Date(session.createdAt).toLocaleDateString()}`}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
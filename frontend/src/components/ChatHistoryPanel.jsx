// src/components/ChatHistoryPanel.jsx
import React from 'react';

export default function ChatHistoryPanel({ sessions, onSelect, onNew, currentId }) {
  // NOTE: Added currentId prop here, although it wasn't in the original snippet.
  // This prop is necessary for styling the currently selected chat session.
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col border border-gray-200"> {/* Themed container */}
      <h2 className="text-xl font-semibold mb-4 text-teal-700">Past Conversations</h2> {/* Themed title */}
      <button
        onClick={onNew}
        className="mb-4 w-full py-2 rounded-lg font-semibold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-600 hover:bg-teal-700 shadow-md" 
      >
        + Start New Chat
      </button>
      {sessions.length === 0 ? (
        <p className="text-gray-600 italic text-center py-4">No previous chats.</p> 
      ) : (
        <div className="overflow-y-auto flex-1 space-y-3 -mr-2 pr-2 custom-scrollbar"> {/* Themed list container, added spacing and scrollbar classes */}
          {sessions.map((session, i) => (
            <button // Changed div to button for better accessibility
              key={session._id || i} // Use session ID if available for better keys
              onClick={() => onSelect(session)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 border border-transparent ${ // Themed item, hover, and focus
                currentId === session._id // Apply active styles if this is the current session
                  ? 'bg-teal-100 font-semibold text-teal-800 border-teal-400'
                  : 'hover:bg-emerald-100 text-gray-700'
              }`}
               aria-current={currentId === session._id ? 'page' : undefined} // Accessibility
            >
              <div className="font-semibold text-base"> {/* Themed title text */}
                {session.title || `Chat on ${new Date(session.createdAt).toLocaleDateString()}`} {/* Use date as fallback title */}
              </div>
              <div className="text-sm text-gray-600 mt-1"> {/* Themed date text, added margin */}
                {new Date(session.createdAt).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
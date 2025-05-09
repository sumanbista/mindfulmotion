// components/Leaderboard.jsx
import React from 'react';

export default function Leaderboard({ board, currentUserId }) { // Receive currentUserId
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200"> {/* Themed container */}
        <h2 className="text-xl font-semibold mb-4 text-teal-700">Community Leaders</h2> {/* Themed title */}
        {board.length > 0 ? (
             <ol className="space-y-3"> {/* Increased space */}
             {board.map((u, i) => (
               <li
                 key={u.id || u.name + i} // Use ID if available, fallback to name + index
                 className={`flex justify-between items-center py-2 px-3 rounded-md ${u.id === currentUserId ? 'bg-teal-100 border border-teal-400 font-semibold' : 'bg-gray-50 border border-gray-200'}`} // Highlight current user
               >
                 <div className="flex items-center">
                     <span className="text-lg font-bold text-teal-600 mr-3">{i+1}.</span> {/* Themed rank */}
                     <span className={`${u.id === currentUserId ? 'text-teal-900' : 'text-gray-800'}`}>{u.name}</span> 
                 </div>
                 <span className={`font-bold text-pink-600`}>{u.score} pts</span> 
               </li>
             ))}
           </ol>
        ) : (
             <p className="text-gray-600 italic text-center">No leaders yet. Start engaging to appear here!</p>
        )}
      </div>
    );
  }

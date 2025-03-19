import React, { useState } from 'react';

export default function PostCard({ post, onToggleLove, onAddComment }) {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Post Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg">{post.author}</div>
        <button
          onClick={() => onToggleLove(post.id)}
          className="flex items-center transition-colors"
        >
          {/* Conditional Heart Icon */}
          {post.userLoved ? (
            // Fully filled red heart
            <svg className="w-6 h-6 fill-red-500 mr-1" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                       4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
                       14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                       6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            // Outlined heart: no fill, red stroke
            <svg className="w-6 h-6 fill-none stroke-red-500 mr-1" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                       4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
                       14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                       6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
          <span className="text-gray-700">{post.loves}</span>
        </button>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-4">{post.content}</p>

      {/* Comments Section */}
      <div className="border-t pt-2">
        {post.comments.map((comment) => (
          <div key={comment.id} className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">{comment.author}:</span> {comment.text}
          </div>
        ))}

        {/* Add Comment */}
        <div className="mt-2 flex items-center">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={() => {
              onAddComment(post.id, commentText);
              setCommentText("");
            }}
            className="ml-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}

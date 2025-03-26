import React, { useState } from 'react';

const PostCard = ({
  post,
  onToggleLove,
  onAddComment,
  isAuthenticated,
  currentUserId,
  setNewCommentText,
  newCommentText
}) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start mb-4">
        <div className="mr-3">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">
            {post.author.charAt(0)}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">{post.author}</h3>
          <p className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post content */}
      <p className="mb-4">{post.content}</p>


      {/* Interaction buttons */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => onToggleLove(post._id)}
          className={`flex items-center mr-4 ${post.userLoved === true
              ? 'text-red-500'
              : 'text-gray-500 hover:text-red-500'
            } transition-colors`}
          disabled={!isAuthenticated}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          {typeof post.loves === 'number' ? post.loves : (post.loves ? post.loves.length : 0)}
          {(typeof post.loves === 'number' ? post.loves : (post.loves ? post.loves.length : 0)) === 1 ? ' Like' : ' Likes'}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          {post.comments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex">
                  <div className="mr-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-sm font-bold">
                      {comment.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="font-semibold text-sm">{comment.author}</p>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet.</p>
          )}

          <div className="mt-4 flex">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment..."}
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={!isAuthenticated}
            />
            <button
              onClick={() => onAddComment(post._id)}
              className={`px-4 py-2 ${isAuthenticated
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
                } text-white rounded-r`}
              disabled={!isAuthenticated}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

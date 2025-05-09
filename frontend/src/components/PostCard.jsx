import React, { useState } from 'react';

const PostCard = ({
  post,
  onToggleLove,
  onCommentAdded, // Callback when comment is added successfully
  isAuthenticated,
  currentUserId,
  // Removed newCommentText, setNewCommentText from here
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState(''); // Managed locally per post
  const [isAddingComment, setIsAddingComment] = useState(false); // State for comment button loading

  // Add a comment to this specific post
  const handleAddComment = async () => {
    if (newCommentText.trim() === '' || isAddingComment) return;

    if (!isAuthenticated) {
       alert('You must be logged in to comment.'); // Use alert for simple auth check here
       return;
    }

    setIsAddingComment(true); // Start loading state

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/community/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newCommentText }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewCommentText(''); // Clear input on success
        setShowComments(true); // Automatically show comments after adding
        onCommentAdded(); // Trigger refetch in parent component
        // Optional: Optimistically add comment here if refetch is slow,
        // but refetch ensures correct state across all posts/stats.
      } else {
        // Handle specific backend errors
        alert(data.message || 'Failed to add comment.'); // Simple error display
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Network error when adding comment.');
    } finally {
       setIsAddingComment(false); // End loading state
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200"> {/* Themed container */}
      {/* Post Header (Author & Date) */}
      <div className="flex items-start mb-4">
        <div className="mr-3">
          {/* Themed Avatar */}
          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
            {post.author ? post.author.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{post.author || 'Anonymous'}</h3> {/* Themed author name */}
          <p className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleString()} {/* Use toLocaleString for more detail */}
          </p>
        </div>
      </div>

      {/* Post content */}
      <p className="mb-4 text-gray-800">{post.content}</p> {/* Themed text */}


      {/* Interaction buttons */}
      <div className="flex items-center border-t border-gray-200 pt-3"> {/* Added border top */}
        <button
          onClick={() => onToggleLove(post._id)} // onToggleLove now triggers parent refetch
          className={`flex items-center mr-4 text-gray-600 transition-colors focus:outline-none ${isAuthenticated ? (post.userLoved ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500') : 'cursor-not-allowed opacity-60'}`} // Themed love button states
          disabled={!isAuthenticated}
          aria-label={post.userLoved ? 'Unlike post' : 'Like post'} // Accessibility
        >
           {/* Conditional Heart Icon */}
           <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 mr-1 ${post.userLoved ? 'fill-current' : 'stroke-current'}`} // Filled if loved
              viewBox="0 0 24 24" // Use 24x24 for better icon quality
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
           >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
           </svg>

          {typeof post.loves === 'number' ? post.loves : (post.loves ? post.loves.length : 0)}
          {(typeof post.loves === 'number' ? post.loves : (post.loves ? post.loves.length : 0)) === 1 ? ' Like' : ' Likes'}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors focus:outline-none" // Themed comment button
          aria-expanded={showComments} // Accessibility
          aria-controls={`comments-${post._id}`} // Accessibility
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 24 24" // Use 24x24
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L2 22l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 7.6 4.7z"></path>
          </svg>
          {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div id={`comments-${post._id}`} className="mt-4 border-t border-gray-200 pt-4"> {/* Themed border top */}
          {post.comments.length > 0 ? (
            <div className="space-y-4 mb-4"> {/* Space between comments */}
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start"> {/* Align comment content nicely */}
                  <div className="mr-3">
                     {/* Themed Commenter Avatar */}
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-sm font-bold">
                       {comment.author ? comment.author.charAt(0).toUpperCase() : '?'}
                    </div>
                  </div>
                  <div className="flex-1"> {/* Allow comment content to take available space */}
                    <div className="bg-gray-100 rounded-lg p-3 text-gray-800"> {/* Themed comment bubble */}
                      <p className="font-semibold text-sm mb-1">{comment.author || 'Anonymous'}</p> {/* Themed author name */}
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-3">
                      {new Date(comment.createdAt).toLocaleString()} {/* Themed timestamp */}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic text-center py-4">No comments yet.</p> // Themed empty state
          )}

          {/* Add Comment Form */}
          <div className="mt-4 flex">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={isAuthenticated ? "Add a supportive comment..." : "Log in to comment..."} // Themed placeholder
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out" // Themed input focus
              disabled={!isAuthenticated || isAddingComment} // Disable while adding
            />
            <button
              onClick={handleAddComment}
              className={`px-4 py-2 rounded-r-md font-semibold transition duration-150 ease-in-out ${isAuthenticated && newCommentText.trim() !== '' && !isAddingComment
                ? 'bg-teal-600 hover:bg-teal-700 text-white' // Themed active state
                : 'bg-gray-300 text-gray-600 cursor-not-allowed' // Themed disabled state
                }`}
              disabled={!isAuthenticated || newCommentText.trim() === '' || isAddingComment} // Disable if not authenticated, empty, or submitting
            >
              {isAddingComment ? 'Posting...' : 'Comment'} {/* Button text changes while loading */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
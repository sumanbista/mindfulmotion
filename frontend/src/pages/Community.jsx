// src/pages/Community.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Leaderboard from '../components/Leaderboard';
import BadgesPanel from '../components/BadgesPanel';

export default function Community() {
  // … all your existing state, effects, handlers …


  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ posts: 0, comments: 0, lovesReceived: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  // Check authentication and fetch posts on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem('userInfo')) || {});
    }
    fetchPosts();
  }, []);

  
  // Fetch posts from the server
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/community');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setPosts(data);
      computeStats(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load community posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  function computeStats(allPosts) {
    const byUser = {};
    allPosts.forEach(post => {
      const uid = post.userId;
      if (!byUser[uid]) {
        byUser[uid] = { name: post.author, posts: 0, comments: 0, lovesReceived: 0 };
      }
      byUser[uid].posts++;
      byUser[uid].lovesReceived += post.loves;
      post.comments.forEach(() => byUser[uid].comments++);
    });
    setStats(byUser[user?._id] || { posts: 0, comments: 0, lovesReceived: 0 });
    const board = Object.values(byUser)
      .map(u => ({ ...u, score: u.posts * 3 + u.comments + u.lovesReceived * 2 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    setLeaderboard(board);
  }

  // Add a new post with authentication
  const handleAddPost = async () => {
    if (newPostContent.trim() === '') return;

    if (!isAuthenticated) {
      const confirmed = window.confirm('You must be logged in to post. Would you like to go to the login page?');
      if (confirmed) {
        navigate('/login');
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPostContent }),
      });

      const data = await response.json();

      if (response.ok) {
        setPosts([data, ...posts]);
        setNewPostContent('');
      } else {
        if (response.status === 401) {
          handleAuthError();
        } else {
          setError(data.message || 'Failed to create post');
        }
      }
    } catch (error) {
      console.error('Error adding post:', error);
      setError('Network error when creating post');
    }
  };
  // Add a comment to a post with authentication
  const handleAddComment = async (postId) => {
    if (newCommentText.trim() === '') return;

    if (!isAuthenticated) {
      const confirmed = window.confirm('You must be logged in to comment. Would you like to go to the login page?');
      if (confirmed) {
        navigate('/login');
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/community/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newCommentText }),
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, comments: [...post.comments, data] } : post
          )
        );
        setNewCommentText('');
      } else {
        if (response.status === 401) {
          handleAuthError();
        } else {
          setError(data.message || 'Failed to add comment');
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Network error when adding comment');
    }
  };

  // Toggle love reaction for a post with authentication
  const handleToggleLove = async (postId) => {
    if (!isAuthenticated) {
      const confirmed = window.confirm('You must be logged in to like posts. Would you like to go to the login page?');
      if (confirmed) {
        navigate('/login');
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/community/${postId}/love`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Toggle love for post ${postId}:`, data);
        setPosts(
          posts.map((post) => {
            if (post._id === postId) {
              console.log(`Updating post ${postId} userLoved to:`, data.userLoved);
              return {
                ...post,
                loves: data.loves,
                userLoved: data.userLoved
              };
            }
            return post;
          })
        );
      } else {
        if (response.status === 401) {
          handleAuthError();
        } else {
          setError(data.message || 'Failed to update like status');
        }
      }
    } catch (error) {
      console.error('Error toggling love reaction:', error);
      setError('Network error when updating like status');
    }
  };

  // Handle authentication errors (token expired, invalid, etc.)
  const handleAuthError = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUser(null);

    const confirmed = window.confirm('Your session has expired or is invalid. Would you like to log in again?');
    if (confirmed) {
      navigate('/login');
    }
  };


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Community</h1>

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Auth Status Banner */}
      {!isAuthenticated && (
        <div className="max-w-2xl mx-auto mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Not Logged In</p>
          <p className="mb-2">You need to log in to post, comment, or like content.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
          >
            Log In
          </button>
        </div>
      )}

      {/* New Post Form */}
      <div className="max-w-2xl mx-auto mb-6 bg-white p-6 rounded-lg shadow">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder={isAuthenticated ? "Share your thoughts..." : "Log in to share your thoughts..."}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows={3}
          disabled={!isAuthenticated}
        ></textarea>
        <div className="flex justify-between items-center mt-3">
          {isAuthenticated && user && (
            <div className="text-sm text-gray-500">
              Posting as: {user.firstName} {user.lastName}
            </div>
          )}
          <button
            onClick={handleAddPost}
            className={`bg-blue-500 text-white px-6 py-2 rounded-full ${isAuthenticated
              ? 'hover:bg-blue-600 transition-colors'
              : 'opacity-50 cursor-not-allowed'
              }`}
            disabled={!isAuthenticated}
          >
            Post
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-2xl mx-auto text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      )}

      
       {/* Main layout */}
       <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left: Community Discussions */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Community Discussions</h2>
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-gray-500">No posts yet</div>
              ) : (
                posts.map(post => (
                  <div
                    key={post._id}
                    className="bg-yellow-100 rounded-lg p-4"
                  >
                    <PostCard
                      post={post}
                      isAuthenticated={isAuthenticated}
                      onToggleLove={handleToggleLove}
                      onAddComment={() => handleAddComment(post._id)}
                      currentUserId={user?._id}
                      newCommentText={newCommentText}
                      setNewCommentText={setNewCommentText}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Leaderboard & Badges */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Leaderboard board={leaderboard} />
          <BadgesPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}
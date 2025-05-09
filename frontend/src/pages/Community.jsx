// src/pages/Community.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Leaderboard from '../components/Leaderboard';
import BadgesPanel from '../components/BadgesPanel';
import { auth } from '../../firebase/config';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  // Note: newCommentText is managed per post in PostCard now for better UX
  // const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ posts: 0, comments: 0, lovesReceived: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  // Check authentication and fetch posts on component mount
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          setError('You are not authorized to access this page. Please sign up or log in.');
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/community', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Request Headers:', {
          Authorization: `Bearer ${token}`
        });
        if (res.status === 401) {
          setError('You are not authorized to access this. Please sign up or log in.');
          return;
        }
        if (!res.ok) throw new Error(res.statusText);
        setPosts(await res.json()); // Correctly set the posts state
      } catch (e) {
        setError('You are not authorized to access this. Please sign up or log in.');
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [navigate]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        console.log('Token:', token);
        if (token) {
          setIsAuthenticated(true);
          setUser(auth.currentUser); // Set the user object
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Refetch posts after actions that change data (post, comment, love)
  // This is simpler than optimistically updating nested state
  const refetchAllData = () => {
      fetchPosts(); // fetchPosts also computes stats and leaderboard
  }


  // Fetch posts from the server
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/community');
      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP status ${res.status}`);
      }
      const data = await res.json();
      setPosts(data);
      // Compute stats and leaderboard AFTER posts are fetched and set
      computeStats(data);
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError(`Failed to load community posts: ${err.message || 'Network error'}.`);
    } finally {
      setLoading(false);
    }
  };

  function computeStats(allPosts) {
    const byUser = {};
     // Ensure user object is available before computing user-specific stats
     const currentUserId = user?._id;

    allPosts.forEach(post => {
      const uid = post.userId;
      // Use author name from post if user object not fully available in stats map
      const userName = post.author || 'Anonymous';

      if (!byUser[uid]) {
        byUser[uid] = { id: uid, name: userName, posts: 0, comments: 0, lovesReceived: 0 };
      }
      byUser[uid].posts++;
      // Ensure post.loves is treated as a number for summation
      byUser[uid].lovesReceived += (typeof post.loves === 'number' ? post.loves : (post.loves ? post.loves.length : 0));
      post.comments.forEach(() => byUser[uid].comments++);
    });

    // Update user's own stats
    if (currentUserId) {
        setStats(byUser[currentUserId] || { posts: 0, comments: 0, lovesReceived: 0 });
    } else {
         setStats({ posts: 0, comments: 0, lovesReceived: 0 }); // Reset if not logged in
    }


    // Compute and sort leaderboard
    const board = Object.values(byUser)
      .map(u => ({ ...u, score: u.posts * 3 + u.comments + u.lovesReceived * 2 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Show top 5
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

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in to post.');
      return;
    }

    setError(null); // Clear previous errors

    try {
      const token = await auth.currentUser?.getIdToken(true); // Force refresh the token
      if (!token) {
        alert('You are not logged in. Please log in to post.');
        return;
      }
      console.log('Token retrieved:', token); // Debug log to confirm token retrieval
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
        // Option 1: Prepend new post and then refresh all data for correct stats/leaderboard
        setPosts([data, ...posts]); // Optimistically add
        setNewPostContent('');
        refetchAllData(); // Refresh data state from server
      } else {
        if (response.status === 401) {
          handleAuthError();
        } else {
          setError(data.message || 'Failed to create post');
        }
      }
    } catch (error) {
      console.error('Error adding post:', error);
      setError('Network error when creating post.');
    }
  };

   // Handle authentication errors (token expired, invalid, etc.)
  const handleAuthError = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUser(null);
    setError('Your session has expired or is invalid. Please log in again.'); // Set error message
    // Do NOT auto-navigate, let the user click the banner button if they choose
    // const confirmed = window.confirm('Your session has expired or is invalid. Would you like to log in again?');
    // if (confirmed) {
    //   navigate('/login');
    // }
  };


  return (
    <div className="min-h-screen py-8 bg-emerald-50 text-gray-800"> {/* Themed background and text */}
      <div className="container mx-auto px-4"> {/* Centered container with padding */}
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-800"> {/* Larger, themed title */}
          Community Space
        </h1>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-300 text-red-700 p-4 rounded-md shadow-sm"> {/* Themed error banner */}
            <p className="font-semibold mb-1">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Auth Status Banner */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-6 bg-yellow-50 border border-yellow-300 text-yellow-700 p-4 rounded-md shadow-sm"> {/* Themed auth warning banner */}
            <p className="font-semibold mb-2">Not Logged In</p>
            <p className="mb-3 text-sm">You need to log in to post, comment, or like content. Your session might have expired.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded transition-colors"
            >
              Log In Now
            </button>
          </div>
        )}

        {/* New Post Form */}
        <div className="max-w-2xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200"> {/* Themed container */}
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={isAuthenticated ? "Share your thoughts or ask a question..." : "Log in to share your thoughts..."}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out resize-none" 
            rows={4} // Increased rows for better visibility
            disabled={!isAuthenticated}
          ></textarea>
          <div className="flex justify-end items-center mt-4"> {/* Align button to the right */}
             {/* Removed user info display next to button for cleaner look */}
            <button
              onClick={handleAddPost}
              className={`px-6 py-3 bg-teal-600 text-white font-semibold rounded-full shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${!isAuthenticated || newPostContent.trim() === '' // Disable if not authenticated or empty
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              disabled={!isAuthenticated || newPostContent.trim() === ''}
            >
              Post to Community
            </button>
          </div>
           {/* Optional: Display logged in user info below the textarea if desired */}
           {isAuthenticated && user && (
             <div className="text-sm text-gray-600 mt-3">
                Logged in as: <span className="font-semibold">{user.firstName} {user.lastName}</span>
             </div>
           )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div>{/* Themed spinner */}
            <p className="mt-4 text-gray-600 text-lg">Loading community discussions...</p>
          </div>
        )}

         {/* Empty state for posts */}
        {!loading && posts.length === 0 && !error && (
             <div className="max-w-2xl mx-auto text-center py-8 text-gray-600 text-lg">
                 <p className="mb-3">No posts in the community yet.</p>
                 <p>Be the first to share your thoughts!</p>
             </div>
        )}


        {/* Main layout (Posts + Sidebar) */}
        {!loading && posts.length > 0 && !error && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Using Grid for better layout control */}
            {/* Left: Community Discussions (takes 2/3 of space on large screens) */}
            <div className="lg:col-span-2 space-y-6"> {/* Posts column */}
                {posts.map(post => (
                    // PostCard now handles its own container styling
                    <PostCard
                        key={post._id}
                        post={post}
                        isAuthenticated={isAuthenticated}
                        onToggleLove={refetchAllData} // Refetch all data after toggle
                        onCommentAdded={refetchAllData} // Refetch all data after comment
                        currentUserId={user?._id}
                         // Removed newCommentText state from here, moved to PostCard
                    />
                ))}
            </div>

            {/* Right: Leaderboard & Badges (takes 1/3 of space on large screens) */}
            <div className="lg:col-span-1 space-y-6"> {/* Sidebar column */}
              <Leaderboard board={leaderboard} currentUserId={user?._id} /> {/* Pass current user ID */}
              <BadgesPanel stats={stats} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import SessionCard from '../components/SessionCard';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config'; 

export default function Meditation() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // pagination + filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 6;

  const categories = ['all', 'relax', 'focus', 'sleep', 'energy', 'mindfulness'];
  const navigate = useNavigate();

  // Map focus categories to corresponding images
  const categoryImages = {
    relax: '/images/meditation/relax1.png',
    focus: '/images/meditation/focus1.png',
    sleep: '/images/meditation/sleep1.png',
    energy: '/images/meditation/energy1.png',
    mindfulness: '/images/meditation/mindfulness1.png',
  };

  // fetch sessions once on component mount
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('You must be logged in to access meditation sessions.');
          navigate('/login');
          return;
        }
        const token = await user.getIdToken();

        const res = await fetch('http://localhost:5000/api/sessions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Clear token and redirect to login
          localStorage.removeItem('token'); // Clear token if stored there too
          navigate('/login');
          return; // Stop execution
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP status ${res.status}`);
        }
        setSessions(await res.json());
      } catch (e) {
        console.error("Error loading sessions:", e);
        setError(`Failed to load sessions: ${e.message || 'Network error'}. Please try again or log in.`);
      } finally {
        setLoading(false);
      }
    };

     // Add an observer to wait for auth state to be ready
     const unsubscribe = auth.onAuthStateChanged(user => {
         if (user) {
             loadSessions();
         } else {
             setLoading(false);
             setError('You must be logged in to access meditation sessions.');
             navigate('/login');
         }
     });

     // Cleanup observer on component unmount
     return () => unsubscribe();

  }, [navigate]); // navigate is a dependency

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Display loading state
  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-emerald-50"> 
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div> 
        <p className="mt-4 text-gray-700 text-lg">Loading meditation sessions...</p> 
      </div>
    </div>
  );

  // Display error state
  if (error) return (
    <div className="min-h-screen flex justify-center items-center bg-emerald-50"> 
      <div className="text-center p-6 bg-white rounded-lg shadow-md border border-red-300"> 
        <p className="text-red-700 font-semibold mb-4">{error}</p> 
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-150 ease-in-out" 
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  // filter & paginate sessions
  const filtered = selectedCategory === 'all'
    ? sessions
    : sessions.filter(s => s.focus.toLowerCase() === selectedCategory);

  const startIdx = (currentPage - 1) * sessionsPerPage;
  const page = filtered.slice(startIdx, startIdx + sessionsPerPage);
  const total = Math.ceil(filtered.length / sessionsPerPage);

  return (
    <div className="min-h-screen bg-emerald-50 py-8"> 
      <div className="container mx-auto px-4"> 
        <h1 className="text-3xl font-bold text-center mb-8 text-teal-800">Meditation Sessions</h1>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                `px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                  cat === selectedCategory
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                }`
              }
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Session grid */}
        {page.length === 0 ? (
             <div className="text-center text-gray-600 italic text-lg py-8">
                 No sessions found for the selected category.
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
              {page.map(session => (
                <SessionCard
                  key={session._id}
                  id={session._id} 
                  title={session.title}
                  focus={session.focus}
                  rating={session.rating}
                  userRating={session.userRating} 
                  videoId={session.videoId}
                  backgroundImage={categoryImages[session.focus.toLowerCase()] || '/images/meditation/default.png'}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                  onRatingChange={(sessionId, newRating) => { 
                    
                    const token = auth.currentUser?.getIdToken();
                    fetch(`http://localhost:5000/api/sessions/${sessionId}/ratings`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Use token
                      },
                      body: JSON.stringify({ rating: newRating })
                    })
                      .then(async (r) => {
                         if (!r.ok) {
                             const errorData = await r.json();
                             throw new Error(errorData.message || `HTTP status ${r.status}`);
                         }
                         return r.json();
                       })
                      .then(({ averageRating, userRating: newUserRating }) => { 
                        
                        setSessions(prevSessions =>
                            prevSessions.map(s =>
                                s._id === sessionId
                                    ? { ...s, rating: averageRating, userRating: newUserRating }
                                    : s
                            )
                        );
                     
                      })
                      .catch(e => {
                         console.error("Error submitting rating:", e);
                         alert(`Failed to submit rating: ${e.message || 'Network error'}`); 
                         
                      });
                  }}
                />
              ))}
            </div>
        )}


        {/* Pagination controls */}
        {total > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2"> 
             <span className="text-gray-700 text-sm">Page {currentPage} of {total}</span> 
             <button
               onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
               disabled={currentPage === 1}
               className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400" // Themed button
               aria-label="Previous page"
             >
                ‹
             </button>

            {/* Display only a limited range of page numbers around current page */}
            {Array.from({length: total}, (_, i) => i + 1)
                
                .map(n => (
               <button
                 key={n}
                 onClick={() => setCurrentPage(n)}
                 className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                   n === currentPage ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                 }`}
                 aria-current={n === currentPage ? 'page' : undefined} 
               >
                 {n}
               </button>
             ))}

            <button
              onClick={() => currentPage < total && setCurrentPage(currentPage + 1)}
              disabled={currentPage === total}
              className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
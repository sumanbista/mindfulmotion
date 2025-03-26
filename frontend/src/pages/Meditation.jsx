import React, { useState, useEffect } from 'react';
import SessionCard from '../components/SessionCard';

export default function Meditation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [selectedMood, setSelectedMood] = useState('all');
  const [userRatings, setUserRatings] = useState({});
  const [averageRatings, setAverageRatings] = useState({});
  const [videosByCategory, setVideosByCategory] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(6); // 6 cards per page (2 rows of 3)

  // Add background images for each mood category
  const backgroundImages = {
    relax: [
      "/images/meditation/relax1.png"
    ],
    focus: [
      "/images/meditation/focus1.png"
    ],
    sleep: [
      "/images/meditation/sleep1.png"
    ],
    energy: [
      "/images/meditation/energy1.png"
    ],
    mindfulness: [
      "/images/meditation/mindfulness1.png"
    ]
  };
  
  // Default fallback image if none are found
  const defaultBackground = "/images/meditation/default.png";

  // When mood changes, reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMood]);

  // Load user ratings from localStorage on component mount
  useEffect(() => {
    const savedRatings = localStorage.getItem('meditationRatings');
    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
  }, []);

  // Predefined moods for filtering
  const moods = [
    { id: 'all', label: 'All Sessions' },
    { id: 'relax', label: 'Relaxation' },
    { id: 'focus', label: 'Focus' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'energy', label: 'Energy' },
    { id: 'mindfulness', label: 'Mindfulness' }
  ];

  // Fallback sessions data if API call fails
  const fallbackSessions = [
    {
      id: 'session1',
      title: 'Deep Relaxation',
      focus: 'Stress relief',
      mood: 'relax',
      videoId: 'jkLRith2wcc'
    },
    {
      id: 'session2',
      title: 'Mindful Breathing',
      focus: 'Anxiety reduction',
      mood: 'mindfulness',
      videoId: 'wfDTp2GogaQ'
    },
    {
      id: 'session3',
      title: 'Sleep Meditation',
      focus: 'Better sleep',
      mood: 'sleep',
      videoId: 'aEqlQvczMVQ'
    },
    {
      id: 'session4',
      title: 'Morning Energy',
      focus: 'Start your day',
      mood: 'energy',
      videoId: 'ENYYb5vIMkU'
    },
    {
      id: 'session5',
      title: 'Focus & Clarity',
      focus: 'Concentration',
      mood: 'focus',
      videoId: 'nPbZEBGLOas'
    },
    {
      id: 'session6',
      title: 'Gentle Relaxation',
      focus: 'Unwinding',
      mood: 'relax',
      videoId: 'ez3GgRqhNvA'
    },
    {
      id: 'session7',
      title: 'Body Scan',
      focus: 'Physical awareness',
      mood: 'mindfulness',
      videoId: '0KEcgb9lRDM'
    },
    {
      id: 'session8',
      title: 'Calm Mind',
      focus: 'Mental clarity',
      mood: 'focus',
      videoId: 'O-6f5wQXSu8'
    },
    {
      id: 'session9',
      title: 'Evening Wind Down',
      focus: 'Preparation for sleep',
      mood: 'sleep',
      videoId: 'O-6f5wQXSu8'
    },
    {
      id: 'session10',
      title: 'Quick Energy Boost',
      focus: '5-minute refresh',
      mood: 'energy',
      videoId: 'cLsGJ5NPidQ'
    },
    {
      id: 'session11',
      title: 'Loving Kindness',
      focus: 'Compassion',
      mood: 'mindfulness',
      videoId: '1eLKdc4qnHE'
    },
    {
      id: 'session12',
      title: 'Deep Concentration',
      focus: 'Work & study',
      mood: 'focus',
      videoId: 'ViiJ1fZr2QI'
    },
    {
      id: 'session13',
      title: 'Peaceful Sleep',
      focus: 'Insomnia relief',
      mood: 'sleep',
      videoId: 'YatCGAsshh0'
    },
    {
      id: 'session14',
      title: 'Ocean Relaxation',
      focus: 'Stress relief',
      mood: 'relax',
      videoId: 'xBZ5ab-9e9M'
    },
    {
      id: 'session15',
      title: 'Morning Stretch',
      focus: 'Body awakening',
      mood: 'energy',
      videoId: 'inpok4MKVLM'
    }
  ];

  // Filter sessions based on selected mood
  const filteredSessions = selectedMood === 'all' 
    ? fallbackSessions 
    : fallbackSessions.filter(session => session.mood === selectedMood);

  // Calculate pagination
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  // Helper function to get a video for a session
  const getVideoForSession = (session) => {
    const mood = session.mood;
    
    // If we don't have videos for this mood, return the session's default video ID
    if (!videosByCategory || !videosByCategory[mood] || videosByCategory[mood].length === 0) {
      console.warn(`No videos found for mood: ${mood}`);
      return session.videoId; // Return the fallback videoId from the session
    }
    
    // Get the session number from the ID for deterministic video selection
    const sessionNumber = parseInt(session.id.replace('session', ''), 10) - 1;
    const videoIndex = sessionNumber % videosByCategory[mood].length;
    
    return videosByCategory[mood][videoIndex];
  };

  // Helper function to get a background image for a session
  const getBackgroundImage = (session) => {
    const mood = session.mood;
    
    // If we have images for this mood category
    if (backgroundImages[mood] && backgroundImages[mood].length > 0) {
      // Get session number and map it to an image (ensures consistency)
      const sessionNumber = parseInt(session.id.replace('session', ''), 10) - 1;
      const imageIndex = sessionNumber % backgroundImages[mood].length;
      return backgroundImages[mood][imageIndex];
    }
    
    // Return default image if nothing found
    return defaultBackground;
  };

  // Handle rating changes and save to localStorage
  const handleRatingChange = (sessionId, newRating) => {
    const updatedRatings = {
      ...userRatings,
      [sessionId]: newRating
    };
    
    // If the rating is 0, remove it
    if (newRating === 0) {
      delete updatedRatings[sessionId];
    }
    
    setUserRatings(updatedRatings);
    localStorage.setItem('meditationRatings', JSON.stringify(updatedRatings));
    
    // Calculate new average (this is a simplified version)
    // In a real app, you'd send this to a backend API
    const currentAvg = averageRatings[sessionId] || 0;
    const currentCount = currentAvg > 0 ? 1 : 0; // Simplified - assuming 1 rating exists if there's an average
    
    let newAverage;
    if (newRating === 0) {
      // If removing rating
      newAverage = 0;
    } else if (currentCount === 0) {
      // If this is the first rating
      newAverage = newRating;
    } else {
      // If updating an existing rating (simplified)
      newAverage = ((currentAvg * currentCount) - (userRatings[sessionId] || 0) + newRating) / currentCount;
    }
    
    setAverageRatings({
      ...averageRatings,
      [sessionId]: Math.round(newAverage * 10) / 10 // Round to 1 decimal
    });
  };

  // Fetch videos for each category
  useEffect(() => {
    // Initialize state
    setLoading(true);
    const videoMap = {
      relax: [],
      focus: [],
      sleep: [],
      energy: [],
      mindfulness: []
    };
    
    // Fetch videos for each category
    const fetchAllCategories = async () => {
      try {
        // Get all categories
        const categories = Object.keys(videoMap);
        
        // Create an array of promises for parallel fetching
        const fetchPromises = categories.map(category => 
          fetch(`http://localhost:5000/api/videos/${category}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${category} videos: ${response.status}`);
              }
              return response.json();
            })
            .then(videos => {
              console.log(`Received ${videos.length} videos for ${category}:`, videos);
              videoMap[category] = videos;
            })
            .catch(error => {
              console.error(`Error fetching ${category} videos:`, error);
              // Keep the category empty array on error
            })
        );
        
        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
        
        // Update state with fetched videos
        setVideosByCategory(videoMap);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllCategories();
  }, []);
  

  // Loading screen
  if (loading) {
    return <div className="p-6 text-center">Loading meditation sessions...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto"> {/* Added max-width and centered */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Meditation Sessions
      </h2>
      
      {/* Error handling */}
      {(error || !Object.values(videosByCategory).some(videos => videos && videos.length > 0)) && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-medium">{error ? "Connection Error" : "Video Loading Issue"}</p>
          <p className="mt-1">
            {error 
              ? error 
              : "Could not load meditation videos. Using default background images instead."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      {/* Mood Filter */}
      <div className="mb-8">
        <p className="text-gray-600 mb-3">Filter by mood:</p>
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedMood === mood.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count and page indicator */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>
          {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'} found
        </div>
        {totalPages > 1 && (
          <div>
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Grid of session cards - using paged sessions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentSessions.map((session) => {
          const videoId = getVideoForSession(session);
          const backgroundImage = getBackgroundImage(session);
          
          return (
            <SessionCard
              key={session.id}
              id={session.id}
              title={session.title}
              focus={session.focus}
              rating={averageRatings[session.id] || 0}
              userRating={userRatings[session.id]}
              videoId={videoId}
              backgroundImage={backgroundImage}
              currentlyPlaying={currentlyPlaying}
              setCurrentlyPlaying={setCurrentlyPlaying}
              onRatingChange={handleRatingChange}
            />
          );
        })}
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-6">
          <nav className="flex items-center rounded-md">
            {/* Previous page button */}
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-blue-500 hover:bg-blue-50'
              }`}
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
              // If we have many pages, only show some page numbers
              if (
                totalPages <= 7 || 
                number === 1 || 
                number === totalPages ||
                (number >= currentPage - 1 && number <= currentPage + 1)
              ) {
                return (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-1 border-t border-b ${
                      currentPage === number
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-blue-500 hover:bg-blue-50'
                    } ${number === 1 ? 'border-l' : ''} ${number === totalPages ? 'border-r' : ''}`}
                    aria-label={`Page ${number}`}
                    aria-current={currentPage === number ? 'page' : undefined}
                  >
                    {number}
                  </button>
                );
              } else if (
                (number === currentPage - 2 && currentPage > 3) || 
                (number === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                // Show ellipsis for skipped pages
                return (
                  <span 
                    key={number} 
                    className="px-3 py-1 border-t border-b bg-white text-gray-500"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            
            {/* Next page button */}
            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r-md border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-500 hover:bg-blue-50'
              }`}
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
      
      {/* No results message */}
      {filteredSessions.length === 0 && (
        <div className="bg-gray-50 rounded-md p-8 text-center">
          <p className="text-lg text-gray-600 mb-2">No meditation sessions found for this mood.</p>
          <p className="text-gray-500">Try selecting a different mood category.</p>
        </div>
      )}
    </div>
  );
}
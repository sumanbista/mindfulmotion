import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

// --- Sub-components with Themed Styling ---

// 1. Thumbnail image component
function ThumbnailImage({ backgroundImage, title, imageError, handleImageError }) {
  return (
    <div className="relative h-full w-full"> {/* Ensure div fills container */}
      <img
        src={backgroundImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={handleImageError}
      />
      
      {/* Fallback for errors or if image is missing */}
      {(imageError || !backgroundImage) && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
      )}
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div> {/* Slightly darker overlay */}
    </div>
  );
}

// 2. Video player component
function VideoPlayer({ actualVideoId, opts, onReady, onError, handleStop }) {
  return (
    <div className="relative h-40 w-full bg-black"> {/* Ensure div takes full width */}
      <YouTube
        videoId={actualVideoId}
        opts={{
          ...opts,
          height: '100%',
          width: '100%',
        }}
        onReady={onReady}
        onError={onError}
        className="w-full h-full object-contain" // Added object-contain
      />
      <button
        onClick={handleStop}
        className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white p-1.5 rounded-full hover:bg-opacity-75 transition-opacity z-10 focus:outline-none focus:ring-2 focus:ring-white" // Themed stop button look
        aria-label="Stop video"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

// 3. Play/Stop button component
function PlayStopButton({ playing, handlePlay, handleStop, actualVideoId }) {
  if (playing) {
    return (
      <button
        onClick={handleStop}
        className="flex items-center text-xs font-medium text-red-600 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" // Themed stop button text
        aria-label="Stop"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
        </svg>
        Stop
      </button>
    );
  }
  
  return (
    <button
      onClick={handlePlay}
      disabled={!actualVideoId}
      className={`flex items-center text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${actualVideoId ? 'text-teal-600 hover:text-teal-800' : 'text-gray-500 cursor-not-allowed'}`} // Themed play button text
      aria-label="Play"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
      Play
    </button>
  );
}

// --- Main SessionCard component ---
export default function SessionCard({
  id,
  title,
  focus,
  rating, // Average rating
  userRating, // Current user's rating for this session
  videoId,
  backgroundImage,
  currentlyPlaying,
  setCurrentlyPlaying,
  onRatingChange // This function should accept (sessionId, newRating)
}) {
  const [playing, setPlaying] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const playerRef = useRef(null);
  const cardId = id; // Use session ID as card ID for uniqueness

  // Extract YouTube ID from various inputs (URL, embed code, just ID)
  const extractVideoId = (input) => {
    if (!input) return null;
    const urlMatch = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))([^&]+)/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];

    // Check for embed code
    const embedMatch = input.match(/\/embed\/([^?]+)/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];

    // Assume it's just the ID if short and no special characters
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

    return null; // Return null if no valid ID found
  };


  const actualVideoId = extractVideoId(videoId);

  // YouTube player options
  const opts = {
    playerVars: {
      autoplay: 1, // Autoplay when played
      controls: 1, // Show controls
      modestbranding: 1, // Hide YouTube logo button
      rel: 0, // Disable related videos at the end
      fs: 1, // Enable fullscreen button
      showinfo: 0, // Hide video title and uploader info
     iv_load_policy: 3, // Hide annotations
    },
  };

  // Handle image loading error
  const handleImageError = () => {
    console.warn(`Failed to load image: ${backgroundImage}`); // Use warn for non-critical
    setImageError(true);
  };

  // Listen for changes in currently playing video across all cards
  useEffect(() => {
    if (currentlyPlaying !== null && currentlyPlaying !== cardId && playing) {
      // If another card started playing, stop this one
      handleStop(); // Use the internal stop handler
    }
    
    // Clean up when the component unmounts or when the session changes
    return () => {
      try {
        if (playing && 
            playerRef.current && 
            playerRef.current.internalPlayer && 
            typeof playerRef.current.internalPlayer.stopVideo === 'function') {
          playerRef.current.internalPlayer.stopVideo();
          playerRef.current = null;
        }
      } catch (error) {
        console.error("Error cleaning up video player:", error);
      }
    };
  }, [currentlyPlaying, cardId, playing]); // Dependencies

  // Handle play action
  const handlePlay = () => {
    if (!actualVideoId) {
      console.warn("No valid video ID available for this session:", videoId);
      return;
    }
    
    try {
      // If there's already a video playing somewhere, make sure to reset the global state
      if (currentlyPlaying !== null && currentlyPlaying !== cardId) {
        // Signal to other cards that they should stop
        setCurrentlyPlaying(null);
        
        // Wait a small amount of time for other players to clean up
        setTimeout(() => {
          setPlaying(true);
          setCurrentlyPlaying(cardId); // Notify parent this card is playing
        }, 100); // Increased timeout to ensure proper cleanup
      } else {
        // Normal play case when nothing else is playing
        setPlaying(true);
        setCurrentlyPlaying(cardId); // Notify parent this card is playing
      }
    } catch (error) {
      console.error("Error in play handler:", error);
    }
  };

  // Handle stop action
  const handleStop = () => {
    if (!playing) return; // Only stop if currently playing

    setPlaying(false);
    if (currentlyPlaying === cardId) {
      setCurrentlyPlaying(null); // Notify parent this card stopped
    }
    
    // Stop the actual YouTube player with thorough null checking
    try {
      if (playerRef.current && 
          playerRef.current.internalPlayer && 
          typeof playerRef.current.internalPlayer.stopVideo === 'function') {
        playerRef.current.internalPlayer.stopVideo();
        // Release the player reference to avoid memory leaks and issues with subsequent plays
        setTimeout(() => {
          playerRef.current = null;
        }, 100);
      }
    } catch (error) {
      console.error("Error stopping video:", error);
    }
    
    // Show rating modal after stopping
    setShowRatingModal(true);
  };

  // Handle rating submission from modal
  const submitRating = (newRating) => {
    // Call the parent function to handle the API call
    onRatingChange(id, newRating); // Pass session ID and new rating up
    setShowRatingModal(false); // Close modal
  };

  // YouTube player ready handler
  const onReady = (event) => {
    try {
      // Store player instance with validation
      if (event && event.target) {
        playerRef.current = event.target;
      } else {
        console.warn('YouTube player ready event missing target');
      }
    } catch (error) {
      console.error("Error in YouTube player ready handler:", error);
    }
  };

  // YouTube player error handler
  const onError = (event) => {
    console.error("YouTube Player Error:", event.data);
    // Handle specific error codes if necessary (e.g., invalid video ID)
    setPlaying(false); // Stop playing state on error
    if (currentlyPlaying === cardId) {
       setCurrentlyPlaying(null);
    }
    // Optional: Show an error message on the card
    // setError("Error loading video.");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-200"> {/* Themed container */}
      {/* Media Section - Either Video Player or Thumbnail Image */}
      <div className="w-full h-40 relative"> {/* Wrapper div for consistent height */}
          {playing && actualVideoId ? (
            <VideoPlayer
              actualVideoId={actualVideoId}
              opts={opts}
              onReady={onReady}
              onError={onError}
              handleStop={handleStop}
            />
          ) : (
            <div className="relative h-full"> {/* Ensure thumbnail div fills wrapper */}
              <ThumbnailImage
                backgroundImage={backgroundImage}
                title={title}
                imageError={imageError}
                handleImageError={handleImageError}
              />
            </div>
          )}
      </div>


      {/* Info Section */}
      <div className="p-4 flex-grow flex flex-col border-t border-gray-200"> {/* Themed padding, flex-grow, top border */}
        <div className="flex justify-between items-start mb-2"> {/* items-start for multi-line titles */}
          {/* Only show title here if not playing, otherwise title is in player area */}
          {!playing && (
            <h3 className="font-bold text-base text-gray-900 flex-grow mr-2">{title}</h3> // Themed title, flex-grow to push button right
          )}

          {/* Play/Stop Button */}
          <div className={`flex-shrink-0 ${!playing ? 'ml-auto' : ''}`}> {/* Push button right if title is present */}
            <PlayStopButton
              playing={playing}
              handlePlay={handlePlay}
              handleStop={handleStop}
              actualVideoId={actualVideoId}
            />
          </div>
        </div>

        {/* Session Focus */}
        <div className="flex items-center text-xs text-gray-600 mb-1.5"> {/* Themed text */}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg> {/* Themed icon */}
          {focus.charAt(0).toUpperCase() + focus.slice(1)} {/* Capitalize focus */}
        </div>

        {/* Star Rating Display */}
        {/* <div className="flex justify-between items-center mb-3"> 
          <StarRatingDisplay // Use the display component
            rating={rating || 0} // Ensure rating is a number, default to 0
            onClick={() => setShowRatingModal(true)} // Open modal on click
          />

          <span className="text-sm text-gray-600"> 
             {rating > 0 ? `${(rating || 0).toFixed(1)}/5` : 'No ratings'} 
          </span>
        </div> */}

        {/* User Rating Section or Rate Button */}
        {/* {userRating !== undefined && userRating !== null ? ( 
          <div className="text-sm text-blue-600 flex justify-end items-center mt-auto"> 
            <span className="mr-1">Your rating: {userRating}/5</span> 
            <button
              onClick={() => setShowRatingModal(true)} 
              className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" 
              aria-label="Edit your rating"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowRatingModal(true)} 
            className="text-sm text-teal-600 hover:underline flex justify-end w-full mt-auto transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 rounded" 
          >
            Rate this session
          </button>
        )} */}
      </div>

      {/* Rating Modal */}
      {/* {showRatingModal && (
        <RatingModal
          title={title}
          userRating={userRating} 
          handleRating={submitRating} 
          onClose={() => setShowRatingModal(false)}
        />
      )} */}
    </div>
  );
}
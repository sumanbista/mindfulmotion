import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

// 1. Thumbnail image component
function ThumbnailImage({ backgroundImage, title, imageError, handleImageError }) {
  return (
    <>
      <img
        src={backgroundImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={handleImageError}
      />
      
      {/* Fallback for errors */}
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      )}
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-opacity-30"></div>
    </>
  );
}

// 2. Video player component
function VideoPlayer({ actualVideoId, opts, onReady, onError, handleStop }) {
  return (
    <div className="relative h-40 bg-black">
      <div className='h-full w-full overflow-hidden'>
        <YouTube
          videoId={actualVideoId}
          opts={{
            ...opts,
            height: '100%',
            width: '100%',
          }}
          onReady={onReady}
          onError={onError}
          className="w-full h-full object-contain"
        />
      </div>
      <button
        onClick={handleStop}
        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors z-10"
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
        className="flex items-center text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
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
      className={`flex items-center text-xs font-medium ${actualVideoId ? 'text-green-500 hover:text-green-600' : 'text-gray-400 cursor-not-allowed'} transition-colors`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
      Play
    </button>
  );
}

// 4. Star rating component
function StarRating({ rating, onClick }) {
  return (
    <div className="flex">
      {Array(5).fill(0).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 cursor-pointer ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={onClick}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// 5. Rating modal component
function RatingModal({ title, userRating, handleRating, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold">Rate this session</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-3 text-gray-600 text-sm">How would you rate "{title}"?</p>

        <div className="flex justify-center mb-4">
          {Array(5).fill(0).map((_, i) => (
            <svg
              key={i}
              className={`w-8 h-8 cursor-pointer ${i < (userRating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              onClick={() => handleRating(i + 1)}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 mr-2 text-sm"
          >
            Cancel
          </button>
          {userRating && (
            <button
              onClick={() => handleRating(0)}
              className="px-3 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
            >
              Remove Rating
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main SessionCard component
export default function SessionCard({
  id,
  title,
  focus,
  rating,
  userRating,
  videoId,
  backgroundImage,
  currentlyPlaying,
  setCurrentlyPlaying,
  onRatingChange
}) {
  const [playing, setPlaying] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const playerRef = useRef(null);
  const cardId = `${id}-${title}`;

  // Extract YouTube ID from HTML iframe if needed
  const extractVideoId = (input) => {
    if (!input) return null;
    if (input.length < 20 && !input.includes('<')) {
      return input;
    }
    const match = input.match(/\/embed\/([^?]+)/);
    return match && match[1] ? match[1] : null;
  };

  const actualVideoId = extractVideoId(videoId);

  // YouTube player options
  const opts = {
    height: '200',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      fs: 1,
    },
  };

  // Handle image loading error
  const handleImageError = () => {
    console.error(`Failed to load image: ${backgroundImage}`);
    setImageError(true);
  };

  // Listen for changes in currently playing video
  useEffect(() => {
    if (currentlyPlaying && currentlyPlaying !== cardId && playing) {
      setPlaying(false);
      if (playerRef.current) {
        try {
          playerRef.current.internalPlayer.stopVideo();
        } catch (error) {
          console.error("Error stopping video:", error);
        }
      }
    }
  }, [currentlyPlaying, cardId, playing]);

  const handlePlay = () => {
    if (!actualVideoId) {
      console.warn("No video ID available for this session");
      return;
    }
    setPlaying(true);
    setCurrentlyPlaying(cardId);
  };

  const handleStop = () => {
    setPlaying(false);
    if (currentlyPlaying === cardId) {
      setCurrentlyPlaying(null);
    }
    if (playerRef.current) {
      try {
        playerRef.current.internalPlayer.stopVideo();
      } catch (error) {
        console.error("Error stopping video:", error);
      }
    }
    setShowRatingModal(true);
  };

  const handleRating = (newRating) => {
    onRatingChange(id, newRating);
    setShowRatingModal(false);
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    try {
      event.target.playVideo();
    } catch (error) {
      console.error("Error playing video:", error);
    }
  };

  const onError = (event) => {
    console.error("YouTube Player Error:", event.data);
    setPlaying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Media Section - Either Video Player or Thumbnail Image */}
      {playing && actualVideoId ? (
        <VideoPlayer 
          actualVideoId={actualVideoId}
          opts={opts}
          onReady={onReady}
          onError={onError}
          handleStop={handleStop}
        />
      ) : (
        <div className="relative h-40">
          <ThumbnailImage
            backgroundImage={backgroundImage}
            title={title}
            imageError={imageError}
            handleImageError={handleImageError}
          />
        </div>
      )}

      {/* Info Section */}
      <div className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-2">
          {!playing && (
            <h3 className="font-bold text-sm md:block">{title}</h3>
          )}

          {/* Play/Stop Button */}
          <div className="flex items-center">
            <PlayStopButton
              playing={playing}
              handlePlay={handlePlay}
              handleStop={handleStop}
              actualVideoId={actualVideoId}
            />
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-600 mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {focus}
        </div>

        {/* Star Rating Display */}
        <div className="flex justify-between items-center mb-1">
          <StarRating 
            rating={rating} 
            onClick={() => setShowRatingModal(true)} 
          />
          
          <span className="text-xs text-gray-500">
            {rating > 0 ? `${rating}/5` : 'No ratings'}
          </span>
        </div>

        {/* User Rating Section */}
        {userRating ? (
          <div className="text-xs text-blue-500 flex justify-end items-center mt-auto">
            <span>Your rating: {userRating}/5</span>
            <button
              onClick={() => setShowRatingModal(true)}
              className="ml-1.5 text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowRatingModal(true)}
            className="text-xs text-blue-500 hover:underline flex justify-end w-full mt-auto"
          >
            Rate this session
          </button>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          title={title}
          userRating={userRating}
          handleRating={handleRating}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
}
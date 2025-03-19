// src/components/SessionCard.jsx
import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';

export default function SessionCard({ title, duration, focus, rating, videoId }) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const togglePlay = (e) => {
    // Prevent any parent click handling
    e.stopPropagation();
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.stopVideo();
      setPlaying(false);
    } else {
      playerRef.current.playVideo();
      setPlaying(true);
    }
  };

  // YouTube player options: hidden via zero width/height (or use CSS display: none)
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button
          onClick={togglePlay}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>
      <p className="text-gray-500">Duration: {duration} mins</p>
      <p className="text-gray-500">Focus: {focus}</p>
      <p className="text-yellow-500">Rating: {'★'.repeat(rating || 5)}</p>

      {/* Hidden YouTube Player */}
      <div style={{ display: 'none' }}>
        <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />
      </div>
    </div>
  );
}

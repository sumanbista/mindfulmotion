// src/pages/Meditation.jsx
import React, { useEffect, useState } from 'react';
import SessionCard from '../components/SessionCard';

export default function Meditation() {
  const [sessions, setSessions] = useState([]);
  const [videoIds, setVideoIds] = useState([]);

  // (Optional) Fetch sessions from API; fallback if none
  const fallbackSessions = [
    { title: "Relaxation Session", duration: 20, focus: "Relaxation", rating: 5 },
    { title: "Morning Calm", duration: 15, focus: "Mindfulness", rating: 4 },
    { title: "Forest Retreat", duration: 30, focus: "Reflection", rating: 5 },
  ];
  const displayedSessions = sessions.length > 0 ? sessions : fallbackSessions;

  // Fetch the hardcoded video ID list from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/embeds')
      .then((res) => res.json())
      .then((data) => setVideoIds(data))
      .catch((err) => console.error(err));
  }, []);

  return (
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Meditation Sessions
          </h2>

          {/* Grid of session cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedSessions.map((session, idx) => (
              <SessionCard
                key={idx}
                title={session.title}
                duration={session.duration}
                focus={session.focus}
                rating={session.rating}
                // Assign a videoId by cycling through videoIds array
                videoId={videoIds[idx % videoIds.length] || null}
              />
            ))}
          </div>
        </div>
  );
}

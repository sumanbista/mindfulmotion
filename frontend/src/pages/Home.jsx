import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// A simple card component for the top 4 items
function FeatureCard({ image, title, subtitle, buttonText, onButtonClick, progress }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center">
      {/* Image on top (if provided) */}
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      <h2 className="text-lg font-bold mb-1 text-center">{title}</h2>
      {subtitle && <p className="text-gray-600 text-center mb-2">{subtitle}</p>}

      {/* Progress bar (optional) */}
      {typeof progress === 'number' && (
        <div className="w-full bg-gray-200 rounded-full h-2 my-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const [events] = useState([
    { date: '2023-05-10', title: 'Meditation 101' },
    { date: '2023-05-12', title: 'Community' },
    { date: '2023-05-14', title: 'Daily' },
  ]);

  return (

        <div className="flex-1 p-4 flex gap-4">
          {/* Main Center Content */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Top 4 Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Meditation 101 */}
              <Link to="/meditation">
                <FeatureCard
                  image="https://www.oceans7ashwem.com/images/yoga.jpg"
                  title="Meditation 101"
                  subtitle="Learn the basics of meditation."
                  progress={10}
                  buttonText="Start"
                  onButtonClick={() => alert('Start Meditation 101')}
                />
              </Link>

              {/* Community */}
              <FeatureCard
                image="https://timetoplay.com/wp-content/uploads/2016/12/community.jpg"
                title="Community"
                subtitle="Join our community."
                progress={50}
                buttonText="Join"
                onButtonClick={() => alert('Join Community')}
              />

              {/* Progress Tracker */}
              <FeatureCard
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFOTlNgPzFHHlX6oKQjOXjD3RCF9sKCVQGvg&s"
                title="Progress Tracker"
                subtitle="Track your progress and growth."
                progress={33}
                buttonText="Start"
                onButtonClick={() => alert('Start Progress Tracker')}
              />

              {/* Daily */}
              <FeatureCard
                image="https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg"
                title="Daily"
                subtitle="Get inspired with our daily content."
                progress={80}
                buttonText="Signed up"
                onButtonClick={() => alert('Signed up for Daily')}
              />
            </div>

            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold mb-2">Calendar</h3>
              {events.map((ev, idx) => (
                <div key={idx} className="border-b py-2">
                  <span className="font-semibold">{ev.date}</span> - {ev.title}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Meditation Session, Inbox, etc. */}
          <div className="w-full md:w-72 flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2">Meditation Session</h3>
              <div className="bg-gray-200 h-32 mb-4 flex items-center justify-center">
                {/* Placeholder for embedded video or thumbnail */}
                <span>Embedded Video or Thumbnail</span>
              </div>
              <p>Attendance Tracker: 39</p>
              <p>Mind Games: 84</p>
              <div className="mt-4">
                <h4 className="font-semibold">Inbox</h4>
                <p>New message from MindfulMotion</p>
              </div>
            </div>

            {/* Additional sections if needed */}
            {/* e.g. Mind Games, etc. */}
          </div>
        </div>
  );
}

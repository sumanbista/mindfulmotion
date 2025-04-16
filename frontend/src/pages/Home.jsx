import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// A simple, modern Feature Card component
function FeatureCard({ image, title, subtitle, buttonText, onButtonClick, progress }) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col md:flex-row items-center">
      {/* Image */}
      {image && (
        <div className="w-full md:w-1/2 h-40">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded mb-4 md:mb-0"
          />
        </div>
      )}

      {/* Content (Title, Subtitle, Progress, Button) */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start pl-0 md:pl-6">
        <h2 className="text-xl font-bold mb-2 text-center md:text-left">{title}</h2>
        {subtitle && <p className="text-gray-600 text-center md:text-left mb-4">{subtitle}</p>}

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Button */}
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [events] = useState([
    { date: '2023-05-10', title: 'Meditation 101' },
    { date: '2023-05-12', title: 'Community' },
    { date: '2023-05-14', title: 'Daily' },
  ]);
  
  const [quote, setQuote] = useState({ q: '', a: '' });  // Store quote and author
  const navigate = useNavigate();

  // Fetching quote from the ZenQuotes API
  useEffect(() => {
    fetch('http://localhost:5000/api/quote')  // Replace [your_key] with your actual key
      .then((res) => res.json())
      .then((data) => {
        // Set quote and author (q and a)
        setQuote({ q: data[1].q, a: data[1].a }); // Extract only q (quote) and a (author)
      })
      .catch((err) => console.error('Error fetching quote:', err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="container mx-auto p-6">
        {/* Display Quote */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <p className="text-lg font-semibold text-center text-gray-700 italic">{quote.q}</p>
          <p className="text-sm text-right text-gray-500 mt-2">- {quote.a}</p>
        </div>

        {/* <h1 className="text-4xl font-bold text-center mb-8">Welcome to Mindful Motion</h1> */}

        {/* Top 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Meditation 101 */}
          <FeatureCard
            image="/images/home/meditation.jpg"  // Using image from public/images/home
            title="Meditation 101"
            subtitle="Learn the basics of meditation."
            progress={10}
            buttonText="Start"
            onButtonClick={() => navigate("/meditation")}
          />

          {/* Community */}
          <FeatureCard
            image="/images/home/community.jpg"  // Using image from public/images/home
            title="Community"
            subtitle="Join our community."
            progress={33}
            buttonText="Join"
            onButtonClick={() => navigate("/community")}
          />

          {/* Progress Tracker */}
          <FeatureCard
            image="/images/home/progress.jpg"  // Using image from public/images/home
            title="Progress Tracker"
            subtitle="Track your progress and growth."
            progress={50}
            buttonText="Start"
            onButtonClick={() => navigate("/progress")}
          />

          {/* Journal */}
          <FeatureCard
            image="/images/home/daily.jpg"  // Using image from public/images/home
            title="Journal"
            subtitle="Get inspired with our daily content."
            progress={80}
            buttonText="Explore"
            onButtonClick={() => navigate("/Journal")}
          />
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Calendar</h3>
          {events.map((ev, idx) => (
            <div key={idx} className="border-b py-2">
              <span className="font-semibold">{ev.date}</span> - {ev.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard'; 

export default function Home() {
  const [events] = useState([
    { date: 'Upcoming Event Date 1', title: 'Mindfulness Workshop' }, 
    { date: 'Upcoming Event Date 2', title: 'Stress Management Session' },
    { date: 'Upcoming Event Date 3', title: 'Group Support Meeting' },
  ]);

  const [quote, setQuote] = useState({ q: 'Loading quote...', a: '' }); // Initial loading state
  const navigate = useNavigate();

  // Fetching quote from the ZenQuotes API
  useEffect(() => {
    fetch('http://localhost:5000/api/quote') // Updated to use the backend route
      .then((res) => {
           if (!res.ok) {
               console.error(`Error fetching quote: HTTP status ${res.status}`);
               setQuote({ q: 'Failed to load quote.', a: '' });
               return null;
           }
           return res.json();
       })
      .then((data) => {
           if (data && data.length > 0 && data[0].q && data[0].a) {
             setQuote({ q: data[0].q, a: data[0].a });
           } else {
              console.error('Received invalid data format for quote:', data);
              setQuote({ q: 'Could not load quote.', a: '' });
           }
      })
      .catch((err) => {
           console.error('Network or parsing error fetching quote:', err);
           setQuote({ q: 'Error loading quote.', a: '' });
       });
  }, []); 
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8"> 
      <div className="container mx-auto px-6"> 
        

        {/* Display Quote */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-200"> 
           
          <p className="text-xl font-medium text-center text-gray-800 italic"> 
               "{quote.q}"
           </p>
          <p className="text-base text-right text-gray-600 mt-4"> 
               - {quote.a || 'Unknown Author'}
           </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12"> 
          {/* Meditation 101 */}
          <FeatureCard
            image="/images/home/meditation.jpg"
            title="Meditation Guide"
            subtitle="Find peace and calm with guided meditations."
            progress={25} 
            buttonText="Start Practicing"
            onButtonClick={() => navigate("/meditation")}
          />

          {/* Community */}
          <FeatureCard
            image="/images/home/community.jpg"
            title="Connect with Others" 
            subtitle="Share experiences and support each other."
            progress={50} 
            buttonText="Join Community"
            onButtonClick={() => navigate("/community")}
          />

          {/* Progress Tracker */}
          <FeatureCard
            
            image="/images/home/progress.jpg"
            title="Your Wellness Journey" 
            subtitle="Visualize your growth and track your habits."
            progress={75} 
            buttonText="Take Daily Assessment"
            onButtonClick={() => navigate("/assessment")} 
          />

        

            
             <FeatureCard
                title="AI Wellness Chat"
                subtitle="Talk to our AI counselor for support."
                buttonText="Start Chat"
                onButtonClick={() => navigate("/chat")} 
                progress={60} 
             />

        </div>

        {/* Calendar/Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8"> 
          <h3 className="text-2xl font-bold mb-4 text-teal-700">Upcoming Events</h3> 
          {events.length === 0 ? (
               <p className="text-gray-600 italic">No upcoming events scheduled.</p>
           ) : (
              <div className="space-y-3"> 
                {events.map((ev, idx) => (
                  <div key={idx} className="border-b border-gray-200 last:border-b-0 pb-3"> 
                      <p>
                         <span className="font-semibold text-gray-800 mr-2">{ev.date}</span>
                         <span className="text-gray-700">{ev.title}</span>
                      </p>
                  </div>
                ))}
              </div>
           )}
</div>
</div>
</div>
);
}

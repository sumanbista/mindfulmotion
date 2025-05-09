import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard'; // Correct import

export default function Home() {
  const [events] = useState([
    { date: 'Upcoming Event Date 1', title: 'Mindfulness Workshop' }, // Example updated data
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
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8"> {/* Themed gradient background */}
      <div className="container mx-auto px-6"> {/* Centered container with horizontal padding */}
        {/* Main Title (Optional - you had it commented out) */}
        {/* <h1 className="text-4xl font-bold text-center mb-8 text-teal-800">Welcome to Your Wellness Hub</h1> */}

        {/* Display Quote */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-200"> {/* Themed container, increased padding/margin */}
           {/* Optional: Add a subtle icon */}
           {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2zM5 3h14a2 2 0 012 2H3a2 2 0 012-2z" /></svg> */}
          <p className="text-xl font-medium text-center text-gray-800 italic"> {/* Themed quote text */}
               "{quote.q}"
           </p>
          <p className="text-base text-right text-gray-600 mt-4"> {/* Themed author text */}
               - {quote.a || 'Unknown Author'}
           </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12"> {/* Adjusted grid columns slightly, increased gap */}
          {/* Meditation 101 */}
          <FeatureCard
            image="/images/home/meditation.jpg"
            title="Meditation Guide"
            subtitle="Find peace and calm with guided meditations."
            progress={25} // Example progress
            buttonText="Start Practicing"
            onButtonClick={() => navigate("/meditation")}
          />

          {/* Community */}
          <FeatureCard
            image="/images/home/community.jpg"
            title="Connect with Others" 
            subtitle="Share experiences and support each other."
            progress={50} // Example progress
            buttonText="Join Community"
            onButtonClick={() => navigate("/community")}
          />

          {/* Progress Tracker */}
          <FeatureCard
             // Consider a more relevant image for progress tracking
            image="/images/home/progress.jpg"
            title="Your Wellness Journey" 
            subtitle="Visualize your growth and track your habits."
            progress={75} // Example progress
            buttonText="Take Daily Assessment"
            onButtonClick={() => navigate("/assessment")} 
          />

          {/* Journal / Daily Content */}
          {/* <FeatureCard
            image="/images/home/daily.jpg"
            title="Daily Reflection" 
            subtitle="Journal your thoughts and explore helpful content."
            progress={90} // Example progress
            buttonText="Start Journaling"
            onButtonClick={() => navigate("/journal")} 
          /> */}

            {/* Example of a card without an image */}
             <FeatureCard
                title="AI Wellness Chat"
                subtitle="Talk to our AI counselor for support."
                buttonText="Start Chat"
                onButtonClick={() => navigate("/chat")} // Assuming AI chat page route
                progress={60} // Example progress
             />

        </div>

        {/* Calendar/Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8"> {/* Themed container */}
          <h3 className="text-2xl font-bold mb-4 text-teal-700">Upcoming Events</h3> {/* Themed title */}
          {events.length === 0 ? (
               <p className="text-gray-600 italic">No upcoming events scheduled.</p>
           ) : (
              <div className="space-y-3"> {/* Added space between items */}
                {events.map((ev, idx) => (
                  <div key={idx} className="border-b border-gray-200 last:border-b-0 pb-3"> {/* Themed border, remove last */}
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

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// // A simple, modern Feature Card component
// function FeatureCard({ image, title, subtitle, buttonText, onButtonClick, progress }) {
//   return (
//     <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col md:flex-row items-center">
//       {/* Image */}
//       {image && (
//         <div className="w-full md:w-1/2 h-40">
//           <img
//             src={image}
//             alt={title}
//             className="w-full h-full object-cover rounded mb-4 md:mb-0"
//           />
//         </div>
//       )}

//       {/* Content (Title, Subtitle, Progress, Button) */}
//       <div className="w-full md:w-1/2 flex flex-col items-center md:items-start pl-0 md:pl-6">
//         <h2 className="text-xl font-bold mb-2 text-center md:text-left">{title}</h2>
//         {subtitle && <p className="text-gray-600 text-center md:text-left mb-4">{subtitle}</p>}

//         {/* Progress Bar */}
//         {typeof progress === 'number' && (
//           <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
//             <div
//               className="bg-blue-500 h-3 rounded-full"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         )}

//         {/* Button */}
//         {buttonText && (
//           <button
//             onClick={onButtonClick}
//             className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
//           >
//             {buttonText}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   const [events] = useState([
//     { date: '2023-05-10', title: 'Meditation 101' },
//     { date: '2023-05-12', title: 'Community' },
//     { date: '2023-05-14', title: 'Daily' },
//   ]);
  
//   const [quote, setQuote] = useState({ q: '', a: '' });  // Store quote and author
//   const navigate = useNavigate();

//   // Fetching quote from the ZenQuotes API
//   useEffect(() => {
//     fetch('http://localhost:5000/api/quote')  // Replace [your_key] with your actual key
//       .then((res) => res.json())
//       .then((data) => {
//         // Set quote and author (q and a)
//         setQuote({ q: data[1].q, a: data[1].a }); // Extract only q (quote) and a (author)
//       })
//       .catch((err) => console.error('Error fetching quote:', err));
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
//       <div className="container mx-auto p-6">
//         {/* Display Quote */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-8">
//           <p className="text-lg font-semibold text-center text-gray-700 italic">{quote.q}</p>
//           <p className="text-sm text-right text-gray-500 mt-2">- {quote.a}</p>
//         </div>

//         {/* <h1 className="text-4xl font-bold text-center mb-8">Welcome to Mindful Motion</h1> */}

//         {/* Top 4 Feature Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//           {/* Meditation 101 */}
//           <FeatureCard
//             image="/images/home/meditation.jpg"  // Using image from public/images/home
//             title="Meditation 101"
//             subtitle="Learn the basics of meditation."
//             progress={10}
//             buttonText="Start"
//             onButtonClick={() => navigate("/meditation")}
//           />

//           {/* Community */}
//           <FeatureCard
//             image="/images/home/community.jpg"  // Using image from public/images/home
//             title="Community"
//             subtitle="Join our community."
//             progress={33}
//             buttonText="Join"
//             onButtonClick={() => navigate("/community")}
//           />

//           {/* Progress Tracker */}
//           <FeatureCard
//             image="/images/home/progress.jpg"  // Using image from public/images/home
//             title="Progress Tracker"
//             subtitle="Track your progress and growth."
//             progress={50}
//             buttonText="Start"
//             onButtonClick={() => navigate("/progress")}
//           />

//           {/* Journal */}
//           <FeatureCard
//             image="/images/home/daily.jpg"  // Using image from public/images/home
//             title="Journal"
//             subtitle="Get inspired with our daily content."
//             progress={80}
//             buttonText="Explore"
//             onButtonClick={() => navigate("/Journal")}
//           />
//         </div>

//         {/* Calendar Section */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h3 className="text-2xl font-bold mb-4">Calendar</h3>
//           {events.map((ev, idx) => (
//             <div key={idx} className="border-b py-2">
//               <span className="font-semibold">{ev.date}</span> - {ev.title}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

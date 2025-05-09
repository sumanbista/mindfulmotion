// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

// Example icons from react-icons
import {
  AiOutlineHome,
  AiOutlineBarChart, // Assuming this might be used for Progress/Dashboard
  AiOutlineLogout,
  AiOutlineSetting,
  AiOutlineFileText, // Used for Assessment
} from 'react-icons/ai';
import { GiMeditation } from 'react-icons/gi'; // Used for Meditation
import { FaUsers } from 'react-icons/fa'; // Used for Community
import { RiRobotLine } from 'react-icons/ri'; // Used for AI Chat
// import { FaRegStar } from 'react-icons/fa'; // Potential icon for Journal/Daily

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // On logout, remove user data from localStorage and navigate to /login
  const handleLogout = () => {
    // TODO: Also sign out using Firebase Auth if applicable
    // auth.signOut();
    localStorage.removeItem('loggedInUser'); // Consider removing or updating this if using Firebase Auth state globally
    localStorage.removeItem('token'); // Remove token if stored
    localStorage.removeItem('userInfo'); // Remove userInfo if stored
    navigate('/login');
  };

  // Retrieve user info from localStorage (or better, use Firebase Auth state from a context)
  // const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  // const userName = loggedInUser.firstName
  //   ? `${loggedInUser.firstName} ${loggedInUser.lastName || ''}`.trim()
  //   : 'Guest';

  // Determine if a link is active
  const isActive = (pathname) => {
    return location.pathname === pathname;
  };


  return (
    // Themed background, text, shadow, width, and fixed positioning
    <div className="bg-teal-800 text-white w-64 h-screen flex flex-col p-6 shadow-xl fixed top-0 left-0">
      {/* Profile Section (Commented out in original code) */}
      {/* If you add this later, style it here */}
      {/* Example:
      <div className="flex items-center mb-6">
         <img src="..." alt="Profile Avatar" className="w-10 h-10 rounded-full mr-3" />
         <div>
            <h3 className="text-lg font-semibold">{userName}</h3>
            <p className="text-sm text-teal-200">View Profile</p>
         </div>
      </div>
      */}

      {/* App/Logo Title */}
      <div className="mb-8"> {/* Increased bottom margin */}
        <h2 className="text-2xl font-bold text-teal-200">Mindful Motion</h2> {/* Themed title */}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 flex-1"> {/* Themed gap, flex-1 to push bottom section down */}
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/') ? 'bg-teal-700 font-semibold' : 'hover:bg-teal-700'}`} // Themed link styles with active state
          aria-label="Go to Home"
        >
          <AiOutlineHome size={20} />
          <span>Home</span>
        </Link>

        <Link
          to="/meditation"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/meditation') ? 'bg-teal-700 font-semibold' : 'hover:bg-teal-700'}`} // Themed link styles with active state
          aria-label="Go to Meditation"
        >
          <GiMeditation size={20} />
          <span>Meditation</span>
        </Link>

        {/* ✅ New Assessment Link */}
        <Link
          to="/assessment"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/assessment') ? 'bg-teal-700 font-semibold' : 'hover:bg-teal-700'}`} // Themed link styles with active state
          aria-label="Go to Assessment"
        >
          <AiOutlineFileText size={20} />
          <span>Assessment</span>
        </Link>


        <Link
          to="/community"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/community') ? 'bg-teal-700 font-semibold' : 'hover:bg-teal-700'}`} // Themed link styles with active state
          aria-label="Go to Community"
        >
          <FaUsers size={20} />
          <span>Community</span>
        </Link>

        <Link
          to="/chat" // Assuming this is the AI Chat route
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/ai-chat') ? 'bg-teal-700 font-semibold' : 'hover:bg-teal-700'}`} // Themed link styles with active state
          aria-label="Go to AI Chat"
        >
          <RiRobotLine size={20} />
          <span>AI Chat</span>
        </Link>

        {/* Example Link for Journal/Daily if you add it */}
        {/* <Link
          to="/journal"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/journal') ? 'bg-teal-700 font-semibold' : 'hover:bg-teal-700'}`}
          aria-label="Go to Journal"
        >
          <FaRegStar size={20} />
          <span>Journal</span>
        </Link> */}


      </nav>

      {/* Settings + Logout at the Bottom */}
      <div className="flex flex-col gap-3 mt-auto"> {/* Themed gap, mt-auto pushes this section to the bottom */}
        {/* Settings Link */}
        <Link
          to="/setting" // Assuming this is the Settings route
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/setting') ? 'bg-teal-700 font-semibold' : 'hover:bg-teal-700'}`} // Themed link styles with active state
          aria-label="Go to Settings"
        >
          <AiOutlineSetting size={20} />
          <span>Settings</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-700 text-red-100 transition-colors" // Themed logout button (slightly different hover for emphasis)
          aria-label="Logout"
        >
          <AiOutlineLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// // src/components/Sidebar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// // Example icons from react-icons
// import {
//   AiOutlineHome,
//   AiOutlineBarChart,
//   AiOutlineLogout,
//   AiOutlineSetting,
//   AiOutlineFileText,
// } from 'react-icons/ai';
// import { GiMeditation } from 'react-icons/gi';
// import { FaUsers } from 'react-icons/fa';
// import { RiRobotLine } from 'react-icons/ri';

// export default function Sidebar() {
//   const navigate = useNavigate();

//   // On logout, remove user data from localStorage and navigate to /login
//   const handleLogout = () => {
//     localStorage.removeItem('loggedInUser');
//     navigate('/login');
//   };

//   // Retrieve user info from localStorage (if any)
//   const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
//   const userName = loggedInUser.firstName
//     ? `${loggedInUser.firstName} ${loggedInUser.lastName || ''}`.trim()
//     : 'Guest';

//   return (
//     <div className="bg-gray-500 w-64 h-screen flex flex-col p-6 shadow-xl text-white">
//       {/* Profile Section */}
    

//       {/* App/Logo Title */}
//       <div>
//         <h2 className="text-2xl font-extrabold mb-8">Mindful Motion</h2>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex flex-col gap-4 flex-1">
//         <Link
//           to="/"
//           className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
//         >
//           <AiOutlineHome size={20} />
//           <span>Home</span>
//         </Link>

//         <Link
//           to="/meditation"
//           className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
//         >
//           <GiMeditation size={20} />
//           <span>Meditation</span>
//         </Link>

//         {/* ✅ New Assessment Link */}
//         <Link to="/assessment" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors">
//           <AiOutlineFileText size={20} />
//           <span>Assessment</span>
//         </Link>
        

//         <Link
//           to="/community"
//           className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
//         >
//           <FaUsers size={20} />
//           <span>Community</span>
//         </Link>

//         <Link
//           to="/chat"
//           className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
//         >
//           <RiRobotLine size={20} />
//           <span>AI Chat</span>
//         </Link>

//       </nav>

//       {/* Settings + Logout at the Bottom */}
//       <div className="flex flex-col gap-4">
//         {/* Settings Link */}
//         <Link
//           to="/setting"
//           className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
//         >
//           <AiOutlineSetting size={20} />
//           <span>Settings</span>
//         </Link>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
//         >
//           <AiOutlineLogout size={20} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// }

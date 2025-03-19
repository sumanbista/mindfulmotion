// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Example icons from react-icons
import {
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineLogout,
  AiOutlineSetting
} from 'react-icons/ai';
import { GiMeditation } from 'react-icons/gi';
import { FaUsers } from 'react-icons/fa';

export default function Sidebar() {
  const navigate = useNavigate();

  // On logout, remove user data from localStorage and navigate to /login
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  // Retrieve user info from localStorage (if any)
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const userName = loggedInUser.firstName
    ? `${loggedInUser.firstName} ${loggedInUser.lastName || ''}`.trim()
    : 'Guest';

  return (
    <div className="bg-gray-500 w-64 h-screen flex flex-col p-6 shadow-xl text-white">
      {/* Profile Section */}
    

      {/* App/Logo Title */}
      <div>
        <h2 className="text-2xl font-extrabold mb-8">Mindful Motion</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 flex-1">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
        >
          <AiOutlineHome size={20} />
          <span>Home</span>
        </Link>

        <Link
          to="/meditation"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
        >
          <GiMeditation size={20} />
          <span>Meditation</span>
        </Link>

        <Link
          to="/progress"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
        >
          <AiOutlineBarChart size={20} />
          <span>Progress</span>
        </Link>

        <Link
          to="/community"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
        >
          <FaUsers size={20} />
          <span>Community</span>
        </Link>
      </nav>

      {/* Settings + Logout at the Bottom */}
      <div className="flex flex-col gap-4">
        {/* Settings Link */}
        <Link
          to="/setting"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
        >
          <AiOutlineSetting size={20} />
          <span>Settings</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-purple-500 transition-colors"
        >
          <AiOutlineLogout size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

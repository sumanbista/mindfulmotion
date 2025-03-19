import React from 'react';

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <div className="text-xl font-bold text-gray-700">Welcome to Mindful Motion</div>
      <div>
        <input 
          type="text" 
          placeholder="Search" 
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
        />
      </div>
    </div>
  );
}

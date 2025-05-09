import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen"> {/* Changed h-screen to min-h-screen */}
      {/* Sidebar with fixed width */}
      <Sidebar />

      {/* Main content area with overflow-y-auto for scrolling */}
      <div className="flex-1 ml-64 overflow-y-auto">
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

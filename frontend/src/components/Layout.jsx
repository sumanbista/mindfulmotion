import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with fixed height */}
      <div className="h-full">
        <Sidebar />
      </div>
      
      {/* Main content area with independent scrolling */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* <Navbar /> */}
        {/* Content area with scrolling */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

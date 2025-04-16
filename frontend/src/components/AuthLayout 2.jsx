import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-100 to-pink-200">
            <main>
                <Outlet />
            </main>
        </div>
    );
}

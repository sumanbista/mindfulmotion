// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import fakeDB from '../data/fakeDB';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Simple check to see if email already exists in fakeDB
    const existingUser = fakeDB.users.find((user) => user.email === email);
    if (existingUser) {
      alert('User with this email already exists!');
      return;
    }

    // "Add" user to our fake database
    const newUser = { firstName, lastName, email, password };
    fakeDB.users.push(newUser);

    // Simulate logging in the new user
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));

    alert('Signup successful! You are now logged in.');
    
    // Redirect to Home
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200"
    >
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-pink-600">MindfulMotion</h1>
          <p className="text-gray-500 mt-1">Create Your Account</p>
        </div>

        <form onSubmit={handleSignup}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 hover:text-pink-600">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

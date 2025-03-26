// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        showSuccess(`Welcome back, ${email}!`);
        navigate('/');
      } else {
        showError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      showError('An error occurred during login.');
    }

  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200"
    >
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-pink-600">MindfulMotion</h1>
          <p className="text-gray-500 mt-1 font-bold">Welcome Back</p>
        </div>

        <form onSubmit={handleLogin}>
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
          <div className="mb-4">
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

          {/* Remember Me + Submit */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-gray-600">
              <input 
                type="checkbox" 
                className="mr-2" 
              />
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition-colors"
          >
            Log In
          </button>
        </form>

        {/* Link to Signup */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-pink-500 hover:text-pink-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

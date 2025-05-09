// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/config'; 
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast(); // Use toast context

  // Email validation function 
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowVerificationMessage(false);

    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.'); 
      showError('Please enter a valid email address.'); 
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        // Send verification email again
      
        try {
             await sendEmailVerification(user);
             setShowVerificationMessage(true);
             // Clear form or show specific instruction
             setEmail('');
             setPassword('');
             // Sign out the user immediately after sending verification email
            await auth.signOut();
            showError('Please verify your email before logging in. Verification email sent.'); 
        } catch (sendError) {
            console.error("Error sending verification email:", sendError);
             setError('Please verify your email before logging in. Failed to send verification email.');
             showError('Failed to send verification email.'); 
        }
        setLoading(false);
        return;
      }

      
      localStorage.setItem('userInfo', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: true
      }));
    

      // Navigate to the home page or dashboard
      showSuccess(`Welcome back, ${user.displayName || user.email}!`); 
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      let customErrorMessage = 'An unexpected error occurred. Please try again later.'; // Default error

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-credential': 
          customErrorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        case 'auth/wrong-password':
          customErrorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          customErrorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
          break;
        case 'auth/user-disabled':
          customErrorMessage = 'This account has been disabled. Please contact support.';
        
        default:
           customErrorMessage = `Login failed: ${error.message || 'Unknown error'}`; 
      }
      setError(customErrorMessage); 
      showError(customErrorMessage); 
    } finally {
      setLoading(false);
    }
  };

  // --- Verification Message View ---
  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12"> {/* Themed background */}
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md text-center border border-gray-200"> {/* Themed container */}
          <h2 className="text-2xl font-bold text-teal-700 mb-4">Verify Your Email</h2> {/* Themed title */}
          <p className="text-gray-700 mb-4"> {/* Themed text */}
            We've sent a new verification email to <span className="font-semibold">{email}</span>. Please check your inbox and click the verification link to activate your account.
          </p>
          <p className="text-sm text-gray-600 mb-6"> {/* Themed helper text */}
            If you don't see the email within a few minutes, please check your spam folder.
          </p>
          <button
            onClick={() => setShowVerificationMessage(false)}
            className="text-teal-600 hover:text-teal-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded" // Themed link button
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // --- Main Login Form View ---
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4" 
    >
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200"> {/* Themed container */}
        
        <div className="text-center mb-8"> 
          <h1 className="text-3xl font-bold text-teal-800 mb-2">MindfulMotion</h1> 
          <p className="text-gray-600 text-lg">Welcome Back</p> 
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-300 shadow-sm"> 
            <p className="font-medium">{error}</p>
            
            {error.includes('No account found') || error.includes('Invalid email or password') && (
              <p className="mt-2 text-sm text-red-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-red-700 hover:underline font-semibold"> 
                  Sign up here
                </Link>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6"> 
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm"> 
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500" // Themed input
              required
              autoComplete="email" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm"> 
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500" // Themed input
              required
              autoComplete="current-password" 
            />
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-600 text-sm"> 
              <input
                type="checkbox"
                className="mr-2 form-checkbox text-teal-600 focus:ring-teal-500 rounded" 
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors"> 
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-teal-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg`} // Themed button, larger size
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>

        {/* Link to Signup */}
        <div className="text-center mt-8"> 
          <p className="text-sm text-gray-600"> 
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors"> 
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

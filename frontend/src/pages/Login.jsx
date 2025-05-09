// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/config'; // Assuming firebase auth is correctly imported

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const navigate = useNavigate();

  // Email validation function (kept as is)
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
      setError('Please enter a valid email address.'); // Improved error message
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        // Send verification email again
        // Consider adding a check here to avoid sending too many emails rapidly
        try {
             await sendEmailVerification(user);
             setShowVerificationMessage(true);
             // Clear form or show specific instruction
             setEmail('');
             setPassword('');
             // Sign out the user immediately after sending verification email
            await auth.signOut();
        } catch (sendError) {
            console.error("Error sending verification email:", sendError);
             setError('Please verify your email before logging in. Failed to send verification email.');
        }
        setLoading(false);
        return;
      }

      // --- Successful Login ---
      // Backend API call to get/store user info or token if needed
      // Example: await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ uid: user.uid, email: user.email }) });

      // Store user info in localStorage (consider using session storage or context for more secure/temporary storage)
       // Note: displayName might be null if not set during signup
      localStorage.setItem('userInfo', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: true
      }));
      // Store JWT token if your backend provides one
      // localStorage.setItem('token', tokenFromServer);


      // Navigate to the home page or dashboard
      // alert(`Welcome back, ${user.displayName || user.email}!`); // Themed alert? Native alert is okay for now.
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      let customErrorMessage = 'An unexpected error occurred. Please try again later.'; // Default error

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-credential': // Firebase often uses this for both email/password issues
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
          break;
        // Add more specific cases if needed
        default:
           customErrorMessage = `Login failed: ${error.message || 'Unknown error'}`; // Provide Firebase message if general
      }
      setError(customErrorMessage); // Set the user-friendly error message

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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4" // Themed background, added padding
    >
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200"> {/* Themed container */}
        {/* Logo / Title */}
        <div className="text-center mb-8"> {/* Increased bottom margin */}
          <h1 className="text-3xl font-bold text-teal-800 mb-2">MindfulMotion</h1> {/* Themed main title */}
          <p className="text-gray-600 text-lg">Welcome Back</p> {/* Themed subtitle */}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-300 shadow-sm"> {/* Themed error banner */}
            <p className="font-medium">{error}</p>
            {/* Conditional link for signup if needed */}
            {error.includes('No account found') || error.includes('Invalid email or password') && (
              <p className="mt-2 text-sm text-red-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-red-700 hover:underline font-semibold"> {/* Themed link within error */}
                  Sign up here
                </Link>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6"> {/* Added space between form groups */}
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm"> {/* Themed label */}
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500" // Themed input
              required
              autoComplete="email" // Add autocomplete
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm"> {/* Themed label */}
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500" // Themed input
              required
              autoComplete="current-password" // Add autocomplete
            />
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-600 text-sm"> {/* Themed text */}
              <input
                type="checkbox"
                className="mr-2 form-checkbox text-teal-600 focus:ring-teal-500 rounded" // Themed checkbox
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors"> {/* Themed link */}
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
        <div className="text-center mt-8"> {/* Increased top margin */}
          <p className="text-sm text-gray-600"> {/* Themed text */}
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors"> {/* Themed link */}
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

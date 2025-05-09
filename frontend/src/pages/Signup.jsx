// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/config'; 

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    const disposableDomains = [
      'tempmail.com', 'throwawaymail.com', 'mailinator.com', 'guerrillamail.com',
      '10minutemail.com', 'yopmail.com', 'temp-mail.org', 'fakeinbox.com', 'sharklasers.com',
      'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.com', 'guerrillamail.de',
      'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com', 'spam4.me',
      'trashmail.com', 'trashmail.me', 'trashmail.net', 'trashmail.org', 'trashmail.ws',
      'trashmailer.com', 'tempmail.net', 'tempmail.org', 'tempmail.com', 'tempmail.de',
      'tempmail.fr', 'tempmail.it', 'tempmail.ru', 'tempmail.co.uk', 'tempmail.co.za',
      'tempmail.com.au', 'tempmail.com.br', 'tempmail.com.cn', 'tempmail.com.hk',
      'tempmail.com.my', 'tempmail.com.sg', 'tempmail.com.tw', 'tempmail.com.vn',
      'tempmail.jp', 'tempmail.kr', 'tempmail.nl', 'tempmail.pl', 'tempmail.se',
      'tempmail.sk', 'tempmail.cz', 'tempmail.hu', 'tempmail.ro', 'tempmail.bg',
      'tempmail.gr', 'tempmail.tr', 'tempmail.ae', 'tempmail.sa', 'tempmail.qa',
      'tempmail.om', 'tempmail.bh', 'tempmail.kw', 'tempmail.eg', 'tempmail.ma',
      'tempmail.dz', 'tempmail.tn', 'tempmail.ly', 'tempmail.sd', 'tempmail.so',
      'tempmail.dj', 'tempmail.km', 'tempmail.sc', 'tempmail.mu', 'tempmail.re',
      'tempmail.yt', 'tempmail.nc', 'tempmail.pf', 'tempmail.wf', 'tempmail.tf',
      'tempmail.pm', 'tempmail.gf', 'tempmail.gp', 'tempmail.mq', 'tempmail.gd',
      'tempmail.lc', 'tempmail.vc', 'tempmail.ag', 'tempmail.dm', 'tempmail.kn',
      'tempmail.ai', 'tempmail.ms', 'tempmail.tc', 'tempmail.vg', 'tempmail.vi',
      'tempmail.pr', 'tempmail.do', 'tempmail.ht', 'tempmail.jm', 'tempmail.bb',
      'tempmail.tt'
    ];

    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setVerificationSent(false);

    if (!firstName.trim() || !lastName.trim()) {
        setError('Please enter your first and last name.');
        setLoading(false);
        return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address. Disposable email addresses are not allowed.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await updateProfile(user, {
        displayName: fullName
      });

      try {
           await sendEmailVerification(user);
           setVerificationSent(true);
           await auth.signOut();
       } catch (sendError) {
           console.error("Error sending verification email:", sendError);
           setError("Account created, but failed to send verification email. Please try logging in later or contact support.");
           await auth.signOut();
       }

      localStorage.setItem('userInfo', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        emailVerified: false
      }));

       if (verificationSent) {
           setFirstName('');
           setLastName('');
           setEmail('');
           setPassword('');
       } else {
             navigate('/login', { state: { signupError: error || 'Account created, but verification email failed.' } });
       }

      console.log('User signed up and profile updated:', user);

    } catch (error) {
      console.error('Signup error:', error);
      let customErrorMessage = 'An unexpected error occurred. Please try again later.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          customErrorMessage = 'An account with this email already exists. Please log in instead.';
          break;
        case 'auth/invalid-email':
          customErrorMessage = 'The email address is not valid.';
          break;
        case 'auth/operation-not-allowed':
           customErrorMessage = 'Email/password sign up is not enabled. Contact support.';
           break;
        case 'auth/weak-password':
           customErrorMessage = 'The password is too weak.';
           break;
        default:
          customErrorMessage = `Sign up failed: ${error.message || 'Unknown error'}`;
      }
       setError(customErrorMessage);

    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md text-center border border-gray-200">
          <h2 className="text-2xl font-bold text-teal-700 mb-4">Verification Sent</h2>
          <p className="text-gray-700 mb-4">
            A verification email has been sent to <span className="font-semibold">{email}</span>. Please check your inbox and click the link to activate your account.
          </p>
           <p className="text-sm text-gray-600 mb-6">
            You may now proceed to the login page. If you don't receive the email within a few minutes, please check your spam folder.
          </p>
          <Link to="/login" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4"
    >
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">MindfulMotion</h1>
          <p className="text-gray-600 text-lg">Create Your Account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-300 shadow-sm">
            <p className="font-medium">{error}</p>
            {error.includes('already exists') && (
              <p className="mt-2 text-sm text-red-600">
                Already have an account?{' '}
                <Link to="/login" className="text-red-700 hover:underline font-semibold">
                  Log in here
                </Link>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500"
              required
              autoComplete="given-name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500"
              required
              autoComplete="family-name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500"
              required
              autoComplete="email"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please use a valid email address. You will need to verify it.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500"
              required
              minLength="6"
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long.</p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-teal-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



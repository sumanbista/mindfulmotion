import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user information');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    // Validate password if user is trying to change it
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to update your profile');
        return;
      }

      // Prepare data for update
      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName
      };

      // Only include password if user is changing it
      if (newPassword) {
        updateData.password = newPassword;
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Clear password fields after successful update
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred while updating your profile');
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading user information...</div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      {/* Profile Section */}
      <div className="w-full flex flex-col items-center justify-center p-6">
        <img
          src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff&size=128`}
          alt="profile"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <h3 className="text-xl font-semibold mt-4">{`${user.firstName} ${user.lastName}`}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="w-1/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="w-1/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {successMessage}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="w-1/3 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">User Information</h2>
        
        <div className="mb-4">
          <label className="block mb-2">First Name</label>
          <input 
            type="text" 
            name="firstName"
            className="w-full p-2 border rounded-lg" 
            value={user.firstName} 
            onChange={handleInputChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            className="w-full p-2 border rounded-lg" 
            value={user.lastName} 
            onChange={handleInputChange}
          />
        </div>

        <label className="block mt-4 mb-2">Email</label>
        <input 
          type="email" 
          className="w-full p-2 border rounded-lg bg-gray-200" 
          value={user.email} 
          disabled 
        />

        <div className="mt-6 mb-4">
          <label className="block mb-2">New Password</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded-lg" 
            placeholder="Leave blank to keep current password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} 
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2">Confirm New Password</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded-lg" 
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        </div>

        <button 
          type="submit" 
          className="w-full mt-6 bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;

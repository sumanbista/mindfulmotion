import React, { useState, useEffect, useRef } from 'react';
import { auth, storage } from '../../firebase/config'; // Assuming firebase auth and storage are correctly imported
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

// --- Password Reset Modal Component ---
function PasswordResetModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  currentPassword,
  setCurrentPassword,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50" // Themed overlay
      onClick={onClose} // Close on outside click
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-gray-200" // Themed modal container
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-teal-700">Reset Password</h3> {/* Themed title */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded" // Themed close button
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-300 shadow-sm text-sm"> {/* Themed error banner */}
            {error}
          </div>
        )}

        <div className="space-y-4"> {/* Spacing between inputs */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Current Password</label> {/* Themed label */}
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500" // Themed input
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">New Password</label> {/* Themed label */}
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus리는 tealing-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500" // Themed input
              placeholder="Enter new password (min 6 characters)"
              required
              minLength="6"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Confirm New Password</label> {/* Themed label */}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500" // Themed input
              placeholder="Confirm new password"
              required
              minLength="6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6"> {/* Themed button layout */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400" // Themed cancel button
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed`} // Themed primary button
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Settings Page Component ---
const Settings = () => {
  // Removed darkMode state and toggle - focusing on light theme consistency
  // const [darkMode, setDarkMode] = useState(false);

  const [passwordResetModal, setPasswordResetModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // General loading state for form submissions
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // For reauthentication

  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Example states - integrate with backend if these are user preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
    updates: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const navigate = useNavigate();

  // Check Firebase Auth state on mount
  useEffect(() => {
    // Get current user from Firebase
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // Initialize form states with current user data
        setNewDisplayName(user.displayName || '');
        setNewEmail(user.email || '');
        // Fetch user-specific settings like notifications/privacy from backend here if they exist
        // Example: fetch('/api/users/settings').then(res => res.json()).then(data => { setNotifications(data.notifications); setPrivacy(data.privacy); });

      } else {
        // If user is not logged in, redirect to login
        navigate('/login');
      }
    });

    // Cleanup observer on component unmount
    return () => unsubscribe();
  }, [navigate]); // navigate is a dependency

   // Effect to clear success message after a delay
  useEffect(() => {
      if (success) {
          const timer = setTimeout(() => {
              setSuccess('');
          }, 3000); // Clear after 3 seconds
          return () => clearTimeout(timer);
      }
  }, [success]);


  const handlePasswordReset = async () => {
    // Input validation (basic validation also in modal component)
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.'); // Use main page error state
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.'); // Use main page error state
      return;
    }
     if (!currentPassword) {
         setError('Please enter your current password to reset.');
         return;
     }

    setLoading(true); // Use main page loading state
    setError(''); // Clear main page error state
    // No success state needed here, modal closes on success

    try {
        // Use auth.currentUser for the most up-to-date user object
        const currentUser = auth.currentUser;
         if (!currentUser || !currentUser.email) { // Ensure user and email exist
              throw new Error('User not found or email is missing.');
         }

      // Reauthenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email, // Use email from the current user object
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      // Close modal and show success message on main page
      setPasswordResetModal(false);
      setSuccess('Password updated successfully!');
      // Clear modal form fields
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');

    } catch (error) {
      console.error('Password reset error:', error);
       let customErrorMessage = 'Failed to reset password. Please try again.'; // Default

       switch (error.code) {
            case 'auth/wrong-password':
                customErrorMessage = 'Current password is incorrect.';
                break;
            case 'auth/too-many-requests':
                 customErrorMessage = 'Too many attempts. Try again later.';
                 break;
            case 'auth/requires-recent-login':
                 customErrorMessage = 'Please log out and log in again to reset your password.';
                 break;
            default:
                 customErrorMessage = `Reset failed: ${error.message || 'Unknown error'}`;
       }
      setError(customErrorMessage); // Set error message on main page

    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
     if (!newDisplayName.trim()) {
         setError('Display name cannot be empty.');
         setLoading(false);
         return;
     }
    if (newDisplayName.trim().length < 2) {
      setError('Display name must be at least 2 characters long.');
      setLoading(false);
      return;
    }
     if (!currentPassword && (newDisplayName !== user.displayName || newEmail !== user.email)) {
          setError('Please enter your current password to confirm changes.');
          setLoading(false);
          return;
     }


    // Email validation if email is being changed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail && newEmail !== user.email && !emailRegex.test(newEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Check if anything actually changed
    const nameChanged = newDisplayName.trim() !== user.displayName;
    const emailChanged = newEmail !== user.email;

    if (!nameChanged && !emailChanged) {
        setSuccess('No changes to save.');
        setIsEditing(false);
        setCurrentPassword('');
        setLoading(false);
        return;
    }


    try {
        // Use auth.currentUser for the most up-to-date user object
        const currentUser = auth.currentUser;
         if (!currentUser || !currentUser.email) {
             throw new Error('User not found or email is missing for reauthentication.');
         }

      // Reauthenticate user before making changes
      const credential = EmailAuthProvider.credential(
        currentUser.email, // Use email from the current user object
        currentPassword // Use current password input
      );
      await reauthenticateWithCredential(currentUser, credential);


      // Update display name if changed
      if (nameChanged) {
        await updateProfile(currentUser, {
          displayName: newDisplayName.trim()
        });
      }

      // Update email if changed
      if (emailChanged) {
        await updateEmail(currentUser, newEmail);
        // Send verification email for the new email
        await sendEmailVerification(currentUser); // This uses the *updated* user object after email change
        setSuccess('Profile updated successfully! Please verify your new email address.');
      } else {
        setSuccess('Profile updated successfully!');
      }

      // Manually update local user state to reflect changes immediately
      // The onAuthStateChanged listener might take a moment to pick up changes
      setUser(prevUser => ({
         ...prevUser,
         displayName: nameChanged ? newDisplayName.trim() : prevUser.displayName,
         email: emailChanged ? newEmail : prevUser.email,
         emailVerified: emailChanged ? false : prevUser.emailVerified // Email is unverified if changed
      }));

      setIsEditing(false); // Exit editing mode
      setCurrentPassword(''); // Clear password input

    } catch (error) {
      console.error('Profile update error:', error);
      let customErrorMessage = 'Failed to update profile. Please try again.'; // Default

       switch (error.code) {
            case 'auth/email-already-in-use':
                customErrorMessage = 'This email is already in use by another account.';
                break;
            case 'auth/invalid-email':
                customErrorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/requires-recent-login':
                customErrorMessage = 'Please enter your current password to make changes.';
                break;
            case 'auth/wrong-password':
                customErrorMessage = 'Current password is incorrect.';
                break;
            case 'auth/credential-already-in-use':
                 customErrorMessage = 'This credential (email/password) is already linked to another account.';
                 break;
            default:
                 customErrorMessage = `Update failed: ${error.message || 'Unknown error'}`;
       }
      setError(customErrorMessage); // Set error message

    } finally {
      setLoading(false); // End loading state
    }
  };


  const handleNotificationChange = (type) => {
     // TODO: Integrate with backend API to save preference
     console.log(`Toggling notification: ${type}`);
     setNotifications(prev => ({
       ...prev,
       [type]: !prev[type]
     }));
     // Show success message if API call is successful
     // setSuccess(`${type} notifications toggled.`);
   };

   const handlePrivacyChange = (type, value) => {
     // TODO: Integrate with backend API to save preference
     console.log(`Changing privacy setting: ${type} to ${value}`);
     setPrivacy(prev => ({
       ...prev,
       [type]: value
     }));
     // Show success message if API call is successful
     // setSuccess(`${type} setting updated.`);
   };


  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // File validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and GIF image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // Max 5MB
      setError('Image size should be less than 5MB.');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    setSuccess('');

    try {
         const currentUser = auth.currentUser; // Use current user
         if (!currentUser) {
             throw new Error('User not authenticated for upload.');
         }
         // Create a storage reference: profile_photos / user.uid / timestamp_filename
         const timestamp = Date.now();
         const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`; // Sanitize filename
         const storageRef = ref(storage, `profile_photos/${currentUser.uid}/${filename}`);

         // Upload the file
         const uploadResult = await uploadBytes(storageRef, file);

         // Get the download URL
         const downloadURL = await getDownloadURL(uploadResult.ref);

         // Update user profile with new photo URL
         await updateProfile(currentUser, {
             photoURL: downloadURL
         });

         // Manually update local user state
         setUser(prevUser => ({
            ...prevUser,
            photoURL: downloadURL
         }));

         setSuccess('Profile photo updated successfully!');

    } catch (error) {
      console.error('Photo upload error:', error);
      let customErrorMessage = `Failed to upload photo: ${error.message || 'Unknown error'}`;

       switch (error.code) {
           case 'storage/unauthorized':
              customErrorMessage = 'You do not have permission to upload files.';
              break;
           case 'storage/canceled':
              customErrorMessage = 'Upload was canceled.';
              break;
           case 'storage/retry-limit-exceeded':
              customErrorMessage = 'Upload failed due to network issues. Please try again.';
              break;
           // Add other relevant storage error codes
           default:
             // Use Firebase message if available and more specific
             if (error.message && error.message.includes('Firebase Storage')) {
                 customErrorMessage = error.message;
             }
             break;
       }
      setError(customErrorMessage); // Set error message

    } finally {
      setUploadingPhoto(false);
    }
  };

  // Helper to get a nice placeholder avatar (used if photoURL is null or fails to load)
  const getAvatarUrl = (user) => {
    const name = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
    // Using a service like ui-avatars.com or generating one server-side/client-side
    // For themed avatars, you might hardcode colors or use a more customizable library
    const themedBg = 'A7F3D0'; // light green (emerald-200)
    const themedColor = '047857'; // dark green (emerald-700)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${themedBg}&color=${themedColor}&size=128&rounded=true&bold=true`;
  };


   // Render loading state while fetching user
   if (!user) {
     return (
         <div className="min-h-screen flex justify-center items-center bg-emerald-50">
             <div className="text-center">
                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div>
                 <p className="mt-4 text-gray-700 text-lg">Loading settings...</p>
             </div>
         </div>
     );
   }

   // Render main settings page
  return (
    // FIX: Removed conditional class based on 'darkMode'
    <div className="min-h-screen bg-emerald-50 py-8 px-4"> {/* Themed background and padding */}
      <div className="container mx-auto max-w-2xl"> {/* Centered container */}
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200"> {/* Themed container */}

          {/* Profile Section */}
          <div className="w-full flex flex-col items-center justify-center p-6 mb-8 border-b border-gray-200"> {/* Themed padding, border */}
            <div className="relative mb-4 group"> {/* Increased margin */}
              {/* Avatar */}
              <div className="w-28 h-28 rounded-full bg-teal-200 p-1 group-hover:scale-105 transition-transform duration-300"> {/* Themed accent border */}
                <img
                  src={user.photoURL ? user.photoURL : getAvatarUrl(user)}
                  alt="profile avatar"
                  className="w-full h-full rounded-full object-cover bg-gray-100 border-4 border-white shadow-md" // Themed background/border
                  onError={e => { e.target.onerror = null; e.target.src = getAvatarUrl(user); }} // Fallback on error
                />
              </div>
               {/* Photo Upload Button/Spinner */}
               <label
                  className="absolute bottom-1 right-1 bg-teal-600 text-white p-2 rounded-full shadow-lg hover:bg-teal-700 cursor-pointer border-2 border-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2" // Themed button
                  htmlFor="photo-upload"
                  aria-label="Change profile photo"
                  style={{ zIndex: 2 }}
               >
                  <input
                      type="file"
                      id="photo-upload"
                      accept="image/png, image/jpeg, image/gif" // Specify allowed types
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                  />
                   {uploadingPhoto ? (
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                   ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                       </svg>
                   )}
               </label>
            </div>
            <h3 className="text-2xl font-bold mb-1 text-gray-900">{user.displayName || 'User'}</h3> {/* Themed name */}
            <p className="text-gray-600 text-lg">{user.email}</p> {/* Themed email */}
             {user.emailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      Verified
                  </span>
             ) : (
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                      Unverified
                 </span>
             )}

          </div>

          {/* Settings Form Sections */}
          <div className="w-full space-y-8"> {/* Added space between sections */}
            <h2 className="text-3xl font-bold mb-6 text-teal-800">Settings</h2> {/* Themed main settings title */}

            {/* Error and Success Messages */}
             {(error || success) && (
                <div className="p-4 rounded-md shadow-sm font-semibold text-sm">
                    {error && (
                        <div className="bg-red-50 text-red-700 border border-red-300 p-3 rounded-md mb-2">{error}</div> 
                    )}
                     {success && (
                        <div className="bg-green-50 text-green-700 border border-green-300 p-3 rounded-md">{success}</div> 
                    )}
                </div>
             )}


            {/* Dark Mode Toggle (Basic Theming) */}
            {/* Keeping the toggle but removing the full dark mode implementation complexity */}
          

            {/* Profile Information Editing */}
            <div className="mb-8 pb-8 border-b border-gray-200"> {/* Themed divider */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3> {/* Themed title */}
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    // Clear relevant states when toggling edit mode
                    setError('');
                    setSuccess('');
                    setCurrentPassword(''); // Always clear current password on toggle
                    // Reset input fields to current user data if cancelling edit
                     if (isEditing) { // If exiting edit mode
                         setNewDisplayName(user.displayName || '');
                         setNewEmail(user.email || '');
                     }
                  }}
                   className="text-teal-600 hover:text-teal-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded" // Themed button
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4"> {/* Spacing between inputs */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Display Name</label> {/* Themed label */}
                   <input
                     type="text"
                     value={isEditing ? newDisplayName : (user.displayName || '')}
                     onChange={(e) => setNewDisplayName(e.target.value)}
                     className={`w-full p-2 border rounded-lg text-gray-800 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}`} // Themed input styling based on editing state
                     placeholder="Enter your display name"
                     disabled={!isEditing}
                   />
                 </div>

                 <div>
                   <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label> {/* Themed label */}
                   <input
                     type="email"
                     value={isEditing ? newEmail : (user.email || '')}
                     onChange={(e) => setNewEmail(e.target.value)}
                      className={`w-full p-2 border rounded-lg text-gray-800 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}`} // Themed input styling based on editing state
                     placeholder="Enter your email"
                     disabled={!isEditing}
                   />
                    {!user.emailVerified && user.email && (
                        <p className="mt-1 text-sm text-yellow-700 font-medium">
                            Your email is not verified. Please check your inbox for a verification link.
                            {/* Optional: Add a button to resend verification email */}
                            {/* <button onClick={handleResendVerification} className="text-yellow-800 hover:underline ml-1">Resend</button> */}
                        </p>
                    )}
                 </div>

                 {/* Current Password for Confirmation */}
                 {isEditing && (
                   <div>
                     <label className="block mb-2 text-sm font-semibold text-gray-700">Current Password</label> {/* Themed label */}
                     <input
                       type="password"
                       value={currentPassword}
                       onChange={(e) => setCurrentPassword(e.target.value)}
                       className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300 text-gray-800 placeholder-gray-500" // Themed input
                       placeholder="Enter your current password"
                       required={isEditing} // Require password when editing
                     />
                     <p className="text-sm text-gray-600 mt-1">
                       Required to confirm changes to name or email.
                     </p>
                   </div>
                 )}

                 {/* Save Changes Button */}
                 {isEditing && (
                   <div className="mt-6"> {/* Added margin top */}
                     <button
                       onClick={handleProfileUpdate}
                       disabled={loading || !currentPassword || (newDisplayName.trim() === user.displayName && newEmail === user.email)} // Disable if loading, no current password, or no changes
                       className={`w-full bg-teal-600 text-white font-semibold p-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`} // Themed primary button
                     >
                       {loading ? 'Saving...' : 'Save Changes'}
                     </button>
                   </div>
                 )}
               </div>
            </div>

            {/* Notifications */}
            <div className="mb-8 pb-8 border-b border-gray-200"> {/* Themed divider */}
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Notifications</h3> {/* Themed title */}
              <div className="space-y-4"> {/* Increased space */}
                <label className="flex items-center justify-between text-gray-700"> {/* Themed label */}
                  <span>Email Notifications</span>
                   {/* Using a basic Tailwind form toggle or custom style */}
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500" // Themed toggle
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700"> {/* Themed label */}
                  <span>Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500" // Themed toggle
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700"> {/* Themed label */}
                  <span>Reminders</span>
                  <input
                    type="checkbox"
                    checked={notifications.reminders}
                    onChange={() => handleNotificationChange('reminders')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500" // Themed toggle
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700"> {/* Themed label */}
                  <span>App Updates & Announcements</span>
                  <input
                    type="checkbox"
                    checked={notifications.updates}
                    onChange={() => handleNotificationChange('updates')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500" // Themed toggle
                  />
                </label>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="mb-8 pb-8 border-b border-gray-200"> {/* Themed divider */}
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Privacy</h3> {/* Themed title */}
              <div className="space-y-4"> {/* Increased space */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Profile Visibility</label> {/* Themed label */}
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out" // Themed select input
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option> {/* Requires friends feature */}
                  </select>
                </div>
                <label className="flex items-center justify-between text-gray-700"> {/* Themed label */}
                  <span>Show Email Address</span>
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500" // Themed toggle
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700"> {/* Themed label */}
                  <span>Show Activity Status</span>
                  <input
                    type="checkbox"
                    checked={privacy.showActivity}
                    onChange={() => handlePrivacyChange('showActivity', !privacy.showActivity)}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500" // Themed toggle
                  />
                </label>
              </div>
            </div>

            {/* Reset Password Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                    setPasswordResetModal(true);
                    setError(''); // Clear errors when opening modal
                    // Optionally clear modal inputs here too if you want a fresh start
                    setNewPassword('');
                    setConfirmPassword('');
                    setCurrentPassword('');
                }}
                className="w-full max-w-xs bg-gray-300 text-gray-800 font-semibold p-3 rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200" // Themed secondary button
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={passwordResetModal}
        onClose={() => {
             setPasswordResetModal(false);
             // Clear inputs and errors when closing modal
             setNewPassword('');
             setConfirmPassword('');
             setCurrentPassword('');
             setError(''); // Clear modal-related errors from main state
        }}
        onSubmit={handlePasswordReset}
        loading={loading} // Pass main loading state
        error={error} // Pass main error state
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
      />
    </div>
  );
};

export default Settings;
import React, { useState, useEffect, useRef } from 'react';
import { auth, storage } from '../../firebase/config'; 
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

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
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-teal-700">Reset Password</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-300 shadow-sm text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500"
              placeholder="Enter new password (min 6 characters)"
              required
              minLength="6"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out text-gray-800 placeholder-gray-500"
              placeholder="Confirm new password"
              required
              minLength="6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

const Settings = () => {
  const { showSuccess, showError } = useToast();

  const [passwordResetModal, setPasswordResetModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setNewDisplayName(user.displayName || '');
        setNewEmail(user.email || '');
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
      if (success) {
          const timer = setTimeout(() => {
              setSuccess('');
          }, 3000);
          return () => clearTimeout(timer);
      }
  }, [success]);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      showError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      showError('Password must be at least 6 characters long.');
      return;
    }
    if (!currentPassword) {
      setError('Please enter your current password to reset.');
      showError('Please enter your current password to reset.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('User not found or email is missing.');
      }

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setPasswordResetModal(false);
      setSuccess('Password updated successfully!');
      showSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error) {
      let customErrorMessage = 'Failed to reset password. Please try again.';
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
      setError(customErrorMessage);
      showError(customErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!newDisplayName.trim()) {
      setError('Display name cannot be empty.');
      showError('Display name cannot be empty.');
      setLoading(false);
      return;
    }
    if (newDisplayName.trim().length < 2) {
      setError('Display name must be at least 2 characters long.');
      showError('Display name must be at least 2 characters long.');
      setLoading(false);
      return;
    }
    if (!currentPassword && (newDisplayName !== user.displayName || newEmail !== user.email)) {
      setError('Please enter your current password to confirm changes.');
      showError('Please enter your current password to confirm changes.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail && newEmail !== user.email && !emailRegex.test(newEmail)) {
      setError('Please enter a valid email address.');
      showError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    const nameChanged = newDisplayName.trim() !== user.displayName;
    const emailChanged = newEmail !== user.email;

    if (!nameChanged && !emailChanged) {
      setSuccess('No changes to save.');
      showSuccess('No changes to save.');
      setIsEditing(false);
      setCurrentPassword('');
      setLoading(false);
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('User not found or email is missing for reauthentication.');
      }

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      if (nameChanged) {
        await updateProfile(currentUser, {
          displayName: newDisplayName.trim()
        });
      }

      if (emailChanged) {
        await updateEmail(currentUser, newEmail);
        await sendEmailVerification(currentUser);
        setSuccess('Profile updated successfully! Please verify your new email address.');
        showSuccess('Profile updated successfully! Please verify your new email address.');
      } else {
        setSuccess('Profile updated successfully!');
        showSuccess('Profile updated successfully!');
      }

      setUser(prevUser => ({
        ...prevUser,
        displayName: nameChanged ? newDisplayName.trim() : prevUser.displayName,
        email: emailChanged ? newEmail : prevUser.email,
        emailVerified: emailChanged ? false : prevUser.emailVerified
      }));

      setIsEditing(false);
      setCurrentPassword('');
    } catch (error) {
      let customErrorMessage = 'Failed to update profile. Please try again.';
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
      setError(customErrorMessage);
      showError(customErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (type) => {
     console.log(`Toggling notification: ${type}`);
     setNotifications(prev => ({
       ...prev,
       [type]: !prev[type]
     }));
   };

   const handlePrivacyChange = (type, value) => {
     console.log(`Changing privacy setting: ${type} to ${value}`);
     setPrivacy(prev => ({
       ...prev,
       [type]: value
     }));
   };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and GIF image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    setSuccess('');

    try {
         const currentUser = auth.currentUser;
         if (!currentUser) {
             throw new Error('User not authenticated for upload.');
         }
         const timestamp = Date.now();
         const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
         const storageRef = ref(storage, `profile_photos/${currentUser.uid}/${filename}`);

         const uploadResult = await uploadBytes(storageRef, file);

         const downloadURL = await getDownloadURL(uploadResult.ref);

         await updateProfile(currentUser, {
             photoURL: downloadURL
         });

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
           default:
             if (error.message && error.message.includes('Firebase Storage')) {
                 customErrorMessage = error.message;
             }
             break;
       }
      setError(customErrorMessage);

    } finally {
      setUploadingPhoto(false);
    }
  };

  const getAvatarUrl = (user) => {
    const name = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
    const themedBg = 'A7F3D0';
    const themedColor = '047857';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${themedBg}&color=${themedColor}&size=128&rounded=true&bold=true`;
  };

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

  return (
    <div className="min-h-screen bg-emerald-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">

          <div className="w-full flex flex-col items-center justify-center p-6 mb-8 border-b border-gray-200">
            <div className="relative mb-4 group">
              <div className="w-28 h-28 rounded-full bg-teal-200 p-1 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={user.photoURL ? user.photoURL : getAvatarUrl(user)}
                  alt="profile avatar"
                  className="w-full h-full rounded-full object-cover bg-gray-100 border-4 border-white shadow-md"
                  onError={e => { e.target.onerror = null; e.target.src = getAvatarUrl(user); }}
                />
              </div>
               <label
                  className="absolute bottom-1 right-1 bg-teal-600 text-white p-2 rounded-full shadow-lg hover:bg-teal-700 cursor-pointer border-2 border-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  htmlFor="photo-upload"
                  aria-label="Change profile photo"
                  style={{ zIndex: 2 }}
               >
                  <input
                      type="file"
                      id="photo-upload"
                      accept="image/png, image/jpeg, image/gif"
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
            <h3 className="text-2xl font-bold mb-1 text-gray-900">{user.displayName || 'User'}</h3>
            <p className="text-gray-600 text-lg">{user.email}</p>
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

          <div className="w-full space-y-8">
            <h2 className="text-3xl font-bold mb-6 text-teal-800">Settings</h2>

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

            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setError('');
                    setSuccess('');
                    setCurrentPassword('');
                     if (isEditing) {
                         setNewDisplayName(user.displayName || '');
                         setNewEmail(user.email || '');
                     }
                  }}
                   className="text-teal-600 hover:text-teal-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Display Name</label>
                   <input
                     type="text"
                     value={isEditing ? newDisplayName : (user.displayName || '')}
                     onChange={(e) => setNewDisplayName(e.target.value)}
                     className={`w-full p-2 border rounded-lg text-gray-800 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}`}
                     placeholder="Enter your display name"
                     disabled={!isEditing}
                   />
                 </div>

                 <div>
                   <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                   <input
                     type="email"
                     value={isEditing ? newEmail : (user.email || '')}
                     onChange={(e) => setNewEmail(e.target.value)}
                      className={`w-full p-2 border rounded-lg text-gray-800 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}`}
                     placeholder="Enter your email"
                     disabled={!isEditing}
                   />
                    {!user.emailVerified && user.email && (
                        <p className="mt-1 text-sm text-yellow-700 font-medium">
                            Your email is not verified. Please check your inbox for a verification link.
                        </p>
                    )}
                 </div>

                 {isEditing && (
                   <div>
                     <label className="block mb-2 text-sm font-semibold text-gray-700">Current Password</label>
                     <input
                       type="password"
                       value={currentPassword}
                       onChange={(e) => setCurrentPassword(e.target.value)}
                       className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 border-gray-300 text-gray-800 placeholder-gray-500"
                       placeholder="Enter your current password"
                       required={isEditing}
                     />
                     <p className="text-sm text-gray-600 mt-1">
                       Required to confirm changes to name or email.
                     </p>
                   </div>
                 )}

                 {isEditing && (
                   <div className="mt-6">
                     <button
                       onClick={handleProfileUpdate}
                       disabled={loading || !currentPassword || (newDisplayName.trim() === user.displayName && newEmail === user.email)}
                       className={`w-full bg-teal-600 text-white font-semibold p-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                     >
                       {loading ? 'Saving...' : 'Save Changes'}
                     </button>
                   </div>
                 )}
               </div>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between text-gray-700">
                  <span>Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700">
                  <span>Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700">
                  <span>Reminders</span>
                  <input
                    type="checkbox"
                    checked={notifications.reminders}
                    onChange={() => handleNotificationChange('reminders')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700">
                  <span>App Updates & Announcements</span>
                  <input
                    type="checkbox"
                    checked={notifications.updates}
                    onChange={() => handleNotificationChange('updates')}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Privacy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Profile Visibility</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>
                <label className="flex items-center justify-between text-gray-700">
                  <span>Show Email Address</span>
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-700">
                  <span>Show Activity Status</span>
                  <input
                    type="checkbox"
                    checked={privacy.showActivity}
                    onChange={() => handlePrivacyChange('showActivity', !privacy.showActivity)}
                     className="form-switch h-5 w-9 appearance-none rounded-full bg-gray-300 checked:bg-teal-600 transition duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                    setPasswordResetModal(true);
                    setError('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setCurrentPassword('');
                }}
                className="w-full max-w-xs bg-gray-300 text-gray-800 font-semibold p-3 rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <PasswordResetModal
        isOpen={passwordResetModal}
        onClose={() => {
             setPasswordResetModal(false);
             setNewPassword('');
             setConfirmPassword('');
             setCurrentPassword('');
             setError('');
        }}
        onSubmit={handlePasswordReset}
        loading={loading}
        error={error}
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
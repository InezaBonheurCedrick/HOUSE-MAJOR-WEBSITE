import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon,
  KeyIcon,
  EnvelopeIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import authService from '../../services/authService'; // Assuming you have added getAdminUsers, createAdminUser, deleteAdminUser, updateProfile methods

// --- MOVED COMPONENTS OUTSIDE ---

const FormInput = ({ label, type, value, onChange, required = false, placeholder, name, isDark }) => ( // Added isDark prop
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
        isDark
          ? 'bg-[#1a143c] border-gray-700 text-white placeholder-gray-500 focus:ring-brand focus:border-brand'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-brand focus:border-brand'
      }`}
    />
  </div>
);

const PasswordInput = ({ label, value, onChange, required = false, name, showPassword, setShowPassword, isDark }) => ( // Added isDark prop
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 rounded-lg border text-sm pr-10 transition-colors ${
          isDark
            ? 'bg-[#1a143c] border-gray-700 text-white placeholder-gray-500 focus:ring-brand focus:border-brand'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-brand focus:border-brand'
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
          isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const ProfileManagement = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  // Current user profile data
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // New user data
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // List of existing users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadCurrentUser();
    // Assuming 'getAdminUsers' exists in your authService
    if (authService.getAdminUsers) {
      loadUsers(); // Load users initially if function exists
    } else {
       console.warn("authService.getAdminUsers function is missing.");
    }
  }, []);

  // Removed redundant loadUsers call based on activeTab, 
  // users are now loaded initially and after creation/deletion.
  // useEffect(() => {
  //  if (activeTab === 'users' && authService.getAdminUsers) {
  //    loadUsers();
  //  }
  // }, [activeTab]);


  const loadCurrentUser = () => {
    const email = authService.getUserEmail();
    const username = email ? email.split('@')[0] : 'Admin'; 
    
    setProfileData(prev => ({
      ...prev,
      email: email || '',
      username: username
    }));
  };

  const loadUsers = async () => {
    // Check if function exists before calling
    if (!authService.getAdminUsers) {
      setMessage({ type: 'error', text: 'Functionality to load users is not available.' });
      return;
    }
    try {
      setLoading(true); // Indicate loading for user list
      const response = await authService.getAdminUsers(); // Assuming this returns { data: { users: [...] } }
      // Make sure the response structure is correct
      if (response && response.data && Array.isArray(response.data.users)) {
         setUsers(response.data.users);
         setMessage({ type: '', text: '' }); // Clear previous errors
      } else {
        throw new Error("Invalid response structure from getAdminUsers");
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to load users' });
      setUsers([]); // Clear users on error
    } finally {
        setLoading(false);
    }
  };

  // --- Generic Handler for Profile Input Changes ---
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message.text) setMessage({ type: '', text: '' }); // Clear message on input change
  };

  // --- Generic Handler for New User Input Changes ---
   const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
     if (message.text) setMessage({ type: '', text: '' }); // Clear message on input change
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate passwords if changing
      if (profileData.newPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (!profileData.currentPassword) {
           throw new Error('Current password is required to set a new password');
        }
      }
      
      // Ensure updateProfile function exists
       if (!authService.updateProfile) {
        throw new Error("Update profile functionality is not available.");
      }


      const updateData = {
        username: profileData.username,
        email: profileData.email,
        ...(profileData.newPassword && {
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        })
      };

      const result = await authService.updateProfile(updateData); 
      
      if (result.status === 'success') {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
        
        // Update localStorage if email changed and matches the updated one
        if (localStorage.getItem('userEmail') !== profileData.email) {
          localStorage.setItem('userEmail', profileData.email);
        }
        
        // Reset password fields only
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
         // Handle backend error messages if status is not 'success'
         throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
       console.error("Profile Update Error:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
     // Ensure createAdminUser function exists
    if (!authService.createAdminUser) {
        setMessage({ type: 'error', text: 'Functionality to create users is not available.' });
        setLoading(false);
        return;
    }


    try {
      if (newUserData.password !== newUserData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const userData = {
        username: newUserData.username,
        email: newUserData.email,
        password: newUserData.password
      };

      const result = await authService.createAdminUser(userData); 
      
      if (result.status === 'success') {
        setMessage({ type: 'success', text: result.message || 'User created successfully!' });
        setNewUserData({ // Reset form
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        loadUsers(); // Reload users list
      } else {
         throw new Error(result.message || 'Create user failed');
      }
    } catch (error) {
       console.error("Create User Error:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Prevent deleting own account (optional check based on email)
    const currentUserEmail = authService.getUserEmail();
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete && userToDelete.email === currentUserEmail) {
        setMessage({ type: 'error', text: 'You cannot delete your own account.' });
        return;
    }


    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
     // Ensure deleteAdminUser function exists
     if (!authService.deleteAdminUser) {
        setMessage({ type: 'error', text: 'Functionality to delete users is not available.' });
        return;
    }

    setMessage({ type: '', text: '' }); // Clear previous messages
    try {
      setLoading(true); // Indicate loading state
      const result = await authService.deleteAdminUser(userId); 
      if (result.status === 'success') {
        setMessage({ type: 'success', text: result.message || 'User deleted successfully!' });
        loadUsers(); // Reload users list
      } else {
         throw new Error(result.message || 'Delete user failed');
      }
    } catch (error) {
       console.error("Delete User Error:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete user' });
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Profile Management
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your account settings and admin users
        </p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
          message.type === 'error' 
            ? isDark 
              ? 'bg-red-900/20 border-red-800 text-red-300' 
              : 'bg-red-50 border-red-200 text-red-700'
            : isDark
              ? 'bg-green-900/20 border-green-800 text-green-300'
              : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="-mb-px flex space-x-8 overflow-x-auto"> {/* Added overflow-x-auto for smaller screens */}
          {[
            { id: 'profile', name: 'My Profile', icon: UserCircleIcon },
            { id: 'users', name: 'Admin Users', icon: PlusIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${ // Added whitespace-nowrap
                  activeTab === tab.id
                    ? isDark
                      ? 'border-white text-white'
                      : 'border-brand text-brand'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className={`rounded-xl border transition-colors duration-300 ${
          isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Account Information
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Update your account details and password
            </p>
          </div>

          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Username"
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleProfileInputChange} // Use generic handler
                required
                placeholder="Enter your username"
                isDark={isDark} // Pass isDark prop
              />
              
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileInputChange} // Use generic handler
                required
                placeholder="Enter your email"
                isDark={isDark} // Pass isDark prop
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className={`text-base font-medium mb-4 flex items-center space-x-2 ${ // Adjusted size and margin
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <KeyIcon className="h-5 w-5" />
                <span>Change Password (Optional)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Changed to 3 columns */}
                <PasswordInput
                  label="Current Password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleProfileInputChange} // Use generic handler
                  placeholder="Required to change password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isDark={isDark} // Pass isDark prop
                />
                
                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleProfileInputChange} // Use generic handler
                  placeholder="Enter new password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isDark={isDark} // Pass isDark prop
                />
                
                <PasswordInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleProfileInputChange} // Use generic handler
                  placeholder="Confirm new password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isDark={isDark} // Pass isDark prop
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-brand hover:bg-brand/90 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Create User Form */}
          <div className={`rounded-xl border transition-colors duration-300 ${
            isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className={`text-lg font-semibold flex items-center space-x-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <PlusIcon className="h-5 w-5" />
                <span>Create New Admin User</span>
              </h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Add new users with full admin access to the dashboard
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Username"
                  type="text"
                  name="username"
                  value={newUserData.username}
                  onChange={handleNewUserInputChange} // Use generic handler
                  required
                  placeholder="Enter username"
                  isDark={isDark} // Pass isDark prop
                />
                
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleNewUserInputChange} // Use generic handler
                  required
                  placeholder="Enter email address"
                  isDark={isDark} // Pass isDark prop
                />
                
                <PasswordInput
                  label="Password"
                  name="password"
                  value={newUserData.password}
                  onChange={handleNewUserInputChange} // Use generic handler
                  required
                  placeholder="Enter password"
                  showPassword={showNewUserPassword}
                  setShowPassword={setShowNewUserPassword}
                  isDark={isDark} // Pass isDark prop
                />
                
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={newUserData.confirmPassword}
                  onChange={handleNewUserInputChange} // Use generic handler
                  required
                  placeholder="Confirm password"
                  showPassword={showNewUserPassword}
                  setShowPassword={setShowNewUserPassword}
                  isDark={isDark} // Pass isDark prop
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-brand hover:bg-brand/90 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating User...</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5" />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div className={`rounded-xl border transition-colors duration-300 ${
            isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Admin Users ({users.length})
              </h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Users with access to the admin dashboard
              </p>
            </div>

            <div className="p-6">
              {loading && users.length === 0 ? ( // Show loading indicator specifically for user list
                 <div className="text-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
                     <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading users...</p>
                 </div>
              ) : !loading && users.length === 0 ? (
                <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <UserCircleIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No admin users found.</p>
                  <p className="text-sm mt-2">Create the first admin user using the form above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200' // Added border
                    }`}>
                      <div className="flex items-center space-x-3 overflow-hidden"> {/* Added overflow-hidden */}
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${ // Added flex-shrink-0
                          isDark ? 'bg-brand/20' : 'bg-brand/10'
                        }`}>
                          <UserCircleIcon className={`h-6 w-6 ${isDark ? 'text-brand' : 'text-brand'}`} />
                        </div>
                        <div className="min-w-0"> {/* Added min-w-0 for truncation */}
                          <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.username}
                          </p>
                          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDark ? 'bg-green-600 text-white' : 'bg-green-800 text-white' // Adjusted green color slightly
                        }`}>
                          Admin
                        </span>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                           disabled={loading} // Disable button while loading
                          className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDark 
                              ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300' 
                              : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                          }`}
                          title="Delete User"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
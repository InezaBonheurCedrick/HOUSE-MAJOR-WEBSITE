import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthPage = ({ isDark }) => {
  const [authMode, setAuthMode] = useState('login');
  
  const isLoginMode = authMode === 'login';
  const isForgotPasswordMode = authMode === 'forgotPassword';
  const isResetPasswordMode = authMode === 'resetPassword';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    token: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };
  
  const resetFormFields = (keepEmail = false) => {
     setFormData({
      email: keepEmail ? formData.email : '',
      password: '',
      confirmPassword: '',
      token: '',
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLoginMode) {
        const result = await authService.login({
          email: formData.email,
          password: formData.password
        });
        if (result.status === 'success') {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } 
      else if (isForgotPasswordMode) {
          const result = await authService.forgotPassword({ email: formData.email });
          if (result.status === 'success') {
            setSuccess('Reset token sent to your email. Check your inbox (and spam folder).');
          }
      } else if (isResetPasswordMode) {
          if (formData.password !== formData.confirmPassword) {
            setError('New passwords do not match!');
            setIsLoading(false);
            return;
          }
          const result = await authService.resetPassword({
              email: formData.email,
              token: formData.token,
              newPassword: formData.password
          });
          if (result.status === 'success') {
             setSuccess('Password reset successfully! You can now login.');
             setTimeout(() => {
               setAuthMode('login');
               resetFormFields(true);
             }, 2000);
          }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  
  const switchToForgotPassword = () => {
    setAuthMode('forgotPassword');
    resetFormFields();
    setError('');
    setSuccess('');
  };
  
  const switchToLogin = () => {
     setAuthMode('login');
     resetFormFields();
     setError('');
     setSuccess('');
  };
  
  const getHeaderContent = () => {
       if (isLoginMode) return { title: 'Welcome Back', description: 'Sign in to your House Major account' };
       if (isForgotPasswordMode) return { title: 'Forgot Password', description: 'Enter your email to receive a reset token' };
       if (isResetPasswordMode) return { title: 'Reset Password', description: 'Enter your email, token, and new password' };
       return { title: '', description: '' };
  };
  const { title, description } = getHeaderContent();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>

      <div className="flex items-center justify-center px-4 py-30">
        <div className={`w-full max-w-md rounded-lg p-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-[#1a143c] border border-gray-800' 
            : 'bg-white border border-gray-200 shadow-xl'
        }`}>
          
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {description}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            

            {(isLoginMode || isForgotPasswordMode || isResetPasswordMode) && (
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <div className="relative">
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className={`w-full pl-5 pr-3 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none`} placeholder="you@example.com"/>
                </div>
              </div>
            )}
            
            {isResetPasswordMode && (
              <div>
                <label htmlFor="token" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Reset Token</label>
                <div className="relative">
                  <input
                    type="text"
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-3 rounded-lg border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                    placeholder="Enter token from email"
                  />
                </div>
              </div>
            )}

            {(isLoginMode || isResetPasswordMode) && (
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {isResetPasswordMode ? 'New Password' : 'Password'}
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required className={`w-full pl-5 pr-10 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none`} placeholder={isResetPasswordMode ? "Enter new password" : "Enter your password"}/>
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.58 10.58A3 3 0 0013.42 13.42M9.88 5.35A10.05 10.05 0 0112 5c5 0 9.27 3.11 11 7-1.02 2.07-2.67 3.86-4.62 4.9M6.6 6.6A9.97 9.97 0 004 12c1.27 2.96 4.06 5.2 7.4 5.9" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {isResetPasswordMode && (
              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className={`w-full pl-5 pr-3 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none`} placeholder="Confirm new password"/>
                </div>
              </div>
            )}
            
            {isLoginMode && (
                 <div className="text-right">
                    <button
                        type="button"
                        onClick={switchToForgotPassword}
                        disabled={isLoading}
                        className={`text-sm font-medium transition-colors duration-300 cursor-pointer ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Forgot Password?
                    </button>
                 </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand hover:bg-blue-900 transform hover:-translate-y-0.5'
              } text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isLoginMode ? 'Signing In...' : isForgotPasswordMode ? 'Sending Token...' : 'Resetting Password...'}
                </>
              ) : (
                isLoginMode ? 'Sign In' : isForgotPasswordMode ? 'Send Reset Token' : 'Reset Password'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            
            {(isForgotPasswordMode || isResetPasswordMode) && (
                 <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                   Remember your password?{' '}
                   <button type="button" onClick={switchToLogin} disabled={isLoading} className={`font-semibold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                     Sign in
                   </button>
                 </p>
            )}
            
            {isForgotPasswordMode && success && (
                 <p className={`text-sm mt-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                   Received your token?{' '}
                   <button type="button" onClick={() => setAuthMode('resetPassword')} disabled={isLoading} className={`font-semibold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                     Reset Password Now
                   </button>
                 </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

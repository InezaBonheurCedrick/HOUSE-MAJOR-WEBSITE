import React, { useState } from 'react';
import { 
  XMarkIcon, 
  DocumentArrowUpIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import careerService from '../services/careerService';

const ApplicationModal = ({ isOpen, onClose, jobTitle, isDark, careerId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cv: null,
    coverLetter: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        setError('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        cv: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Combine first and last name for fullName
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Prepare application data for backend
      const applicationData = {
        fullName: fullName,
        email: formData.email,
        phone: formData.phoneNumber || null,
        coverLetter: formData.coverLetter || null,
        jobTitle: jobTitle || null,
        careerId: careerId || null
      };

      let response;
      if (careerId) {
        response = await careerService.submitApplication(applicationData, formData.cv);
      } else {
        response = await careerService.submitGeneralApplication(applicationData, formData.cv);
      }

      console.log('Application submitted successfully:', response);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          cv: null,
          coverLetter: '',
        });
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError(
        error.response?.data?.message || 
        'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/20 overflow-hidden"
        onClick={handleOverlayClick}
      >
        <div className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${isDark ? 'bg-[#1a143c]' : 'bg-white'} shadow-2xl my-auto scrollbar-hide`}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 z-10 ${
            isDark 
              ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-inherit z-5">
              <h2 className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Apply for {jobTitle}
              </h2>
              <p className={`text-sm mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill in your details to apply for this position
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } focus:outline-none`}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } focus:outline-none`}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  } focus:outline-none`}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  } focus:outline-none`}
                  placeholder="+250 123 456 789"
                />
              </div>

              <div>
                <label htmlFor="coverLetter" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows="3"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  } focus:outline-none`}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div>
                <label htmlFor="cv" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload CV (PDF) *
                </label>
                <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors duration-300 ${
                  isDark 
                    ? 'border-gray-600 hover:border-indigo-500' 
                    : 'border-gray-300 hover:border-indigo-400'
                } ${formData.cv ? (isDark ? 'border-indigo-500' : 'border-indigo-400') : ''}`}>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept=".pdf"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <DocumentArrowUpIcon className={`mx-auto h-8 w-8 mb-2 transition-colors duration-300 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.cv ? formData.cv.name : 'Click to upload your CV'}
                    </p>
                    <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      PDF files only (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-0.5'
                  } text-white shadow-lg`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <DocumentArrowUpIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <p className={`text-xs text-center transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                By applying, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="mb-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Application Submitted!
            </h3>
            <p className={`text-sm mb-6 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Thank you for applying for the <strong>{jobTitle}</strong> position. We'll review your application and get back to you soon.
            </p>
            <div className={`p-3 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                You will receive a confirmation email shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
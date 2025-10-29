import React from 'react';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ContactViewModal = ({ isOpen, onClose, contact, isDark }) => {
  if (!isOpen || !contact) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-md rounded-xl border transition-colors duration-300 ${
          isDark ? 'bg-[#1a143c] border-gray-700' : 'bg-white border-gray-200 shadow-xl'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact Details
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete message information
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors duration-200 cursor-pointer ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            <div className={`flex items-start space-x-3 p-3 rounded-lg ${
              isDark ? 'bg-gray-800/30' : 'bg-gray-50'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-brand/20 text-white' : 'bg-brand/10 text-brand-600'
              }`}>
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Name
                </p>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {contact.name}
                </p>
              </div>
            </div>

            <div className={`flex items-start space-x-3 p-3 rounded-lg ${
              isDark ? 'bg-gray-800/30' : 'bg-gray-50'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-brand/20 text-white' : 'bg-brand/10 text-brand-600'
              }`}>
                <EnvelopeIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email
                </p>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {contact.email}
                </p>
              </div>
            </div>

            <div className={`flex items-start space-x-3 p-3 rounded-lg ${
              isDark ? 'bg-gray-800/30' : 'bg-gray-50'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-brand/20 text-white' : 'bg-brand/10 text-brand-600'
              }`}>
                <CalendarIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Received
                </p>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(contact.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <div className={`flex items-center space-x-2 mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className={`p-1 rounded ${
                isDark ? 'bg-brand/20 text-brand-300' : 'bg-brand/10 text-brand-600'
              }`}>
                <DocumentTextIcon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Message</span>
            </div>
            <div className={`p-3 rounded-lg border text-sm ${
              isDark ? 'bg-gray-800/30 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end p-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 cursor-pointer ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactViewModal;
import React, { useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline'; // <-- Added EnvelopeIcon

const InvestmentDetailsModal = ({ isOpen, onClose, investment, isDark }) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !investment) {
    return null;
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (err) { 
      return 'Invalid Date', err;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
      onClick={onClose} 
    >
      <div
        className={`relative w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] ${
          isDark ? 'bg-[#0f0a2e] border border-gray-700' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-start justify-between p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {investment.title}
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Posted on: {formatDate(investment.createdAt)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          <div>
            <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Investor Email
            </h3>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {investment.email || 'No email provided.'}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Description
            </h3>
            <p className={`text-sm whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {investment.description || 'No description provided.'}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center justify-end p-5 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-x-3`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetailsModal;
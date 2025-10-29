import React, { useState, useEffect, useMemo } from 'react';
import { 
  EyeIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  EllipsisVerticalIcon, 
  MagnifyingGlassIcon, 
} from '@heroicons/react/24/outline';
import careerService from '../../services/careerService';
import ApplicationDetailsModal from '../admin/ApplicationDetailsModal';

// --- 1. Pagination Constants ---
const ITEMS_PER_PAGE = 10;

const ApplicationsManagement = ({ isDark }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 2. State for Search, Pagination, and Actions ---
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null); // Stores the ID of the open menu
  
  const token = localStorage.getItem('authToken') || 'YOUR_DUMMY_TOKEN_FOR_TESTING';

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const apps = await careerService.getApplications();
      setApplications(apps);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- 3. Close action menu when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionMenu && !event.target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeActionMenu]);


  const handleDeleteApplication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }
    if (!token) {
      setError("Authentication error: No token provided.");
      return;
    }
    try {
      await careerService.deleteApplication(id);
      setApplications(applications.filter((app) => app.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application. You may not have permission.');
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleAcceptApplication = async (id) => {
    if (!window.confirm('Are you sure you want to accept this application?')) {
      return;
    }
    if (!token) {
      setError("Authentication error: No token provided.");
      return;
    }
    try {
      await careerService.acceptApplication(id);
      setError(null);
      fetchApplications();
    } catch (err) {
      console.error('Error accepting application:', err);
      setError('Failed to accept application. You may not have permission.');
    }
  };

  const handleRejectApplication = async (id) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }
    if (!token) {
      setError("Authentication error: No token provided.");
      return;
    }
    try {
      await careerService.rejectApplication(id);
      setError(null);
      fetchApplications();
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Failed to reject application. You may not have permission.');
    }
  };

  // --- 4. Filtering and Pagination Logic ---
  const filteredApplications = useMemo(() => {
    return applications.filter(app => 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.status || 'Pending').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApplications, currentPage]);

  // --- 5. Action Menu Styles ---
  const actionMenuItemClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
  }`;
  const actionMenuAcceptClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-green-400 hover:bg-green-900/20' : 'text-green-600 hover:bg-green-50'
  }`;
  const actionMenuRejectClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
  }`;


  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-600 text-white dark:bg-yellow-600 dark:text-white';
      case 'Reviewed': return 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand';
      case 'Accepted': return 'bg-green-600 text-white dark:bg-green-600 dark:text-white';
      case 'Rejected': return 'bg-red-600 text-white dark:bg-red-600 dark:text-white';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Job Applications
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and review job applications
          </p>
        </div>
        
        {/* --- 6. Search Bar --- */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </span>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className={`pl-10 pr-4 py-2 rounded-lg border text-sm w-full sm:w-64 ${
              isDark
                ? 'bg-[#1a143c] border-gray-700 text-white placeholder:text-gray-400 focus:ring-brand focus:border-brand'
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-brand focus:border-brand'
            }`}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className={`rounded-xl border transition-colors duration-300 ${
        isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            All Applications
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Applicant
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Position
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Date
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Status
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Resume
                </th>
                <th className={`text-right py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
                    <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading applications...</p>
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? ( 
                <tr>
                  <td colSpan="6" className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery ? 'No applications match your search.' : 'No applications found.'}
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((application, index) => {
                  
                  // Open upwards from the 5th row onwards (index > 3)
                  const openUp = index > 3;
                  const dropdownPositionClass = openUp ? 'bottom-full mb-2' : 'mt-2';

                  return (
                    <tr key={application.id} className={`border-b ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className="py-4 px-6">
                        <div>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {application.fullName}
                          </span>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {application.email}
                          </p>
                        </div>
                      </td>
                      <td className={`py-4 px-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {application.jobTitle || 'General Application'}
                      </td>
                      <td className={`py-4 px-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status || 'Pending')}`}>
                          {application.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {application.resumeUrl ? (
                          <a 
                            href={application.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center space-x-1 text-sm ${
                              isDark ? 'text-white hover:text-white' : 'text-brand hover:text-brand'
                            }`}
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                            <span>View CV</span>
                          </a>
                        ) : (
                          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No CV</span>
                        )}
                      </td>
                      
                      {/* --- 7. 3-Dot Action Menu --- */}
                      {/* --- 1. Added relative to the TD --- */}
                      <td className="py-4 px-6 text-right relative">
                        <div className="inline-block text-left action-menu-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(application.id === activeActionMenu ? null : application.id);
                            }}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              isDark 
                                ? `text-gray-400 hover:text-white ${activeActionMenu === application.id ? 'bg-gray-700' : 'hover:bg-gray-700'}` 
                                : `text-gray-500 hover:text-gray-900 ${activeActionMenu === application.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`
                            }`}
                            title="Actions"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeActionMenu === application.id && (
                            <div
                              // --- 2. Changed right-0 to right-6 (to match px-6) ---
                              className={`absolute w-48 rounded-lg shadow-xl z-20 overflow-hidden right-6 ${dropdownPositionClass} ${
                                isDark ? 'bg-[#1a143c] border border-gray-700' : 'bg-white border border-gray-200'
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ul className={`py-1 divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleViewApplication(application);
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuItemClass}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                    <span>View Details</span>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleAcceptApplication(application.id);
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuAcceptClass}
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleRejectApplication(application.id);
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuRejectClass}
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                    <span>Reject</span>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleDeleteApplication(application.id);
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuRejectClass} // Uses delete/reject styling
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                    <span>Delete</span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* --- 8. Pagination Controls --- */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-6 py-3 border-t ${
            isDark ? 'border-gray-800 bg-[#1a143c]' : 'border-gray-200 bg-gray-50'
          }`}>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              <span className="ml-4">
                (Total: {filteredApplications.length} applications)
              </span>
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500'
                    : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500'
                    : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ApplicationDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        application={selectedApplication}
        isDark={isDark}
      />
    </div>
  );
};

export default ApplicationsManagement;
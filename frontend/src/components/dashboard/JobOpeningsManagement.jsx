import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon, // Kept for future use (e.g., "View Applications" action)
  EllipsisVerticalIcon, // <-- Added
  MagnifyingGlassIcon, // <-- Added
} from '@heroicons/react/24/outline';
import careerService from '../../services/careerService';
import CareerFormModal from '../admin/CareerFormModal';

// --- 1. Pagination Constants ---
const ITEMS_PER_PAGE = 10;

const JobOpeningsManagement = ({ isDark }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  // --- 2. State for Search, Pagination, and Actions ---
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null); // Stores the ID of the open menu
  
  // TODO: Get auth token from your context
  const token = localStorage.getItem('authToken') || 'YOUR_DUMMY_TOKEN_FOR_TESTING';

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const careers = await careerService.getCareers();
      setJobs(careers);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job openings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
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


  // Handler for deleting a job
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job opening? This action cannot be undone.')) {
      return;
    }
    if (!token) {
      setError("Authentication error: No token provided.");
      return;
    }
    try {
      await careerService.deleteCareer(id);
      setJobs(jobs.filter((job) => job.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job opening. You may not have permission.');
    }
  };

  // Handlers for modal
  const handleAddJob = () => {
    setCurrentJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job) => {
    setCurrentJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentJob(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchJobs(); // Refetch all jobs
  };
  
  // --- 4. Filtering and Pagination Logic ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // --- 5. Action Menu Styles ---
  const actionMenuItemClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
  }`;
  const actionMenuDeleteClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
  }`;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Job Openings
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage job postings and applications
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* --- 6. Search Bar --- */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </span>
            <input
              type="text"
              placeholder="Search jobs..."
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
          <button 
            onClick={handleAddJob}
            className="btn-brand hover:bg-brand/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            title="Post Job"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Post Job</span>
          </button>
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
            Active Job Postings
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Position
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Department
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Type
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Applications
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Status
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
                    <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading job openings...</p>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? ( // <-- Use filtered list
                <tr>
                  <td colSpan="6" className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery ? 'No jobs match your search.' : 'No job openings found. Click "Post Job" to get started.'}
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => ( // <-- Use paginated list
                  <tr key={job.id} className={`border-b ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <td className="py-4 px-6">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {job.title}
                      </span>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {job.location}
                      </p>
                    </td>
                    <td className={`py-4 px-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {job.department}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-blue-900 text-white' : 'bg-blue-900 text-white'
                      }`}>
                        {job.type}
                      </span>
                    </td>
                    <td className={`py-4 px-6 font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {job.applicationCount || 0}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        'bg-green-600 text-white dark:bg-green-600 dark:text-white'
                      }`}>
                        Active
                      </span>
                    </td>
                    
                    {/* --- 7. 3-Dot Action Menu --- */}
                    <td className="py-4 px-6 text-right">
                      <div className="relative inline-block text-left action-menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenu(job.id === activeActionMenu ? null : job.id);
                          }}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            isDark 
                              ? `text-gray-400 hover:text-white ${activeActionMenu === job.id ? 'bg-gray-700' : 'hover:bg-gray-700'}` 
                              : `text-gray-500 hover:text-gray-900 ${activeActionMenu === job.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`
                          }`}
                          title="Actions"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeActionMenu === job.id && (
                          <div
                            className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-20 overflow-hidden ${
                              isDark ? 'bg-[#1a143c] border border-gray-700' : 'bg-white border border-gray-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ul className={`py-1 ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                              {/* TODO: Add a handler for viewing applications for this job */}
                              {/* <li>
                                <button
                                  onClick={() => {
                                    // handleViewApplications(job.id);
                                    setActiveActionMenu(null);
                                  }}
                                  className={actionMenuItemClass}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  <span>View Applications</span>
                                </button>
                              </li> */}
                              <li>
                                <button
                                  onClick={() => {
                                    handleEditJob(job);
                                    setActiveActionMenu(null);
                                  }}
                                  className={actionMenuItemClass}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  <span>Edit Job</span>
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    handleDeleteJob(job.id);
                                    setActiveActionMenu(null);
                                  }}
                                  className={actionMenuDeleteClass}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  <span>Delete Job</span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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
                (Total: {filteredJobs.length} jobs)
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

      {/* Career Form Modal */}
      <CareerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSuccess}
        careerToEdit={currentJob}
        isDark={isDark}
      />
    </div>
  );
};

export default JobOpeningsManagement;
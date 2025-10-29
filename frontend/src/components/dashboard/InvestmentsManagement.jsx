import React, { useState, useEffect, useMemo } from 'react';
import { 
  EyeIcon,
  CheckIcon,
  TrashIcon, 
  EllipsisVerticalIcon, 
  MagnifyingGlassIcon, 
} from '@heroicons/react/24/outline';
import investmentService from '../../services/investmentService';
import InvestmentDetailsModal from '../admin/InvestmentDetailsModal';

// --- 1. Pagination Constants ---
const ITEMS_PER_PAGE = 6;

const InvestmentsManagement = ({ isDark }) => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 2. State for Search, Pagination, and Actions ---
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null); // Stores the ID of the open menu

  // --- 3. State for View Modal ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);


  useEffect(() => {
    fetchInvestments();
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

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await investmentService.getAllInvestments();
      setInvestments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please log in to delete investments.');
        return;
      }
      
      await investmentService.deleteInvestment(id, token);
      setInvestments(investments.filter(investment => investment.id !== id));
      setError('');
    } catch (err) {
      console.error('Delete investment error:', err);
      setError(err.message || 'Failed to delete investment');
    }
  };
  
  // --- 4. MODAL HANDLERS ---
  const handleViewInvestment = (investment) => {
    setSelectedInvestment(investment);
    setIsViewModalOpen(true);
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedInvestment(null);
  };


  // --- 4. Filtering and Pagination Logic ---
  const filteredInvestments = useMemo(() => {
    return investments.filter(investment => 
      investment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [investments, searchQuery]);

  const totalPages = Math.ceil(filteredInvestments.length / ITEMS_PER_PAGE);

  const paginatedInvestments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInvestments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvestments, currentPage]);

  // --- 5. Action Menu Styles ---
  const actionMenuItemClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
  }`;

  const actionMenuDeleteClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
  }`;


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Investment Management
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage investment opportunities and content
          </p>
        </div>
        
        {/* --- 6. Search Bar --- */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </span>
          <input
            type="text"
            placeholder="Search investments..."
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
        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {error}
        </div>
      )}

      <div className={`rounded-xl border transition-colors duration-300 ${
        isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Investment Content
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Title
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Description
                </th>
                <th className={`text-left py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Created
                </th>
                <th className={`text-right py-4 px-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr>
                  <td colSpan="4" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
                    <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading investments...</p>
                  </td>
                </tr>
              ) : filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center">
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {searchQuery ? 'No investments match your search.' : 'No investments found'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedInvestments.map((investment, index) => {
                  
                  // Open upwards from the 5th row onwards (index > 3)
                  const openUp = index > 3;
                  const dropdownPositionClass = openUp ? 'bottom-full mb-2' : 'mt-2';
                  
                  return (
                    <tr key={investment.id} className={`border-b ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className="py-4 px-6">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {investment.title}
                        </span>
                      </td>
                      <td className={`py-4 px-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="max-w-xs truncate" title={investment.description}>
                          {investment.description}
                        </div>
                      </td>
                      <td className={`py-4 px-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(investment.createdAt).toLocaleDateString()}
                      </td>
                      
                      {/* --- 7. 3-Dot Action Menu --- */}
                      <td className="py-4 px-6 text-right relative">
                        <div className="inline-block text-left action-menu-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(investment.id === activeActionMenu ? null : investment.id);
                            }}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              isDark 
                                ? `text-gray-400 hover:text-white ${activeActionMenu === investment.id ? 'bg-gray-700' : 'hover:bg-gray-700'}` 
                                : `text-gray-500 hover:text-gray-900 ${activeActionMenu === investment.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`
                            }`}
                            title="Actions"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeActionMenu === investment.id && (
                            <div
                              className={`absolute w-40 rounded-lg shadow-xl z-20 overflow-hidden right-6 ${dropdownPositionClass} ${
                                isDark ? 'bg-[#1a143c] border border-gray-700' : 'bg-white border border-gray-200'
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* --- UPDATED: Removed divide-y --- */}
                              <ul className={`py-1 ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleViewInvestment(investment); // <-- UPDATED
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuItemClass}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                    <span>View</span>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleDeleteInvestment(investment.id);
                                      setActiveActionMenu(null);
                                    }}
                                    className={actionMenuDeleteClass}
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
                  )
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
                (Total: {filteredInvestments.length} investments)
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

      {/* --- 9. RENDER THE MODAL --- */}
      <InvestmentDetailsModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        investment={selectedInvestment}
        isDark={isDark}
      />
    </div>
  );
};

export default InvestmentsManagement;
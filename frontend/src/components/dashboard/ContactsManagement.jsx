import React, { useState, useEffect, useMemo } from 'react';
import {
  EyeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon // Added for the 3-dot menu
} from '@heroicons/react/24/outline';
import contactService from '../../services/contactService';
import ContactViewModal from '../admin/ContactViewModal';

// Pagination Constants
const ITEMS_PER_PAGE = 6;

const ContactsManagement = ({ isDark }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Search and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // State for the 3-dot action menu
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu container
      if (openMenuId && !event.target.closest('.action-menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Authentication required. Please log in to view contacts.');
        setLoading(false);
        return;
      }

      const data = await contactService.getAllContacts(token);
      setContacts(data);
      setError('');
    } catch (err) {
      console.error('ContactsManagement - Error fetching contacts:', err);
      if (err.message.includes('401') || err.message.includes('403')) {
        setError('Session expired or insufficient permissions. Please log in again.');
        localStorage.removeItem('authToken');
      } else {
        setError(err.message || 'Failed to fetch contacts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      await contactService.deleteContact(id, token);
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete contact');
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  // Filtering and Pagination Logic
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.message || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);

  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredContacts, currentPage]);

  // Table styling classes
  const tableHeaderClass = `px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
    isDark ? 'text-gray-400' : 'text-gray-500'
  }`;

  const tableCellClass = `px-6 py-4 whitespace-nowrap text-sm ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contact Management
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage customer inquiries and communications
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </span>
            <input
              type="text"
              placeholder="Search contacts..."
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
      </div>

      {error && (
        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{error}</span>
          </div>
          {error.includes('Authentication required') && (
            <p className="text-sm mt-2">
              Please ensure you are logged in and have admin privileges.
            </p>
          )}
        </div>
      )}

      {!error && filteredContacts.length > 0 ? (
        <div className={`rounded-lg shadow overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
              <thead className={isDark ? 'bg-[#1a143c]' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={tableHeaderClass}>Contact</th>
                  <th scope="col" className={tableHeaderClass}>Message Preview</th>
                  <th scope="col" className={tableHeaderClass}>Date</th>
                  <th scope="col" className={`${tableHeaderClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'bg-[#0f0a2e] divide-gray-800' : 'bg-white divide-gray-200'}`}>
                {paginatedContacts.map((contact) => (
                  <tr key={contact.id} className={isDark ? 'hover:bg-[#1a143c]' : 'hover:bg-gray-50'}>
                    <td className={tableCellClass}>
                      <div>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {contact.name}
                        </span>
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center space-x-1">
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {contact.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={tableCellClass}>
                      {contact.message ? contact.message.substring(0, 50) + (contact.message.length > 50 ? '...' : '') : 'No message'}
                    </td>
                    <td className={tableCellClass}>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>

                    {/* --- ACTION MENU --- */}
                    <td className={`${tableCellClass} text-right`}>
                      <div className="relative inline-block text-left action-menu-container">
                        <div>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                            title="Actions"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Dropdown panel */}
                        {openMenuId === contact.id && (
                          <div
                            className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg  focus:outline-none ${
                              isDark ? 'bg-[#1a143c] ring-gray-700' : 'bg-white ring-black'
                            }`}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleViewContact(contact);
                                  setOpenMenuId(null);
                                }}
                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                  isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <EyeIcon className="mr-3 h-4 w-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteContact(contact.id);
                                  setOpenMenuId(null);
                                }}
                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                  isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-700 hover:bg-gray-100'
                                }`}
                              >
                                <TrashIcon className="mr-3 h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    {/* --- END ACTION MENU --- */}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-6 py-3 border-t ${
              isDark ? 'border-gray-800 bg-[#1a143c]' : 'border-gray-200 bg-gray-50'
            }`}>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                <span className="ml-4">
                  (Total: {filteredContacts.length} contacts)
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
      ) : !error ? (
        <div className={`text-center py-12 rounded-xl border transition-colors duration-300 ${
          isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {searchQuery ? 'No contacts match your search.' : 'No contact messages yet'}
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {searchQuery ? 'Try adjusting your search terms.' : 'Contact form submissions will appear here.'}
          </p>
        </div>
      ) : null}

      <ContactViewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        contact={selectedContact}
        isDark={isDark}
      />
    </div>
  );
};

export default ContactsManagement;
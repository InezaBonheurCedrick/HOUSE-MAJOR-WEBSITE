import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  EllipsisVerticalIcon, // <-- Added
  // --- Import all available icons ---
  PaintBrushIcon,
  RectangleGroupIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  CloudIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import serviceService from '../../services/serviceService';

// --- 1. Pagination Constants ---
const ITEMS_PER_PAGE = 6;

// --- Icon Registry & Helper Component ---
const ICON_REGISTRY = {
  PaintBrushIcon,
  RectangleGroupIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  CloudIcon,
  ChartBarIcon
};

const DynamicIcon = ({ name, className = "h-5 w-5" }) => {
  const IconComponent = ICON_REGISTRY[name];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent className={className} />;
};

// --- Reusable Form Components (FIXED) ---
const FormGroup = ({ label, name, children, isDark }) => (
  <div>
    <label 
      htmlFor={name} 
      className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}
    >
      {label}
    </label>
    {children}
  </div>
);

const FormInput = ({ name, isDark, ...props }) => (
  <input
    id={name}
    name={name}
    {...props}
    className={`w-full p-2 border rounded-md shadow-sm text-sm ${
      isDark 
        ? 'bg-[#1a143c] border-gray-700 text-white placeholder:text-gray-400 focus:ring-brand focus:border-brand' 
        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-brand focus:border-brand'
    }`}
  />
);

const FormTextarea = ({ name, isDark, ...props }) => (
  <textarea
    id={name}
    name={name}
    {...props}
    className={`w-full p-2 border rounded-md shadow-sm text-sm ${
      isDark 
        ? 'bg-[#1a143c] border-gray-700 text-white placeholder:text-gray-400 focus:ring-brand focus:border-brand' 
        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-brand focus:border-brand'
    }`}
  />
);

const FormSelect = ({ name, isDark, children, ...props }) => (
  <select
    id={name}
    name={name}
    {...props}
    className={`w-full p-2 border rounded-md shadow-sm text-sm ${
      isDark 
        ? 'bg-[#1a143c] border-gray-700 text-white focus:ring-brand focus:border-brand' 
        : 'bg-white border-gray-300 text-gray-900 focus:ring-brand focus:border-brand'
    }`}
  >
    {children}
  </select>
);
// --- End of Reusable Components ---


const ServicesManagement = ({ isDark }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null); 
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const availableIcons = Object.keys(ICON_REGISTRY);

  useEffect(() => {
    fetchServices();
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


  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    try {
      await serviceService.createService(formData);
      await fetchServices();
      handleModalClose();
    } catch (err) {
      setError('Failed to create service. Please try again.', err);
    }
  };

  const handleUpdateService = async () => {
    try {
      await serviceService.updateService(editingService.id, formData);
      await fetchServices();
      handleModalClose();
    } catch (err) {
      setError('Failed to update service. Please try again.', err);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.deleteService(id);
        await fetchServices();
      } catch (err)
 {
        setError('Failed to delete service. Please try again.', err);
      }
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      handleUpdateService();
    } else {
      handleCreateService();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
    });
    setEditingService(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
    setError('');
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 4. Filtering and Pagination Logic ---
  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // --- 5. Action Menu Styles ---
  const actionMenuItemClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
  }`;
  const actionMenuDeleteClass = `w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
    isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
  }`;


  const tableHeaderClass = `px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
    isDark ? 'text-gray-400' : 'text-gray-500'
  }`;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && !showModal && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Services Management
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your services and offerings
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
              placeholder="Search services..."
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
            onClick={() => setShowModal(true)}
            className="btn-brand hover:bg-brand/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className={`rounded-lg shadow overflow-hidden border ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
            <thead className={isDark ? 'bg-[#1a143c]' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={tableHeaderClass}>Service</th>
                <th scope="col" className={tableHeaderClass}>Description</th>
                <th scope="col" className={`${tableHeaderClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'bg-[#0f0a2e] divide-gray-800' : 'bg-white divide-gray-200'}`}>
              {filteredServices.length === 0 ? ( // <-- Use filtered list
                <tr>
                  <td colSpan="3" className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {searchQuery ? 'No services match your search.' : 'No services found.'}
                  </td>
                </tr>
              ) : (
                paginatedServices.map((service) => ( // <-- Use paginated list
                  <tr key={service.id} className={isDark ? 'hover:bg-[#1a143c]' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-brand/20 text-brand' : 'bg-brand/10 text-brand'
                        }`}>
                          <DynamicIcon name={service.icon} className="h-5 w-5" />
                        </span>
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {service.title}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {service.icon}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td 
                      className={`px-6 py-4 whitespace-nowrap text-sm max-w-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      title={service.description}
                    >
                      {service.description}
                    </td>
                    
                    {/* --- 7. 3-Dot Action Menu --- */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left action-menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenu(service.id === activeActionMenu ? null : service.id);
                          }}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            isDark 
                              ? `text-gray-400 hover:text-white ${activeActionMenu === service.id ? 'bg-gray-700' : 'hover:bg-gray-700'}` 
                              : `text-gray-500 hover:text-gray-900 ${activeActionMenu === service.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`
                          }`}
                          title="Actions"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeActionMenu === service.id && (
                          <div
                            className={`absolute right-0 mt-2 w-40 rounded-lg shadow-xl z-20 overflow-hidden ${
                              isDark ? 'bg-[#1a143c] border border-gray-700' : 'bg-white border border-gray-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ul className={`py-1 ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                              <li>
                                <button
                                  onClick={() => {
                                    handleEditClick(service);
                                    setActiveActionMenu(null);
                                  }}
                                  className={actionMenuItemClass}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    handleDeleteService(service.id);
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
                (Total: {filteredServices.length} services)
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

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/70">
          <div className={`relative w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] ${
            isDark ? 'bg-[#0f0a2e]' : 'bg-white'
          }`}>
            
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button 
                onClick={handleModalClose}
                className={`p-1 rounded-full ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <FormGroup label="Service Title" name="title" isDark={isDark}>
                <FormInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  isDark={isDark}
                  placeholder="e.g., Web Development"
                  required
                />
              </FormGroup>

              <FormGroup label="Description" name="description" isDark={isDark}>
                <FormTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  isDark={isDark}
                  placeholder="Briefly describe the service"
                  required
                />
              </FormGroup>
              
              <FormGroup label="Icon" name="icon" isDark={isDark}>
                <FormSelect
                  name="icon"
                  value={formData.icon}
                  onChange={handleFormChange}
                  isDark={isDark}
                  required
                >
                  <option value="">Select an icon</option>
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </FormSelect>
                {formData.icon && (
                  <div className={`mt-2 flex items-center space-x-2 p-2 rounded-md ${isDark ? 'bg-[#1a143c]' : 'bg-gray-50'}`}>
                    <DynamicIcon name={formData.icon} className={`h-5 w-5 ${isDark ? 'text-brand' : 'text-brand'}`} />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Preview</span>
                  </div>
                )}
              </FormGroup>

            </form>
            
            {/* Modal Footer */}
            <div className={`flex items-center justify-end p-5 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-x-3`}>
              <button
                type="button"
                onClick={handleModalClose}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg text-sm font-medium text-white btn-brand hover:bg-brand/90 transition-colors"
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
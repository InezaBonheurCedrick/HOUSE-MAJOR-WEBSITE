import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ProjectFormModal from '../admin/ProjectFormModal';
import projectService from '../../services/projectService';

// TODO: Import your auth context hook to get the token
// import { useAuth } from '../context/AuthContext'; 

// --- 1. Pagination Constants ---
const ITEMS_PER_PAGE = 6;

const PortfolioManagement = ({ isDark }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null); 
  
  // --- 2. State for Search, Pagination, and Actions ---
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null); // Stores the ID of the open menu
  
  // TODO: Get auth token from your context
  // const { token } = useAuth();
  const token = localStorage.getItem('authToken') || 'YOUR_DUMMY_TOKEN_FOR_TESTING'; // Replace this with your actual token

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projects = await projectService.getProjects();
      setProjects(projects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    if (!token) {
      setError("Authentication error: No token provided.");
      return;
    }
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. You may not have permission.');
    }
  };

  const handleAddProject = () => {
    setCurrentProject(null); 
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project); 
    setIsModalOpen(true);
  };

  const handleViewProject = (id) => {
    navigate(`/project/${id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchProjects(); 
  };

  // --- 4. Filtering and Pagination Logic ---
  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

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
  const tableCellClass = `px-6 py-4 whitespace-nowrap text-sm ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Portfolio Management
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your projects and case studies
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
              placeholder="Search projects..."
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
            onClick={handleAddProject}
            className="btn-brand hover:bg-brand/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            title="Add Project"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Responsive Table Wrapper */}
      <div className={`rounded-lg shadow overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
            <thead className={isDark ? 'bg-[#1a143c]' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={tableHeaderClass}>Project</th>
                <th scope="col" className={tableHeaderClass}>Category</th>
                <th scope="col" className={tableHeaderClass}>Client</th>
                <th scope="col" className={tableHeaderClass}>Date</th>
                <th scope="col" className={`${tableHeaderClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'bg-[#0f0a2e] divide-gray-800' : 'bg-white divide-gray-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
                    <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading projects...</p>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? ( // <-- Use filtered list
                <tr>
                  <td colSpan="5" className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery ? 'No projects match your search.' : 'No projects found. Click "Add Project" to get started.'}
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => ( // <-- Use paginated list
                  <tr key={project.id} className={isDark ? 'hover:bg-[#1a143c]' : 'hover:bg-gray-50'}>
                    <td className={tableCellClass}>
                      <div className="flex items-center space-x-3">
                        <img 
                          className="h-10 w-10 rounded-md object-cover flex-shrink-0" 
                          src={project.images?.[0] || 'https://via.placeholder.com/40'} 
                          alt={project.title} 
                        />
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</div>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{project.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className={tableCellClass}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark ? 'bg-brand text-white' : 'bg-brand/10 text-brand'
                      }`}>
                        {project.category}
                      </span>
                    </td>
                    <td className={tableCellClass}>{project.client?.name || 'N/A'}</td>
                    <td className={tableCellClass}>
                      {project.date ? new Date(project.date).toLocaleDateString() : 'N/A'}
                    </td>
                    
                    {/* --- 7. 3-Dot Action Menu --- */}
                    <td className={`${tableCellClass} text-right`}>
                      <div className="relative inline-block text-left action-menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenu(project.id === activeActionMenu ? null : project.id);
                          }}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            isDark 
                              ? `text-gray-400 hover:text-white ${activeActionMenu === project.id ? 'bg-gray-700' : 'hover:bg-gray-700'}` 
                              : `text-gray-500 hover:text-gray-900 ${activeActionMenu === project.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`
                          }`}
                          title="Actions"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeActionMenu === project.id && (
                          <div
                            className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-20 overflow-hidden ${
                              isDark ? 'bg-[#1a143c] border border-gray-700' : 'bg-white border border-gray-200'
                            }`}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                          >
                            <ul className={`py-1 ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                              <li>
                                <button
                                  onClick={() => {
                                    handleViewProject(project.id);
                                    setActiveActionMenu(null);
                                  }}
                                  className={actionMenuItemClass}
                                >
                                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                  <span>View Live</span>
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    handleEditProject(project);
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
                                    handleDeleteProject(project.id);
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
                (Total: {filteredProjects.length} projects)
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

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSuccess}
        projectToEdit={currentProject}
        isDark={isDark}
        token={token}
      />
    </div>
  );
};

export default PortfolioManagement;
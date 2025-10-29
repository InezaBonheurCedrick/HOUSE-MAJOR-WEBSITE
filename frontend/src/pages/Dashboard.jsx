import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import authService from '../services/authService';
import DashboardStats from '../components/dashboard/DashboardStats';
import ServicesManagement from '../components/dashboard/ServicesManagement';
import PortfolioManagement from '../components/dashboard/PortfolioManagement';
import JobOpeningsManagement from '../components/dashboard/JobOpeningsManagement';
import ApplicationsManagement from '../components/dashboard/ApplicationsManagement';
import TeamManagement from '../components/dashboard/TeamManagement';
import InvestmentsManagement from '../components/dashboard/InvestmentsManagement';
import ContactsManagement from '../components/dashboard/ContactsManagement';
import ProfileManagement from '../components/dashboard/ProfileManagement';

const whiteLogoUrl = 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761141673/upscalemedia-transformed_2_y4wfes.png';
const darkLogoUrl = 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761141866/upscalemedia-transformed-removebg-preview_ikdkye.png';

const Dashboard = ({ isDark, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'services', name: 'Services', icon: Cog6ToothIcon },
    { id: 'portfolio', name: 'Portfolio', icon: BriefcaseIcon },
    { id: 'job-openings', name: 'Job Openings', icon: DocumentTextIcon },
    { id: 'applications', name: 'Applications', icon: DocumentTextIcon },
    { id: 'team', name: 'Team', icon: UserGroupIcon },
    { id: 'investments', name: 'Investments', icon: CurrencyDollarIcon },
    { id: 'contacts', name: 'Contacts', icon: EnvelopeIcon },
    { id: 'profile', name: 'Profile', icon: UserCircleIcon }
  ];

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/auth');
      return;
    }

    const userEmail = authService.getUserEmail();
    setUser({ email: userEmail, name: userEmail?.split('@')[0] });
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardStats isDark={isDark} setActiveSection={setActiveSection} />
      case 'services':
        return <ServicesManagement isDark={isDark} />;
      case 'portfolio':
        return <PortfolioManagement isDark={isDark} />;
      case 'job-openings':
        return <JobOpeningsManagement isDark={isDark} />;
      case 'applications':
        return <ApplicationsManagement isDark={isDark} />;
      case 'team':
        return <TeamManagement isDark={isDark} />;
      case 'investments':
        return <InvestmentsManagement isDark={isDark} />;
      case 'contacts':
        return <ContactsManagement isDark={isDark} />;
      case 'profile':
        return <ProfileManagement isDark={isDark} />;
      default:
        return <DashboardStats isDark={isDark} setActiveSection={setActiveSection} />
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Fixed Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDark ? 'bg-[#1a143c]' : 'bg-white'} border-r ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        
        {/* Logo Section - Fixed at top */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center space-x-2">
              <img
                src={isDark ? whiteLogoUrl : darkLogoUrl}
                alt="House Major Logo"
                className="h-36 w-auto -my-[3.25rem] transition-transform duration-300 hover:scale-105"
              />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="mt-8 px-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-brand text-white shadow-lg'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* User Info & Logout - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
          <div className="p-4">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-[#0e2342] hover:bg-[#0a172b] text-white '
              }`}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area with fixed sidebar offset */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Fixed Top Bar */}
        <header className={`sticky top-0 z-30 flex-shrink-0 border-b transition-colors duration-300 ${
          isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-lg ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDark
                    ? 'hover:bg-brand/20 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 cursor-pointer" />
                ) : (
                  <MoonIcon className="w-5 h-5 cursor-pointer" />
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
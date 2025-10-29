import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  PlusIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import serviceService from '../../services/serviceService';
import projectService from '../../services/projectService';
import careerService from '../../services/careerService';
import teamService from '../../services/teamService';
import investmentService from '../../services/investmentService';
import contactService from '../../services/contactService';
import authService from '../../services/authService';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, change, icon: Icon, isDark }) => (
  <div className={`p-6 rounded-xl border transition-colors duration-300 ${
    isDark ? 'bg-[#1a143c] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
  }`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {title}
        </p>
        <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${isDark ? 'bg-brand/20' : 'bg-brand/10'}`}>
        <Icon className={`h-6 w-6 ${isDark ? 'text-white' : 'text-brand'}`} />
      </div>
    </div>
  </div>
);

const DashboardStats = ({ isDark, setActiveSection }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);
  
  // Pagination state for recent activities
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const [activitiesPerPage] = useState(4);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        setError('Please log in to view dashboard data');
        return;
      }

      const token = authService.getToken();
      
      // Fetch all data in parallel, but handle authentication for protected endpoints
      const fetchPromises = [
        serviceService.getServices().catch(err => {
          console.warn('Failed to fetch services:', err);
          return [];
        }),
        projectService.getProjects().catch(err => {
          console.warn('Failed to fetch projects:', err);
          return [];
        }),
        careerService.getCareers().catch(err => {
          console.warn('Failed to fetch careers:', err);
          return [];
        }),
        investmentService.getAllInvestments().catch(err => {
          console.warn('Failed to fetch investments:', err);
          return [];
        }),
        careerService.getApplications().catch(err => {
          console.warn('Failed to fetch applications:', err);
          return [];
        }),
        teamService.getAll().catch(err => {
          console.warn('Failed to fetch team members:', err);
          return [];
        }),
        contactService.getAllContacts(token).catch(err => {
          console.warn('Failed to fetch contacts:', err);
          return [];
        })
      ];

      const [
        services,
        projects,
        careers,
        investments,
        applications,
        teamMembers,
        contacts
      ] = await Promise.all(fetchPromises);

      // Calculate stats from real data
      const calculatedStats = [
        { 
          title: 'Total Services', 
          value: services.length.toString(), 
          icon: Cog6ToothIcon 
        },
        { 
          title: 'Portfolio Projects', 
          value: projects.length.toString(), 
          icon: BriefcaseIcon 
        },
        { 
          title: 'Job Openings', 
          value: careers.length.toString(), 
          icon: UserGroupIcon 
        },
        { 
          title: 'Applications', 
          value: applications.length.toString(), 
          icon: DocumentTextIcon 
        },
        { 
          title: 'Team Members', 
          value: teamMembers.length.toString(), 
          icon: UserGroupIcon 
        },
        { 
          title: 'Investment Inquiries', 
          value: investments.length.toString(), 
          icon: CurrencyDollarIcon 
        },
        { 
          title: 'Contacts', 
          value: contacts.length.toString(), 
          icon: EnvelopeIcon 
        }
      ];

      setStats(calculatedStats);
      generateRecentActivities(applications, projects, services, investments, careers, teamMembers, contacts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load some dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivities = (applications, projects, services, investments, careers, teamMembers, contacts) => {
    const activities = [];

    // Recent job applications (most recent first)
    applications.slice(0, 3).forEach(app => {
      activities.push({
        action: `New application from ${app.fullName} for ${app.jobTitle || 'General Position'}`,
        time: new Date(app.createdAt),
        type: 'application'
      });
    });

    // Recent projects added
    projects.slice(0, 2).forEach(project => {
      activities.push({
        action: `Project "${project.title}" added to portfolio`,
        time: new Date(project.createdAt),
        type: 'portfolio'
      });
    });

    // Recent service updates (assuming services have updatedAt field)
    services.slice(0, 2).forEach(service => {
      activities.push({
        action: `Service "${service.title}" ${service.updatedAt ? 'updated' : 'added'}`,
        time: new Date(service.updatedAt || service.createdAt),
        type: 'service'
      });
    });

    // Recent investment inquiries
    investments.slice(0, 2).forEach(investment => {
      activities.push({
        action: `New investment inquiry: ${investment.title}`,
        time: new Date(investment.createdAt),
        type: 'investment'
      });
    });

    // Recent job postings
    careers.slice(0, 2).forEach(job => {
      activities.push({
        action: `Job opening posted: ${job.title}`,
        time: new Date(job.createdAt),
        type: 'job'
      });
    });

    // Recent team member additions
    teamMembers.slice(0, 2).forEach(member => {
      activities.push({
        action: `Team member added: ${member.name}`,
        time: new Date(member.createdAt),
        type: 'team'
      });
    });

    // Recent contact inquiries
    contacts.slice(0, 2).forEach(contact => {
      activities.push({
        action: `New contact inquiry from ${contact.name}`,
        time: new Date(contact.createdAt),
        type: 'contact'
      });
    });

    // Sort all activities by time (newest first)
    const sortedActivities = activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .map(activity => ({
        ...activity,
        time: formatTimeAgo(activity.time)
      }));

    setRecentActivities(sortedActivities);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return '1 week ago';
    return `${diffInWeeks} weeks ago`;
  };

  // Pagination logic for recent activities
  const indexOfLastActivity = currentActivityPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = recentActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalActivityPages = Math.ceil(recentActivities.length / activitiesPerPage);

  const handleActivityPageChange = (pageNumber) => {
    setCurrentActivityPage(pageNumber);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Add New Service':
        setActiveSection('services');
        break;
      case 'Create Job Post':
        setActiveSection('job-openings');
        break;
      case 'Upload Project':
        setActiveSection('portfolio');
        break;
      case 'Add New Team Member':
        setActiveSection('team');
        break;
      case 'View Contacts':
        setActiveSection('contacts');
        break;
      case 'View Investments':
        setActiveSection('investments');
        break;
      default:
        break;
    }
  };

  const handleViewActivity = (activity) => {
    // Navigate to the relevant section based on activity type
    switch (activity.type) {
      case 'application':
        setActiveSection('applications');
        break;
      case 'portfolio':
        setActiveSection('portfolio');
        break;
      case 'service':
        setActiveSection('services');
        break;
      case 'investment':
        setActiveSection('investments');
        break;
      case 'job':
        setActiveSection('job-openings');
        break;
      case 'team':
        setActiveSection('team');
        break;
      case 'contact':
        setActiveSection('contacts');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-xl border transition-colors duration-300 ${
          isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, Admin!
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading dashboard data...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`p-6 rounded-xl border animate-pulse ${
              isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`h-6 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  <div className={`h-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-6 w-6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className={`p-4 rounded-lg border ${
          isDark ? 'bg-yellow-900/20 border-yellow-800 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
        }`}>
          <p>{error}</p>
        </div>
      )}

      <div className={`p-6 rounded-xl border transition-colors duration-300 ${
        isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, Admin!
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Here's what's happening with your Company today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.slice(0, 4).map((stat, index) => (
          <StatCard key={index} {...stat} isDark={isDark} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-6 rounded-xl border transition-colors duration-300 ${
          isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Activities
            </h2>
            {recentActivities.length > activitiesPerPage && (
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {currentActivityPage} of {totalActivityPages}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {currentActivities.length > 0 ? (
              currentActivities.map((activity, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg transition-colors duration-200 ${
                  isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    activity.type === 'portfolio' ? 'bg-blue-500' :
                    activity.type === 'application' ? 'bg-green-500' :
                    activity.type === 'service' ? 'bg-purple-500' :
                    activity.type === 'investment' ? 'bg-yellow-500' :
                    activity.type === 'job' ? 'bg-indigo-500' :
                    activity.type === 'team' ? 'bg-pink-500' :
                    activity.type === 'contact' ? 'bg-teal-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {activity.action}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activity.time}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleViewActivity(activity)}
                    className={`text-xs font-medium cursor-pointer ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    View
                  </button>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>No recent activities found</p>
              </div>
            )}
          </div>

          {/* Pagination Controls for Activities */}
          {totalActivityPages > 1 && (
            <div className={`flex items-center justify-between mt-6 pt-4 border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => handleActivityPageChange(currentActivityPage - 1)}
                disabled={currentActivityPage === 1}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700'
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex space-x-1">
                {[...Array(totalActivityPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handleActivityPageChange(index + 1)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      currentActivityPage === index + 1
                        ? isDark
                          ? 'bg-brand text-white'
                          : 'bg-brand text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleActivityPageChange(currentActivityPage + 1)}
                disabled={currentActivityPage === totalActivityPages}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700'
                }`}
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-xl border transition-colors duration-300 ${
          isDark ? 'bg-[#1a143c] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Add New Service', icon: Cog6ToothIcon },
              { label: 'Create Job Post', icon: DocumentTextIcon },
              { label: 'Upload Project', icon: BriefcaseIcon },
              { label: 'Add New Team Member', icon: UserGroupIcon },
              { label: 'View Contacts', icon: EnvelopeIcon },
              { label: 'View Investments', icon: CurrencyDollarIcon }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.label)}
                className={`w-full flex items-center space-x-3 text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                <action.icon className="h-5 w-5" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
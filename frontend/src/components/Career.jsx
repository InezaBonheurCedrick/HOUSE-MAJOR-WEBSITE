import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseIcon, UserGroupIcon, AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import ApplicationModal from './ApplicationModal';
import careerService from '../services/careerService';

const CareerOpportunities = ({ isDark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [careerCount, setCareerCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareerCount = async () => {
      try {
        const careers = await careerService.getCareers();
        setCareerCount(careers.length);
      } catch (error) {
        console.error('Error fetching career count:', error);
      }
    };

    fetchCareerCount();
  }, []);

  const opportunities = [
    {
      icon: <BriefcaseIcon className="h-6 w-6" />,
      title: 'Careers',
      description: 'Join our team of innovators and shape the future with us.',
      href: '/career',
      count: careerCount
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: 'Vacancy',
      description: 'Explore current open positions and find your perfect role.',
      href: '/career',
      count: careerCount
    },
    {
      icon: <AcademicCapIcon className="h-6 w-6" />,
      title: 'Internships',
      description: 'Launch your career with hands-on experience and mentorship.',
      href: '/career',
      count: 'Multiple'
    }
  ];

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCareerLinkClick = (e, href) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0424]' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Career Opportunities
          </h2>
          <p className={`text-base max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Join our mission to redefine the digital landscape. We're looking for passionate individuals ready to make an impact.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {opportunities.map((opportunity) => (
            <div 
              key={opportunity.title}
              className={`group relative p-6 rounded-lg border transition-all duration-300 hover:-translate-y-1 ${
                isDark 
                  ? 'bg-[#1a143c] border-transparent hover:shadow-xl' 
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}
            >
              
              <div className="flex justify-between items-start mb-4">
                <div className="inline-flex p-3 rounded-lg bg-brand text-white">
                  {opportunity.icon}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-blue-800'
                }`}>
                  {opportunity.count} {typeof opportunity.count === 'number' ? 'positions' : 'opportunities'}
                </span>
              </div>
              
              <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {opportunity.title}
              </h3>
              
              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {opportunity.description}
              </p>
              
              <button
                onClick={(e) => handleCareerLinkClick(e, opportunity.href)}
                className={`inline-flex items-center text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                  isDark ? 'text-white' : 'text-brand hover:text-brand'
                }`}
              >
                Explore opportunities
                <ArrowRightIcon className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        <div className={`text-center rounded-lg p-8 border transition-colors duration-300 ${
          isDark 
            ? 'bg-[#1a143c] border-transparent' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Start Your Journey?
          </h3>
          <p className={`text-base mb-6 max-w-xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Send us your resume and we'll get back to you with opportunities that match your skills.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <button
                onClick={handleApplyClick}
                className="w-full btn-brand hover:bg-brand/90 text-white font-semibold px-3 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Apply Now
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jobTitle="General Application"
        isDark={isDark}
        careerId={null}
      />
    </section>
  );
};

export default CareerOpportunities;
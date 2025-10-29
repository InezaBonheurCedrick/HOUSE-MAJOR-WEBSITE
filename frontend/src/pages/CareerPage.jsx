import React, { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/solid';
import ApplicationModal from '../components/ApplicationModal';
import careerService from '../services/careerService';

const CareerPage = ({ isDark }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const careers = await careerService.getCareers();
        setJobOpenings(careers);
      } catch (err) {
        console.error('Error fetching careers:', err);
        setError('Failed to load job openings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const benefits = [
    {
      icon: <CurrencyDollarIcon className="h-6 w-6" />,
      title: 'Competitive Salary',
      description: 'We offer competitive compensation packages that reward your skills and contributions.'
    },
    {
      icon: <CalendarIcon className="h-6 w-6" />,
      title: 'Flexible Work',
      description: 'Flexible working hours and remote work options to support work-life balance.'
    },
    {
      icon: <AcademicCapIcon className="h-6 w-6" />,
      title: 'Learning & Development',
      description: 'Continuous learning opportunities with training and conference attendance.'
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: 'Team Work',
      description: 'Work with our expert team across diverse fields to achieve outstanding results.'
    },
    {
      icon: <BriefcaseIcon className="h-6 w-6" />,
      title: 'Modern Equipment',
      description: 'Latest technology and tools to help you do your best work efficiently.'
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: 'Great Location',
      description: 'Office located in Norrsken House, Kigali\'s premier innovation hub.'
    }
  ];

  const hiringProcess = [
    {
      step: 1,
      title: 'Application Review',
      description: 'We carefully review each application to find the best matches for our team.',
      duration: '1-3 days'
    },
    {
      step: 2,
      title: 'Initial Screening',
      description: 'A quick chat to learn more about you and your experience.',
      duration: '30 minutes'
    },
    {
      step: 3,
      title: 'Technical Assessment',
      description: 'A practical assessment to evaluate your technical skills.',
      duration: '1-2 hours'
    },
    {
      step: 4,
      title: 'Team Interview',
      description: 'Meet the team and discuss how you can contribute to our projects.',
      duration: '1 hour'
    },
    {
      step: 5,
      title: 'Final Offer',
      description: 'We make an offer to the selected candidate and welcome them aboard!',
      duration: '1-2 days'
    }
  ];

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleGeneralApply = () => {
    setIsGeneralModalOpen(true);
  };

  const handleCloseGeneralModal = () => {
    setIsGeneralModalOpen(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className={`mt-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading job openings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
      <section className={`pt-32 pb-20 px-6 transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Build Your Career With Us
          </h1>
          <p className={`text-lg max-w-2xl mx-auto mb-8 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join our mission to redefine the digital landscape. We're looking for passionate individuals ready to make an impact and grow with us.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className={`px-4 py-2 rounded-full transition-colors duration-300 ${isDark ? 'bg-[#1a143c] text-gray-300' : 'bg-white text-gray-600 shadow-sm'}`}>
              <span className="flex items-center gap-2">
                <UserGroupIcon className={`h-4 w-4 ${isDark ? 'text-white' : 'text-brand'}`} />
                {jobOpenings.length}+ Open Positions
              </span>
            </div>
            <div className={`px-4 py-2 rounded-full transition-colors duration-300 ${isDark ? 'bg-[#1a143c] text-gray-300' : 'bg-white text-gray-600 shadow-sm'}`}>
              <span className="flex items-center gap-2">
                <MapPinIcon className={`h-4 w-4 ${isDark ? 'text-white' : 'text-brand'}`} />
                Kigali & Remote
              </span>
            </div>
            <div className={`px-4 py-2 rounded-full transition-colors duration-300 ${isDark ? 'bg-[#1a143c] text-gray-300' : 'bg-white text-gray-600 shadow-sm'}`}>
              <span className="flex items-center gap-2">
                <BriefcaseIcon className={`h-4 w-4 ${isDark ? 'text-white' : 'text-brand'}`} />
                Multiple Departments
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings Section */}
      <section className={`py-16 px-6 transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Current Openings
            </h2>
            <p className={`text-base max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Explore our current job opportunities and find the perfect role that matches your skills and aspirations.
            </p>
          </div>

          {error && (
            <div className="text-center mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {jobOpenings.length === 0 && !error ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No Current Openings
              </h3>
              <p className={`text-base transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Check back later for new opportunities or submit a general application.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobOpenings.map((job) => (
                <div 
                  key={job.id}
                  className={`p-6 rounded-lg border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-[#1a143c] border-transparent hover:border-brand/30' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${isDark ? 'bg-white text-brand' : 'bg-brand text-white'}`}>
                          {job.department}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${isDark ? 'bg-white text-brand' : 'bg-brand text-white'}`}>
                          {job.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${isDark ? 'bg-white text-brand' : 'bg-brand text-white'}`}>
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <div className={`text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p className="text-sm">
                        {job.posted ? `Posted ${job.posted}` : 'Recently posted'}
                      </p>
                    </div>
                  </div>

                  <p className={`mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {job.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className={`font-semibold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {req}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-white' : 'text-brand'}`} />
                            <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {resp}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-700">
                    <div className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center gap-2">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        {job.salary || 'Competitive'}
                      </span>
                      <span className="flex items-center gap-2 mt-1">
                        <ClockIcon className="h-4 w-4" />
                        {job.experience || 'Experience varies'}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleApplyClick(job)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${isDark ? 'btn-brand hover:bg-brand/90 text-white' : 'btn-brand hover:bg-brand/90 text-white'}`}
                    >
                      Apply Now
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-16 px-6 transition-colors duration-300 ${isDark ? 'bg-[#1a143c]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Why Join House Major?
            </h2>
            <p className={`text-base max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              We believe in taking care of our team members and providing an environment where everyone can thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-[#0a0424] border-transparent hover:shadow-xl' : 'bg-gray-50 border-gray-200 hover:shadow-lg'}`}
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-brand text-white">
                  {benefit.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {benefit.title}
                </h3>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process Section */}
      <section className={`py-16 px-6 transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Hiring Process
            </h2>
            <p className={`text-base max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              We've designed a straightforward process to help us get to know you better and ensure we're the right fit for each other.
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand opacity-30 transform translate-x-5 hidden md:block"></div>
            
            <div className="space-y-10">
              {hiringProcess.map((step) => (
                <div key={step.step} className="flex items-start gap-6 md:gap-8">
                  {/* Step circle */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative z-10 ring-4 ${isDark ? 'bg-brand text-white ring-[#0a0424]' : 'bg-brand text-white ring-gray-50'}`}>
                    {step.step}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm mb-3 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                    <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      <ClockIcon className="h-3.5 w-3.5" />
                      {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 px-6 transition-colors duration-300 ${isDark ? 'bg-[#1a143c]' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Don't See the Perfect Role?
          </h2>
          <p className={`text-base mb-8 max-w-xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            We're always looking for talented people. Send us your resume and we'll contact you when a matching opportunity arises.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <button
                onClick={handleGeneralApply}
                className="w-full btn-brand hover:bg-brand/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Submit General Application
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modals */}
      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        jobTitle={selectedJob?.title}
        isDark={isDark}
        careerId={selectedJob?.id}
      />

      <ApplicationModal 
        isOpen={isGeneralModalOpen}
        onClose={handleCloseGeneralModal}
        jobTitle="General Application"
        isDark={isDark}
        careerId={null}
      />
    </div>
  );
};

export default CareerPage;
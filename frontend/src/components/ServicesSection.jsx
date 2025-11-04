import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import { 
  PaintBrushIcon,
  RectangleGroupIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MegaphoneIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  'PaintBrushIcon': PaintBrushIcon,
  'RectangleGroupIcon': RectangleGroupIcon,
  'CodeBracketIcon': CodeBracketIcon,
  'DevicePhoneMobileIcon': DevicePhoneMobileIcon,
  'MegaphoneIcon': MegaphoneIcon,
  'MagnifyingGlassIcon': MagnifyingGlassIcon
};

const ServicesSection = ({ isDark }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // State to manage visibility

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://house-major-website-qgs3.onrender.com/services/frontend/all');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
        // Fallback data (from original file) is commented out
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Determine which services to display based on 'showAll' state
  const displayedServices = showAll ? services : services.slice(0, 6);

  if (loading) {
    return (
      <div className={`font-sans py-20 px-8 transition-colors duration-300 ${
        isDark ? 'bg-[#0a0424] text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse text-gray-400">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div id="services" className={`font-sans py-20 px-8 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0424] text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Services
          </h2>
          <p className={`mt-4 max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            We deliver technology solutions that help organizations operate more efficiently, securely, and intelligently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service) => { // Use displayedServices here
            const IconComponent = iconMap[service.icon];
            const iconElement = IconComponent ? 
              <IconComponent className="w-6 h-6 text-white" /> : 
              <div className="w-6 h-6 text-white">?</div>;

            return (
              <ServiceCard
                key={service.id}
                icon={iconElement}
                title={service.title}
                description={service.description}
                isDark={isDark}
              />
            );
          })}
        </div>

        {/* "Show More" / "Show Less" Button */}
        {services.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-5 py-3 rounded-full font-semibold text-white bg-brand transition-all duration-300 hover:opacity-90 cursor-pointer ${
                !isDark ? 'shadow-lg' : ''
              }`}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;
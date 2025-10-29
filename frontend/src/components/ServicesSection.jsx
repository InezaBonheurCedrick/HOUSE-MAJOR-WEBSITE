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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/services/frontend/all');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
        // // Fallback to static data if API fails
        // setServices([
        //   {
        //     id: 1,
        //     title: 'Software Development',
        //     description: 'Our services aim to improve smooth operations for organizations and entities using technological innovations.',
        //     icon: 'PaintBrushIcon',
        //   },
        //   {
        //     id: 2,
        //     title: 'Data Security',
        //     description: 'We help protect systems and data for entities, entrusted in handling data management technologies and protective measure against data loss cyber-attacks.',
        //     icon: 'RectangleGroupIcon',
        //   },
        //   {
        //     id: 3,
        //     title: 'Tech Consultancy',
        //     description: 'We facilitate in giving insights in technology and consultancy services in setting up system for business and organizations.',
        //     icon: 'CodeBracketIcon',
        //   },
        //   {
        //     id: 4,
        //     title: 'AI Model Development',
        //     description: 'We build AI model in various disciplines useful in shaping and improving nature of organization and businesses.',
        //     icon: 'DevicePhoneMobileIcon',
        //   },
        //   {
        //     id: 5,
        //     title: 'DevOps',
        //     description: 'Integrating pipelines to access clients across the global, putting you closer to your clients.',
        //     icon: 'MegaphoneIcon',
        //   },
        //   {
        //     id: 6,
        //     title: 'Cybersecurity',
        //     description: 'We build system defensive technologies against various attacks from all across the internet.',
        //     icon: 'MagnifyingGlassIcon',
        //   },
        //   {
        //     id: 7,
        //     title: 'Geospatial Analysis',
        //     description: 'We help entities determine suitable location and business locate where business needs to expands buy geospatial technologies.',
        //     icon: 'MagnifyingGlassIcon',
        //   },
        // ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
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
      </div>
    </div>
  );
};

export default ServicesSection;
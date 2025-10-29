import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const ServiceCard = ({ icon, title, description, isDark }) => {
  return (
    <div className={`relative p-8 rounded-2xl border transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl ${
      isDark 
        ? 'bg-[#1a143c] border-gray-800' 
        : 'bg-white shadow-lg border-gray-200'
    }`}>
      <div className="flex flex-col items-center text-center">
        <div className={`w-10 h-10 mb-6 rounded-xl flex items-center justify-center bg-brand ${
          !isDark ? 'shadow-md' : ''
        }`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold mb-3 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        <p className={`flex-grow ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
import React from 'react';
import { FiCheck, FiArrowUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';


const aboutImage = "https://res.cloudinary.com/dc6iwekzx/image/upload/v1761576406/AI_600_x_400_ebobyb.jpg";

const About = ({ isDark }) => {


  return (
    <div id="about" className={`font-sans relative py-20 px-8 transition-colors duration-300 ${ 
      isDark ? 'bg-[#0a0424] text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="flex flex-col gap-6">
          <p className={`text-sm font-semibold tracking-wider ${
            isDark ? 'text-white' : 'text-brand'
          }`}>DISCOVER OUR STORY</p>
          <h1 className={`text-4xl md:text-5xl font-bold leading-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Helping Organizations Thrive with Smart Tech
          </h1>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            HOUSE MAJOR Ltd is a tech startup company focusing on Ai solutions and system development for businesses and organizations for
             organization's scalability and data-driven decision support. HOUSE MAJOR Ltd provides consultancy services in sectors of Health
              technologies, Utilities, Environment and natural resource management using technology.
          </p>
          <ul className="space-y-4 mt-4">
            <li className="flex items-center gap-3">
              <FiCheck className={`${
            isDark ? 'text-white' : 'text-brand'
          }`} />
              <span>secure your business with us.</span>
            </li>
            <li className="flex items-center gap-3">
              <FiCheck className={`${
            isDark ? 'text-white' : 'text-brand'
          }`} />
              <span>leading in Ai model building in Rwanda.</span>
            </li>
            <li className="flex items-center gap-3">
              <FiCheck className={`${
            isDark ? 'text-white' : 'text-brand'
          }`} />
              <span>we help business and organizations thrive using technology.</span>
            </li>
          </ul>
          <div className="mt-6">
            <Link to="/about" className="inline-block btn-brand hover:opacity-90 transition-opacity text-white font-semibold py-3 px-8 rounded-full shadow-lg">
              Discover More
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex gap-8 sm:gap-12 mb-4">
            <div className="text-right">
              <p className={`text-3xl md:text-3xl font-bold ${
            isDark ? 'text-white' : 'text-brand'}`}>3+</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Years of Expertise</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl md:text-3xl font-bold ${
            isDark ? 'text-white' : 'text-brand'}`}>20+</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Happy Clients</p>
            </div>
          </div>
          <div className="relative w-full">
            <img 
              src={aboutImage}
              alt="image" 
              className="rounded-lg shadow-lg w-full h-120"
            />
            <div className="absolute inset-0 rounded-lg shadow-[0_0_60px_-15px_rgba(74,0,224,0.6)] pointer-events-none"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
import React from 'react';
import {
  CheckCircleIcon,
  PaintBrushIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
const illustrationImg = "https://res.cloudinary.com/dc6iwekzx/image/upload/v1761575774/istockphoto-1178452628-612x612_it8xpd.jpg"
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, stat, statLabel, isDark }) => (
  <div
    className={`p-8 rounded-lg border transition-all duration-300 ${
      isDark
        ? 'bg-[#1a143c] border-transparent hover:border-indigo-500'
        : 'bg-white border-gray-200 hover:shadow-xl'
    }`}
  >
    <div className="mb-6 inline-block bg-brand p-3 rounded-lg">{icon}</div>
    <h3
      className={`text-xl font-bold mb-3 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}
    >
      {title}
    </h3>
    <p
      className={`text-sm mb-6 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}
    >
      {description}
    </p>
    <hr className={`${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
    <div className="mt-6">
      <p
        className={`text-2xl font-extrabold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {stat}
      </p>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {statLabel}
      </p>
    </div>
  </div>
);

const WhyUs = ({ isDark }) => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Strategic Thinking',
      description:
        'We craft tailored technology solutions that align with your organization’s goals — driving efficiency, scalability, and impact.',
    },
    {
      title: 'Data-Driven Approach',
      description:
        'Every decision we make is backed by analytics, helping businesses turn insights into action and achieve measurable growth.',
    },
    {
      title: '24/7 Support',
      description:
        'Our dedicated technical team ensures your systems remain secure, reliable, and operational — anytime, anywhere.',
    },
  ];

  const handleAnchorClick = (anchor) => {
    if (window.location.pathname !== '/') {
      navigate(`/#${anchor}`);
    } else {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.pushState(null, '', `/#${anchor}`);
    }
  };

  return (
    <section
      className={`py-20 px-8 transition-colors duration-300 ${
        isDark ? 'bg-[#0a0424]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2
            className={`text-4xl font-extrabold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Why Us
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            We empower businesses and organizations to thrive using innovative
            technologies — from AI and system development to geospatial and
            cybersecurity solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <FeatureCard
            icon={<PaintBrushIcon className="h-7 w-7 text-white" />}
            title="Innovative Solutions"
            description="From AI model development to DevOps and cybersecurity, we design and implement systems that solve real-world challenges and help businesses grow."
            stat="95%"
            statLabel="Client Satisfaction"
            isDark={isDark}
          />
          <FeatureCard
            icon={<ChartBarIcon className="h-7 w-7 text-white" />}
            title="Proven Impact"
            description="Trusted by top organizations like IUCN, WelTel, RBC, and EDCL, our solutions drive measurable results in health, energy, and environment sectors."
            stat="200%"
            statLabel="Business Efficiency Boost"
            isDark={isDark}
          />
          <FeatureCard
            icon={<UserGroupIcon className="h-7 w-7 text-white" />}
            title="Expert Team"
            description="Our multidisciplinary experts combine AI, data science, and system engineering to deliver cutting-edge results that transform organizations."
            stat="20+"
            statLabel="Projects & Partnerships"
            isDark={isDark}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src={illustrationImg}
              alt="Team working on analytics"
              className="w-full h-100 rounded-lg"
            />
          </div>
          <div className="text-left">
            <h2
              className={`text-4xl font-extrabold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Why Leading Brands Choose Us
            </h2>
            <p
              className={`text-lg mb-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Organizations across Rwanda and beyond trust HOUSE MAJOR for our
              commitment to innovation, data security, and scalable digital
              transformation.
            </p>
            <ul className="space-y-6 mb-10">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start">
                  <CheckCircleIcon className={`h-7 w-7 mr-4 flex-shrink-0 mt-1 ${
                        isDark ? 'text-white' : 'text-brand'}`} />
                  <div>
                    <h4
                      className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className={`${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="group flex flex-col sm:flex-row justify-start items-center gap-4">
              <button
                onClick={() => handleAnchorClick('contact')}
                className={`
                  font-semibold px-8 py-3 rounded-full transition-colors duration-300 border w-full sm:w-auto cursor-pointer
                  hover:text-white hover:border-transparent
                  ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:bg-[var(--color-brand-light)]'
                      : 'border-gray-300 text-gray-700 hover:bg-[var(--color-brand)]'
                  }
                `}
              >
                Start Your Project
              </button>
              <button
                onClick={() => handleAnchorClick('portfolio')}
                className={`
                  font-semibold px-8 py-3 rounded-full transition-colors duration-300 border w-full sm:w-auto cursor-pointer
                  hover:text-white hover:border-transparent
                  ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:bg-[var(--color-brand-light)]'
                      : 'border-gray-300 text-gray-700 hover:bg-[var(--color-brand)]'
                  }
                `}
              >
                View Portfolio
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from './icons'; 

const whiteLogoUrl = 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761141673/upscalemedia-transformed_2_y4wfes.png';
const darkLogoUrl = 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761141866/upscalemedia-transformed-removebg-preview_ikdkye.png';


const Footer = ({ isDark }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (anchor) => {
    if (location.pathname !== '/') {
      navigate(`/#${anchor}`);
    } else {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.pushState(null, '', `/#${anchor}`);
    }
  };

  const linkSections = [
    {
      title: 'Useful Links',
      links: [
        { name: 'Home', anchor: 'hero' },
        { name: 'About Us', anchor: 'about' },
        { name: 'Services', anchor: 'services' },
        { name: 'Projects', anchor: 'portfolio' },
        { name: 'Contact Us', anchor: 'contact' },
      ],
    },
    {
      title: 'Our Services',
      links: [
        { name: 'Software Development', anchor: 'services' },
        { name: 'AI Model Development', anchor: 'services' },
        { name: 'Cybersecurity & Data Protection', anchor: 'services' },
        { name: 'Geospatial Analysis', anchor: 'services' },
        { name: 'Tech Consultancy', anchor: 'services' },
        { name: 'Cloud & DevOps', anchor: 'services' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'Our Team', anchor: 'team' },
        { name: 'Careers', path: '/career' },
        { name: 'Client Testimonials', anchor: 'testimonials' },
        { name: 'Investment', path: '/investment' },
        { name: 'Partners', path: '/about' },
      ],
    },
  ];

  const socialIcons = [
    { icon: <TwitterIcon className="h-5 w-5" />, href: 'https://x.com/gasigwaissa?s=21', label: 'Twitter' },
    { icon: <LinkedinIcon className="h-5 w-5" />, href: 'http://www.linkedin.com/in/gasigwa-issa-835854152', label: 'LinkedIn' },
  ];

  return (
    <footer
      className={`py-16 px-6 transition-colors duration-300 ${
        isDark ? 'bg-[#000000]' : 'bg-gray-200'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            
            <Link to="#hero" className="block mb-4">
              <img
                src={isDark ? whiteLogoUrl : darkLogoUrl}
                alt="House Major Logo"
                className="h-36 w-auto -my-[3.25rem] transition-transform duration-300 hover:scale-105"
              />
            </Link>

            <p
              className={`text-sm mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Innovation Hub, Norrsken Kigali<br />
              Rwanda
            </p>
            <p
              className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <strong className={isDark ? 'text-white' : 'text-gray-900'}>
                Phone:
              </strong>{' '}
              +250788258922
            </p>
            <p
              className={`text-sm mb-6 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <strong className={isDark ? 'text-white' : 'text-gray-900'}>
                Email:
              </strong>{' '}
              housemajorrwanda@gmail.com
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 ${
                    isDark
                      ? 'bg-[#1a143c] hover:bg-indigo-600 text-gray-400 hover:text-white shadow-lg'
                      : 'bg-white hover:bg-indigo-600 text-gray-600 hover:text-white shadow-md'
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {linkSections.map((section) => (
            <div key={section.title}>
              <h4
                className={`font-semibold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.anchor ? (
                      <button
                        onClick={() => handleAnchorClick(link.anchor)}
                        className={`text-sm text-left transition-colors duration-300 ${
                          isDark
                            ? 'text-gray-400 hover:text-indigo-400'
                            : 'text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.path || '/'}
                        className={`text-sm transition-colors duration-300 ${
                          isDark
                            ? 'text-gray-400 hover:text-indigo-400'
                            : 'text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`pt-8 border-t transition-colors duration-300 ${
            isDark ? 'border-gray-800' : 'border-gray-300'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              &copy; {new Date().getFullYear()}{' '}
              <strong className={isDark ? 'text-white' : 'text-gray-900'}>
                House Major
              </strong>
              . All Rights Reserved.
            </p>
            <p
              className={`text-xs mt-2 md:mt-0 transition-colors duration-300 ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              Developed by{' '}
              <a
                href="https://inezabonheurcedrick-web-neon.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-300 ${
                  isDark
                    ? 'text-indigo-400 hover:text-indigo-300'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                B-16
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
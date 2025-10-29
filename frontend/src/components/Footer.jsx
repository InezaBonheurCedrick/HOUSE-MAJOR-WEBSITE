import React from 'react';
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from './icons'; 

const Footer = ({ isDark }) => {
  const linkSections = [
    {
      title: 'Useful Links',
      links: ['Home', 'About Us', 'Services', 'Projects', 'Contact Us'],
    },
    {
      title: 'Our Services',
      links: [
        'Software Development',
        'AI Model Development',
        'Cybersecurity & Data Protection',
        'Geospatial Analysis',
        'Tech Consultancy',
        'Cloud & DevOps',
      ],
    },
    {
      title: 'Company',
      links: [
        'Our Team',
        'Careers',
        'News & Updates',
        'Client Testimonials',
        'Partners',
      ],
    },
    {
      title: 'Support',
      links: [
        'Help Center',
        'FAQs',
        'Terms of Service',
        'Privacy Policy',
        'Cookies Policy',
      ],
    },
  ];

  const socialIcons = [
    { icon: <TwitterIcon className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <FacebookIcon className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <InstagramIcon className="h-5 w-5" />, href: '#', label: 'Instagram' },
    { icon: <LinkedinIcon className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer
      className={`py-16 px-6 transition-colors duration-300 ${
        isDark ? 'bg-[#000000]' : 'bg-gray-200'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3
              className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              House Major
            </h3>
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
              +250 794 507 245
            </p>
            <p
              className={`text-sm mb-6 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <strong className={isDark ? 'text-white' : 'text-gray-900'}>
                Email:
              </strong>{' '}
              contact@housemajor.com
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
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
                  <li key={link}>
                    <a
                      href="#"
                      className={`text-sm transition-colors duration-300 ${
                        isDark
                          ? 'text-gray-400 hover:text-indigo-400'
                          : 'text-gray-600 hover:text-indigo-600'
                      }`}
                    >
                      {link}
                    </a>
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

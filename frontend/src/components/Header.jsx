import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import authService from '../services/authService';

const whiteLogoUrl = 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761141673/upscalemedia-transformed_2_y4wfes.png';
const darkLogoUrl = 'https://res.cloudinary.com/dc6iwekzx/image/upload/v1761141866/upscalemedia-transformed-removebg-preview_ikdkye.png';

const Header = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuthStatus();
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/', anchor: 'hero' },
    { name: 'About', href: '/', anchor: 'about' },
    { name: 'Services', href: '/', anchor: 'services' },
    { name: 'Portfolio', href: '/', anchor: 'portfolio' },
    { name: 'Contact', href: '/', anchor: 'contact' },
    { name: 'Investment', href: '/investment' },
    { name: 'Career', href: '/career' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (location.pathname === '/') {
        const sections = ['hero', 'about', 'services', 'portfolio', 'contact'];
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (current) {
          setActiveSection(current);
          if (window.location.hash !== `#${current}`) {
            window.history.replaceState(null, '', `/#${current}`);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    if (location.pathname === '/' && location.hash) {
      setActiveSection(location.hash.replace('#', ''));
    } else if (location.pathname === '/') {
      setActiveSection('hero');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const isTransparent = isDark && location.pathname === '/' && !isScrolled;

  const handleAnchorClick = (anchor) => {
    if (location.pathname !== '/') {
      navigate(`/#${anchor}`);
    } else {
      const element = document.getElementById(anchor);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(anchor);
      window.history.pushState(null, '', `/#${anchor}`);
    }
    setIsSidebarOpen(false);
  };

  const handleLinkClick = (href, anchor = null) => {
    if (anchor) handleAnchorClick(anchor);
    else {
      navigate(href);
      setIsSidebarOpen(false);
      setActiveSection('');
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      authService.logout();
      setIsAuthenticated(false);
      navigate('/');
    } else {
      navigate('/auth');
    }
    setIsSidebarOpen(false);
  };

  const isActiveLink = (href, anchor = null) => {
    if (location.pathname === '/') {
      if (anchor) return activeSection === anchor;
      return false;
    }
    return location.pathname === href;
  };

  return (
    <>
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent text-white'
            : isDark
            ? 'bg-[#1b1933] text-white shadow-lg'
            : 'bg-white text-gray-900 border-b border-gray-200 shadow-sm'
        }`}
      >
        <div className="max-w-6xl mx-auto w-full px-8 py-4">
          <div className="flex items-center justify-between">
            
            <Link to="/" className="flex items-center">
              <img
                src={isDark ? whiteLogoUrl : darkLogoUrl}
                alt="House Major Logo"
                className="h-36 w-auto -my-[3.25rem] transition-transform duration-300 hover:scale-105"
              />
            </Link>

            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <li key={link.name} className="relative group">
                    <button
                      onClick={() => handleLinkClick(link.href, link.anchor)}
                      className={`flex items-center transition-colors duration-300 cursor-pointer ${
                        isTransparent
                          ? 'text-gray-200 hover:text-white'
                          : isDark
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900' 
                      } ${
                        isActiveLink(link.href, link.anchor)
                          ? 'text-blue-900'
                          : ''
                      }`}
                    >
                      {link.name}
                    </button>
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-blue-900 transition-all duration-300 ${
                        isActiveLink(link.href, link.anchor)
                          ? 'w-full'
                          : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isTransparent
                    ? 'hover:bg-white/10'
                    : isDark
                    ? 'hover:bg-brand/20'
                    : 'hover:bg-gray-100' // Light mode hover
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 cursor-pointer" />
                ) : (
                  <MoonIcon className="w-5 h-5 cursor-pointer" />
                )}
              </button>
              <button
                onClick={handleAuthAction}
                className={`font-semibold px-6 py-2.5 rounded-full transition-colors duration-300 ${
                  isAuthenticated
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'btn-brand hover:bg-brand/90 text-white'
                }`}
              >
                {isAuthenticated ? 'Logout' : 'Sign In'}
              </button>
            </div>

            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isTransparent
                    ? 'hover:bg-white/10'
                    : isDark
                    ? 'hover:bg-brand/20'
                    : 'hover:bg-gray-100' // Light mode hover
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 cursor-pointer" />
                ) : (
                  <MoonIcon className="w-5 h-5 cursor-pointer" />
                )}
              </button>
              <button onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
                <Bars3Icon className="w-6 h-6 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <div
          className={`relative h-full w-64 ml-auto transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } ${isDark ? 'bg-[#1b1933]' : 'bg-white'}`}
        >
          <div className="p-6">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2"
              aria-label="Close menu"
            >
              <XMarkIcon
                className={`w-6 h-6 cursor-pointer ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              />
            </button>

            <nav className="mt-12">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleLinkClick(link.href, link.anchor)}
                      className={`block py-2 px-4 rounded transition-colors duration-300 w-full text-left ${
                        isDark
                          ? 'text-gray-200 hover:text-white hover:bg-white/10'
                          : 'text-gray-700 hover:text-black hover:bg-gray-100'
                      } ${
                        isActiveLink(link.href, link.anchor)
                          ? 'text-brand border-l-2 border-brand'
                          : ''
                      }`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleAuthAction}
                    className={`block py-2 px-4 rounded transition-colors duration-300 w-full text-left ${
                      isDark
                        ? isAuthenticated
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                          : 'text-brand hover:text-brand hover:bg-brand/10'
                        : isAuthenticated
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-100'
                          : 'text-brand hover:text-brand hover:bg-brand/10'
                    }`}
                  >
                    {isAuthenticated ? 'Logout' : 'Sign In'}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
import React, { useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import { LinkedinIcon, GithubIcon, TwitterIcon } from './icons';
import contactService from '../services/contactService';

const Contact = ({ isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await contactService.submitContact(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: <EnvelopeIcon className="h-5 w-5 " />,
      title: 'Email Us',
      value: 'gasigwaissa123@gmail.com',
      description: 'Response in 2-4 hours',
    },
    {
      icon: <PhoneIcon className="h-5 w-5 " />,
      title: 'Call Us',
      value: '+250788258922',
      description: 'Available 9AM - 6PM',
    },
    {
      icon: <MapPinIcon className="h-5 w-5 " />,
      title: 'Visit Our Office',
      value: 'Norrsken, Kigali, Rwanda',
      description: 'Open Monday - Friday',
    },
  ];

  const stats = [
    { value: '24h', label: 'Avg. Response' },
    { value: '95%', label: 'Client Satisfaction' },
    { value: '20+', label: 'Projects Delivered' },
  ];

  const socialLinks = [
    { icon: <LinkedinIcon className="h-5 w-5" />, href: 'http://www.linkedin.com/in/gasigwa-issa-835854152', label: 'LinkedIn' },
    { icon: <TwitterIcon className="h-5 w-5" />, href: 'https://x.com/gasigwaissa?s=21', label: 'Twitter' },
  ];

  return (
    <section
      id="contact"
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? 'bg-[#0a0424]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <div>
          <h2
            className={`text-4xl font-extrabold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Contact
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto mb-16 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
             We'd love to hear from you. Whether you're looking for a technology
          partner, need AI or data-driven solutions, or just want to collaborate
          on an idea — our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
          <div
            className={`p-8 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
              isDark ? 'bg-[#1a143c] border-transparent' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="p-3 bg-brand rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </span>
              <h3
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Let's Start a Conversation
              </h3>
            </div>
            <p
              className={`mb-8 text-sm leading-relaxed transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
             Speak directly with our support team. We're available Monday to Friday, 9:00 AM – 6:00 PM CAT.
            </p>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Message Sent!
                </h3>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Thank you for your message. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <textarea
                  name="message"
                  placeholder="Tell us more about your project..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 btn-brand hover:bg-brand/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3
                className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Ready to Transform Your Ideas?
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Reach out anytime for project inquiries, partnership opportunities,
              or general questions. We typically respond within 24 hours.
              </p>
            </div>

            {contactDetails.map((item) => (
              <div
                key={item.title}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark ? 'bg-[#1a143c] border-transparent text-white' : 'bg-white border-gray-200 shadow-sm text-brand'
                }`}
              >
                {item.icon}
                <div>
                  <h4
                    className={`font-semibold text-sm transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`text-base font-medium transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-brand'
                    }`}
                  >
                    {item.value}
                  </p>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

            <div
              className={`grid grid-cols-3 gap-3 text-center p-4 rounded-xl border transition-colors duration-300 ${
                isDark ? 'bg-[#1a143c] border-transparent' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p
                    className={`text-2xl font-bold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <h4
                className={`font-semibold mb-3 text-sm transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Connect With Us
              </h4>
              <div className="flex justify-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
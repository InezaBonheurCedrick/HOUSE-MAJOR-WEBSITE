import React, { useState } from 'react';
import { CurrencyDollarIcon, PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import contactService from '../services/contactService';

const Invest = ({ isDark = false }) => {
  const [investmentNature, setInvestmentNature] = useState('Venture Capital');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Submit as a contact form with investment inquiry
      await contactService.submitContact({
        name: 'Investment Inquiry',
        email: email,
        subject: `Investment Inquiry - ${investmentNature}`,
        message: `Investment Nature: ${investmentNature}\n\nThis is an investment inquiry from a potential investor. Please contact them to discuss investment opportunities.`
      });
      
      setIsSubmitted(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit investment inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-16 px-6 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0424]' : 'bg-gray-50'
    }`}>
      <div className={`max-w-5xl mx-auto rounded-lg p-12 border transition-colors duration-300 shadow-xl ${
        isDark 
          ? 'bg-gradient-to-br from-[#1a143c] to-[#0f0a28] border-indigo-900/20' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="text-left">
            <div className="mb-6 inline-flex items-center justify-center bg-indigo-600 p-3 rounded-md transition-all duration-300 shadow-lg shadow-indigo-500/20">
              <CurrencyDollarIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Invest in Us
            </h2>
            <p className={`text-md mb-8 leading-relaxed transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join us on our mission to redefine the digital landscape. We are seeking partners who share our passion for innovation and growth.
            </p>
            
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-xl transition-colors duration-300 ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  24hrs
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Response Time
                </div>
              </div>
              <div className={`p-4 rounded-xl transition-colors duration-300 ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  100%
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Confidential
                </div>
              </div>
            </div>
          </div>

          
          <div>
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Inquiry Submitted!
                </h3>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Thank you for your interest in investing with House Major. We'll contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="investment_nature" className={`block text-sm font-medium text-left mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Investment Nature
                  </label>
                  <select
                    id="investment_nature"
                    name="investment_nature"
                    value={investmentNature}
                    onChange={(e) => setInvestmentNature(e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-all duration-300 appearance-none cursor-pointer ${
                      isDark 
                        ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none'
                    }`}
                  >
                    <option>Venture Capital</option>
                    <option>Angel Investment</option>
                    <option>Strategic Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="investor_email" className={`block text-sm font-medium text-left mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="investor_email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Investment Inquiry'}</span>
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
                
                <div className={`mt-6 p-3 rounded-lg transition-colors duration-300 ${
                  isDark ? 'bg-gray-800/30 border border-gray-700/50' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    We'll contact you within 24 hours to discuss investment opportunities and share our detailed business plan.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Invest;
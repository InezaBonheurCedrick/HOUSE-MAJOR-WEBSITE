import React, { useState } from 'react';
import { 
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import investmentService from '../services/investmentService';

const InvestmentPage = ({ isDark }) => {
  const [investmentNature, setInvestmentNature] = useState('Venture Capital');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Use the public investment inquiry endpoint
      await investmentService.submitInvestmentInquiry({
        email: email,
        investmentNature: investmentNature,
        message: `This is an investment inquiry from a potential investor. Please contact them to discuss ${investmentNature} opportunities.`
      });
      
      setIsSubmitted(true);
      setEmail('');
      
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
      <section className={`pt-32 pb-20 px-6 transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center justify-center bg-brand p-3 rounded-2xl transition-all duration-300">
            <CurrencyDollarIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-4xl md:text-3xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Invest in Us
          </h1>
          <p className={`text-lg max-w-2xl mx-auto mb-3 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join our mission to redefine the digital landscape. We are seeking partners who share our passion for innovation and growth.
          </p>
        </div>
      </section>

      {/* Investment Form Section */}
      <section className={`py-16 px-6 transition-colors duration-300 ${isDark ? 'bg-[#0a0424]' : 'bg-gray-50'}`}>
        <div className={`max-w-md mx-auto rounded-lg p-8 border transition-colors duration-300 shadow-xl ${isDark ? 'bg-gradient-to-br from-[#1a143c] to-[#0a0424] border-brand/20' : 'bg-white border-gray-200'}`}>
          
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Investment Inquiry
                </h2>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  We'll contact you within 24 hours to discuss opportunities
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className={`w-full p-3 rounded-lg border transition-all duration-300 appearance-none cursor-pointer ${isDark ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-brand focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none'}`}
                  >
                    <option>Venture Capital</option>
                    <option>Angel Investment</option>
                    <option>Strategic Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="investor_email" className={`block text-sm font-medium text-left mb-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="investor_email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border transition-all duration-300 ${isDark ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-brand focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none'}`}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand hover:bg-brand/90 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-brand/10 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Investment Inquiry'}</span>
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="mb-4">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
              </div>
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Inquiry Submitted!
              </h3>
              <p className={`text-sm mb-6 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Thank you for your interest in investing with House Major. We'll contact you within 24 hours.
              </p>
              <div className={`p-3 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our investment team will reach out to discuss opportunities.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InvestmentPage;
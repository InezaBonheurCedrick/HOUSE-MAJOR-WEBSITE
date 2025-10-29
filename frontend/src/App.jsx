import './App.css'
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ServicesSection from './components/ServicesSection';
import Portfolio from './components/Portfolio';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import CareerOpportunities from './components/Career';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetails from './pages/ProjectDetails';
import AboutPage from './pages/AboutPage';
import CareerPage from './pages/CareerPage';
import InvestmentPage from './pages/InvestmentPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

const HashHandler = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return null;
};

function App() {
  
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <Router>
      <div className={`h-full min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#060821]' : 'bg-gray-50'
      }`}>
        <HashHandler />
        <Routes>
          <Route path="/" element={
            <>
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <Hero isDark={isDark} />
              <About isDark={isDark} />
              <ServicesSection isDark={isDark} />
              <Portfolio isDark={isDark} />
              <WhyUs isDark={isDark} />
              <Testimonials isDark={isDark} /> 
              <Team isDark={isDark} />
              <CareerOpportunities isDark={isDark} />
              <Contact isDark={isDark} />
              <Footer isDark={isDark} />
            </>
          } />
          <Route path="/project/:id" element={
            <>
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <ProjectDetails isDark={isDark} />
            </>
          } />
          <Route path="/about" element={
            <>
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <AboutPage isDark={isDark} />
            </>
          } />
          <Route path="/career" element={
            <>
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <CareerPage isDark={isDark} />
              <Footer isDark={isDark} />
            </>
          } />
          <Route path="/investment" element={
            <>
              <Header isDark={isDark} toggleTheme={toggleTheme} />
              <InvestmentPage isDark={isDark} />
              <Footer isDark={isDark} />
            </>
          } />
            <Route path="/auth" element={
              <>
                <Header isDark={isDark} toggleTheme={toggleTheme} />
                <AuthPage isDark={isDark} />
                <Footer isDark={isDark} />
              </>
            } />
            <Route path="/dashboard" element={
              <Dashboard isDark={isDark} toggleTheme={toggleTheme} />
            } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
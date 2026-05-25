import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import PhysicsParticles from './components/PhysicsParticles';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';
import { PortfolioData, AnalyticsData } from './types';
import { INITIAL_PORTFOLIO_DATA, INITIAL_ANALYTICS_DATA } from './data';

export default function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [isDarkModeSection, setIsDarkModeSection] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 at top, 1 past threshold
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Core portfolio state with structural persistence
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(INITIAL_PORTFOLIO_DATA);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(INITIAL_ANALYTICS_DATA);

  // Sync state with LocalStorage triggers on launch
  useEffect(() => {
    // 1. Portfolio data
    const savedPortfolio = localStorage.getItem('sami_portfolio_data');
    if (savedPortfolio) {
      try {
        setPortfolioData(JSON.parse(savedPortfolio));
      } catch (e) {
        console.error("Failed to parse portfolio database, defaulting.", e);
      }
    } else {
      localStorage.setItem('sami_portfolio_data', JSON.stringify(INITIAL_PORTFOLIO_DATA));
    }

    // 2. Analytics Views increment simulation
    const savedAnalytics = localStorage.getItem('sami_analytics_data');
    let currentAnalytics = INITIAL_ANALYTICS_DATA;
    if (savedAnalytics) {
      try {
        currentAnalytics = JSON.parse(savedAnalytics);
      } catch (e) {
        console.error("Failed to parse analytics records.", e);
      }
    }
    
    // Simulate single-visit increment
    const updatedAnalytics: AnalyticsData = {
      ...currentAnalytics,
      views: currentAnalytics.views + 1
    };
    setAnalyticsData(updatedAnalytics);
    localStorage.setItem('sami_analytics_data', JSON.stringify(updatedAnalytics));

    // 3. User Login State persistence check
    const loginSession = localStorage.getItem('sami_admin_logged');
    if (loginSession === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Set up scroll track trigger to scale cursor and invert viewport background with smooth interpolation
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      // Calculate a highly seamless scroll ratio over transition window (0 to 550px)
      const progress = Math.min(1, Math.max(0, y / 550));
      setScrollProgress(progress);
      setIsDarkModeSection(y > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initialization
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update Portfolio database state
  const handleUpdatePortfolio = (updatedData: PortfolioData) => {
    setPortfolioData(updatedData);
    localStorage.setItem('sami_portfolio_data', JSON.stringify(updatedData));
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('sami_admin_logged', 'true');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('sami_admin_logged');
    setAdminOpen(false);
  };

  const scrollToContact = () => {
    const contactBlock = document.getElementById('contact');
    if (contactBlock) {
      contactBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Interpolated background matching the editorial light to dark theme as user scrolls down
  const bgR = Math.round(250 - 245 * scrollProgress);
  const bgG = Math.round(250 - 245 * scrollProgress);
  const bgB = Math.round(250 - 245 * scrollProgress);
  const interpolatedBg = `rgb(${bgR}, ${bgG}, ${bgB})`;

  return (
    <>
      {/* 1. Preloader Stage */}
      <Preloader onComplete={() => setPreloaderComplete(true)} />

      {preloaderComplete && (
        <div 
          id="root-viewport-wrap"
          style={{ backgroundColor: interpolatedBg }}
          className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ease-out ${
            isDarkModeSection 
              ? 'text-white selection:bg-white selection:text-black' 
              : 'text-neutral-900 selection:bg-black selection:text-white'
          }`}
        >
          {/* 2. Interactive Spring Cursor with backdrop inversion values */}
          <CustomCursor isDarkModeSection={isDarkModeSection} />

          {/* Physics-driven slow-floating global backdrop elements */}
          <PhysicsParticles />

          {/* 3. Floating Glassmorphic Navbar */}
          <Navbar 
            onAdminClick={() => setAdminOpen(true)}
            isAdminLoggedIn={isAdminLoggedIn}
            onLogout={handleLogout}
            isDarkModeSection={isDarkModeSection}
          />

          {/* 4. Main Portfolio Layout Context */}
          <main className="flex-1 w-full flex flex-col">
            <HeroSection 
              profile={portfolioData.profile} 
              onContactClick={scrollToContact}
              scrollProgress={scrollProgress}
            />

            <ProjectsSection 
              projects={portfolioData.projects}
            />

            <GallerySection 
              gallery={portfolioData.gallery}
            />

            <ContactSection 
              profile={portfolioData.profile}
            />
          </main>

          {/* 5. Minimalist High Contrast Footer */}
          <footer 
            id="system-footer"
            className={`py-12 border-t z-10 text-center text-xs font-mono tracking-widest ${
              isDarkModeSection 
                ? 'bg-[#020202] text-neutral-600 border-neutral-900' 
                : 'bg-white text-neutral-400 border-neutral-200'
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} Sami Corporate. All rights reserved.</span>
              <span className="text-[10px] uppercase text-neutral-500 font-semibold cursor-pointer" onClick={() => setAdminOpen(true)}>
                SYSTEM DIRECTORY: ACCESS PANEL
              </span>
            </div>
          </footer>

          {/* 6. Admin Panel / Visual CMS Modals */}
          <AdminDashboard 
            isOpen={adminOpen}
            onClose={() => setAdminOpen(false)}
            portfolioData={portfolioData}
            onUpdatePortfolio={handleUpdatePortfolio}
            analyticsData={analyticsData}
            isAdminLoggedIn={isAdminLoggedIn}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
    </>
  );
}

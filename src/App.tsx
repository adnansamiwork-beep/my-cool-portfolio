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
import GameScreen from './components/GameScreen';
import { PortfolioData, AnalyticsData } from './types';
import { INITIAL_PORTFOLIO_DATA, INITIAL_ANALYTICS_DATA } from './data';

export default function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('sami_theme_mode');
    return saved ? saved === 'dark' : true; // Defaults to dark mode
  });
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'portfolio' | 'game'>('portfolio');

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

  const handleThemeToggle = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('sami_theme_mode', next ? 'dark' : 'light');
      return next;
    });
  };

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

  const baseBgClass = isDarkMode 
    ? 'bg-[#050505] text-white selection:bg-white selection:text-black' 
    : 'bg-white text-neutral-900 selection:bg-black selection:text-white';

  return (
    <>
      {/* 1. Preloader Stage */}
      <Preloader onComplete={() => setPreloaderComplete(true)} />

      {preloaderComplete && (
        <div 
          id="root-viewport-wrap"
          className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ease-out ${baseBgClass}`}
        >
          {/* 2. Interactive Spring Cursor with backdrop inversion values */}
          <CustomCursor isDarkModeSection={isDarkMode} />

          {/* Physics-driven slow-floating global backdrop elements */}
          <PhysicsParticles />

          {/* 3. Floating Glassmorphic Navbar */}
          <Navbar 
            onAdminClick={() => setAdminOpen(true)}
            isAdminLoggedIn={isAdminLoggedIn}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
            currentView={currentView}
            onViewChange={setCurrentView}
          />

          {/* 4. Dynamic Main Viewport Context */}
          {currentView === 'game' ? (
            <GameScreen 
              isDarkMode={isDarkMode} 
              onBackToHome={() => setCurrentView('portfolio')} 
            />
          ) : (
            <main className="flex-1 w-full flex flex-col">
              <HeroSection 
                profile={portfolioData.profile} 
                onContactClick={scrollToContact}
                isDarkMode={isDarkMode}
              />

              <ProjectsSection 
                projects={portfolioData.projects}
                isDarkMode={isDarkMode}
              />

              <GallerySection 
                gallery={portfolioData.gallery}
                isDarkMode={isDarkMode}
              />

              <ContactSection 
                profile={portfolioData.profile}
                isDarkMode={isDarkMode}
              />
            </main>
          )}

          {/* 5. Minimalist High Contrast Footer */}
          <footer 
            id="system-footer"
            className={`py-12 border-t z-10 text-center text-xs font-mono tracking-widest transition-colors duration-500 ${
              isDarkMode 
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

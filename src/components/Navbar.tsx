import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Menu, X, Landmark, Briefcase, Award, LogIn, Sun, Moon, Gamepad2 } from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  currentView: 'portfolio' | 'game';
  onViewChange: (view: 'portfolio' | 'game') => void;
}

export default function Navbar({ 
  onAdminClick, 
  isAdminLoggedIn, 
  onLogout, 
  isDarkMode, 
  onThemeToggle,
  currentView,
  onViewChange
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const percent = (window.scrollY / totalHeight) * 100;
        setScrollPercent(percent);
      } else {
        setScrollPercent(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    onViewChange('portfolio');
    // Allow view layout change update frame
    setTimeout(() => {
      const element = document.getElementById(target);
      if (element) {
        const offset = 80; // height of navbar
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 80);
  };

  const menuItems = [
    { label: 'Home', target: 'hero' },
    { label: 'Projects', target: 'projects' },
    { label: 'Gallery', target: 'gallery' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <>
      <motion.nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'py-4 bg-opacity-80 backdrop-blur-md shadow-sm' 
            : 'py-6 bg-transparent'
        } ${
          isDarkMode 
            ? scrolled ? 'bg-[#050505]/95 text-white border-b border-neutral-900' : 'text-white'
            : scrolled ? 'bg-white/95 text-neutral-950 border-b border-neutral-200' : 'text-neutral-950'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative">
          
          {/* Logo / Name representing Editorial Aesthetic */}
          <div 
            id="nav-logo"
            onClick={() => handleNavClick('hero')} 
            className="group flex items-baseline gap-2 cursor-pointer select-none"
          >
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase font-sans">
              ADNAN
            </span>
            <span className="w-2 h-2 bg-current rounded-full inline-block animate-pulse"></span>
          </div>

          {/* Desktop Navigation Links */}
          <div id="desktop-menu" className="hidden md:flex items-center gap-10">
            <div className="flex gap-8 items-center text-[11px] font-bold uppercase tracking-[0.3em] font-sans">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  id={`btn-nav-${item.target}`}
                  onClick={() => handleNavClick(item.target)}
                  className={`relative pb-1 cursor-pointer transition-all duration-300 ${
                    currentView === 'portfolio'
                      ? isDarkMode 
                        ? 'text-white/60 hover:text-white border-b border-transparent hover:border-white/30' 
                        : 'text-neutral-600 hover:text-black border-b border-transparent hover:border-black/30'
                      : isDarkMode
                        ? 'text-white/45 hover:text-white/80'
                        : 'text-neutral-550 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Game Mode Selector Accent Link */}
              <button
                id="btn-nav-play-game"
                onClick={() => onViewChange('game')}
                className={`flex items-center gap-1.5 pb-1 relative transition-all duration-300 cursor-pointer ${
                  currentView === 'game'
                    ? 'text-emerald-500 border-b border-emerald-500'
                    : isDarkMode
                      ? 'text-white/60 hover:text-emerald-400 border-b border-transparent hover:border-emerald-500/30'
                      : 'text-neutral-600 hover:text-emerald-600 border-b border-transparent hover:border-emerald-500/30'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-current animate-pulse-slow" />
                <span>Play Game</span>
              </button>
            </div>
          </div>

          {/* Actions, Theme Switcher & Panel Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle Switcher Button */}
            <button
              id="navbar-btn-theme-toggle"
              onClick={onThemeToggle}
              title={isDarkMode ? "Switch to White Mode" : "Switch to Dark Mode"}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isDarkMode 
                  ? 'border-white/10 hover:bg-white/5 hover:border-white text-white' 
                  : 'border-neutral-900/10 hover:bg-black/5 hover:border-black text-neutral-950'
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-600 group-hover:text-black" />
              )}
            </button>

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  CMS
                </span>
                <button
                  id="navbar-btn-dashboard"
                  onClick={onAdminClick}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border border-current bg-transparent text-current hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-sm cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  id="navbar-btn-logout"
                  onClick={onLogout}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full text-rose-500 hover:bg-rose-500/10 transition-colors border border-rose-500/20 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                id="navbar-btn-admin-login"
                onClick={onAdminClick}
                className={`flex items-center gap-1.5 px-4.5 py-1.5 border rounded-full text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-white/20 bg-white/5 text-white hover:bg-white hover:text-black' 
                    : 'border-neutral-900/30 bg-[#0a0a0a]/5 text-neutral-950 hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-current" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              id="navbar-btn-menu-mobile"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Horizontal scroll progress indicator at the absolute bottom of the navbar container */}
        <div id="scroll-progress-container" className="absolute bottom-0 left-0 w-full h-[3px] bg-neutral-200/10 dark:bg-neutral-800/10 overflow-hidden">
          <div 
            id="scroll-progress-bar"
            style={{ width: `${scrollPercent}%` }}
            className={`h-full transition-all duration-75 select-none ${
              isDarkMode ? 'bg-white' : 'bg-black'
            }`}
          />
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-dropdown"
            className="fixed inset-x-0 top-[70px] z-35 bg-white dark:bg-[#0c0c0c] border-b border-neutral-200 dark:border-neutral-900 shadow-xl py-6 px-10 md:hidden flex flex-col gap-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                id={`btn-mobile-nav-${item.target}`}
                onClick={() => handleNavClick(item.target)}
                className="text-left py-2 text-base font-medium text-neutral-850 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Play Game Button */}
            <button
              id="btn-mobile-nav-game"
              onClick={() => {
                setMobileMenuOpen(false);
                onViewChange('game');
              }}
              className="flex items-center gap-2 py-3 px-4 rounded-xl font-semibold bg-emerald-500/10 text-xs text-emerald-500 border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Sami Speedster Arcade</span>
            </button>
            
            {/* Mobile Theme Toggle Button */}
            <button
              id="btn-mobile-theme-toggle"
              onClick={() => {
                setMobileMenuOpen(false);
                onThemeToggle();
              }}
              className="flex items-center gap-2 py-3 px-4 rounded-xl font-semibold bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-neutral-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
              <span>{isDarkMode ? "Light Theme" : "Dark Theme"}</span>
            </button>

            {!isAdminLoggedIn && (
              <button
                id="btn-mobile-admin-login"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="flex items-center gap-2 py-3 px-4 rounded-xl font-semibold bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

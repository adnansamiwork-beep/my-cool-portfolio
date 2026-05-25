import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { ProfileInfo } from '../types';
import Magnetic from './Magnetic';

interface HeroSectionProps {
  profile: ProfileInfo;
  onContactClick: () => void;
  isDarkMode: boolean;
}

export default function HeroSection({ profile, onContactClick, isDarkMode }: HeroSectionProps) {
  const particles = Array.from({ length: 12 });

  const headingClass = isDarkMode ? 'text-white' : 'text-neutral-950';
  const textGradColor = isDarkMode ? 'from-white via-white/80 to-white/40' : 'from-neutral-950 via-neutral-900/80 to-neutral-800/40';
  const bioClass = isDarkMode ? 'text-neutral-400' : 'text-neutral-600';
  const frameBgClass = isDarkMode ? 'bg-neutral-900 border-white/10' : 'bg-neutral-50 border-black/10';
  const badgeClass = isDarkMode ? 'bg-black border-white text-white' : 'bg-white border-black text-black';
  const greetingTextClass = isDarkMode ? 'text-neutral-400' : 'text-neutral-500';
  const greetingLineClass = isDarkMode ? 'bg-neutral-700' : 'bg-neutral-300';

  const verticalGuideStyle = {
    writingMode: 'vertical-rl' as const,
    transform: 'rotate(180deg)',
  };

  return (
    <section 
      id="hero" 
      className={`relative min-h-[calc(100vh-4rem)] py-24 md:py-32 flex items-center justify-center overflow-hidden border-b transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#050505] text-white border-neutral-900' 
          : 'bg-white text-neutral-950 border-neutral-200'
      }`}
    >
      {/* Editorial Gridlines & Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}></div>
        
        {/* Particle objects */}
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full transition-colors duration-500 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -80 - 20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Dynamic editorial guide-lines in the background */}
        <svg className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isDarkMode ? 'opacity-10 dark:opacity-20 text-white' : 'opacity-10 text-black'}`} xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="12%" y1="0" x2="12%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="88%" y1="0" x2="88%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
        </svg>

        {/* Vertical decorative lettering */}
        <div 
          className={`hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 font-mono uppercase tracking-[0.5em] text-[10px] whitespace-nowrap transition-colors duration-500 ${greetingTextClass}`} 
          style={verticalGuideStyle}
        >
          PRECISION &bull; STRATEGY &bull; INNOVATION
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Editorial Styled Photo Frame */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative">
            <div 
              className={`w-72 h-88 md:w-80 md:h-[390px] border p-3 transform -rotate-2 hover:rotate-0 transition-all duration-500 shadow-xl ${frameBgClass}`}
            >
              <div className="w-full h-full bg-[#111] overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-10 pointer-events-none" />
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            {/* Top-Rated Developer/Law badge */}
            <div 
              className={`absolute -bottom-6 -right-6 w-32 h-32 border rounded-full flex flex-col items-center justify-center text-[9px] font-black uppercase tracking-tighter leading-tight text-center p-3 transform rotate-12 shadow-lg select-none transition-colors duration-300 ${badgeClass}`}
            >
              Top Rated<br/>Developer
            </div>
            <div className={`absolute top-0 right-0 w-2.5 h-2.5 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
            <div className={`absolute bottom-0 left-0 w-2.5 h-2.5 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
          </div>
        </div>

        {/* Right Side: Bold Typography & Outlined badged badges */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center items-center lg:items-start select-none">
          
          {/* Greeting label */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className={`h-[1px] w-12 ${greetingLineClass}`}></div>
              <span className={`text-[11px] font-mono uppercase tracking-widest ${greetingTextClass}`}>Sami Signature Portfolio</span>
            </div>
          </div>

          {/* Heading Name Bold Poppins Styled */}
          <motion.h1 
            className={`text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-[0.9] mb-6 relative transition-colors duration-500 ${headingClass}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {profile.name.split(' ')[0]}<br/>
            <span 
              className={`text-transparent bg-clip-text bg-gradient-to-r ${textGradColor}`}
            >
              {profile.name.split(' ').slice(1).join(' ') || 'SAMI'}
            </span>
          </motion.h1>

          {/* Badges/Tags container */}
          <motion.div 
            className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {profile.badges.map((badge, idx) => {
              const isFirst = idx === 0;
              return (
                <span 
                  key={badge}
                  className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase border transition-all duration-300 ${
                    isFirst 
                      ? isDarkMode 
                          ? 'bg-white border-white text-black font-extrabold shadow-sm' 
                          : 'bg-black border-black text-white font-extrabold shadow-sm'
                      : isDarkMode
                          ? 'bg-white/5 border-white/10 text-white hover:border-white/30'
                          : 'bg-black/5 border-black/10 text-black hover:border-black/30'
                  }`}
                >
                  {badge}
                </span>
              );
            })}
          </motion.div>

          {/* Description Bio text */}
          <motion.p 
            className={`text-base md:text-[17px] leading-relaxed font-light max-w-md mb-10 text-center lg:text-left transition-colors duration-500 ${bioClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {profile.bio}
          </motion.p>

          {/* Call to Actions with Magnetic Attractions */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Magnetic id="primary-cta-magnetic">
              <button
                id="hero-btn-contact-me"
                onClick={onContactClick}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 border font-extrabold uppercase tracking-widest text-[10px] transition-all duration-300 cursor-pointer shadow-lg ${
                  isDarkMode 
                    ? 'border-transparent bg-white text-black hover:bg-neutral-900 hover:text-white hover:border-white/20' 
                    : 'border-transparent bg-black text-white hover:bg-neutral-100 hover:text-black hover:border-black/20'
                }`}
              >
                <Mail className="w-3.5 h-3.5 ml-[-4px]" />
                <span>Contact Me</span>
              </button>
            </Magnetic>

            {/* Resume / Details button */}
            <Magnetic id="secondary-cta-magnetic">
              <button
                id="hero-btn-portfolio-gallery"
                onClick={() => {
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent font-bold uppercase tracking-widest text-[10px] border transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'text-white border-white/25 hover:border-white' 
                    : 'text-black border-black/25 hover:border-black'
                }`}
              >
                <span>View My Work</span>
                <span className="text-xs">↓</span>
              </button>
            </Magnetic>
          </motion.div>

        </div>
      </div>

      {/* Elegant scroll anchor indicator */}
      <div className="absolute bottom-6 right-10 flex flex-col gap-4 items-center">
        <div className="w-3 h-3 border border-current opacity-60 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-ping"></div>
        </div>
        <div className="w-0.5 h-16 bg-gradient-to-b from-current to-transparent mx-auto opacity-40"></div>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-6 h-6 border border-neutral-950/10 dark:border-white/10 rounded-full flex items-center justify-center pointer-events-none">
        <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
      </div>

    </section>
  );
}

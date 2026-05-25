import { motion } from 'motion/react';
import { Mail, GraduationCap, Landmark, Award, ArrowUpRight, Briefcase } from 'lucide-react';
import { ProfileInfo } from '../types';
import Magnetic from './Magnetic';

interface HeroSectionProps {
  profile: ProfileInfo;
  onContactClick: () => void;
  scrollProgress?: number;
}

export default function HeroSection({ profile, onContactClick, scrollProgress = 0 }: HeroSectionProps) {
  // Let's create an array of floating particles to render in the background
  const particles = Array.from({ length: 12 });

  // Dynamic color calculations based on scrollProgress
  const bgR = Math.round(250 - (250 - 5) * scrollProgress);
  const bgG = Math.round(250 - (250 - 5) * scrollProgress);
  const bgB = Math.round(250 - (250 - 5) * scrollProgress);
  const sectionBgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Headings/Name text color: transition from charcoal (#0a0a0a) to white (#ffffff)
  const textVal = Math.round(10 + (255 - 10) * scrollProgress);
  const headingTextColor = `rgb(${textVal}, ${textVal}, ${textVal})`;

  // Bio text color: transitioning from #4b5563 (neutral-600) to rgba(255, 255, 255, 0.6)
  const bioR = Math.round(75 + (255 - 75) * scrollProgress);
  const bioG = Math.round(85 + (255 - 85) * scrollProgress);
  const bioB = Math.round(99 + (255 - 99) * scrollProgress);
  const bioOpacity = 1 - 0.4 * scrollProgress;
  const bioTextColor = `rgba(${bioR}, ${bioG}, ${bioB}, ${bioOpacity})`;

  // Photo frame bg: transitions from pure white (#ffffff) to near black (#0d0d0d)
  const frameBgR = Math.round(255 - (255 - 13) * scrollProgress);
  const frameBgG = Math.round(255 - (255 - 13) * scrollProgress);
  const frameBgB = Math.round(255 - (255 - 13) * scrollProgress);
  const photoFrameBg = `rgb(${frameBgR}, ${frameBgG}, ${frameBgB})`;

  // photo frame border: from rgba(10, 10, 10, 0.15) to rgba(255, 255, 255, 0.12)
  const borderOpacity = 0.15 - 0.03 * scrollProgress;
  const borderVal = Math.round(10 + 245 * scrollProgress);
  const photoFrameBorder = `rgba(${borderVal}, ${borderVal}, ${borderVal}, ${borderOpacity})`;

  // badge items border: from solid bg-neutral-900/5 to bg-white/5
  const badgeBorderVal = Math.round(10 + 245 * scrollProgress);
  const badgeBorderColor = `rgba(${badgeBorderVal}, ${badgeBorderVal}, ${badgeBorderVal}, ${0.15 - 0.05 * scrollProgress})`;
  const badgeTextColor = `rgba(${Math.round(31 + 224 * scrollProgress)}, ${Math.round(41 + 214 * scrollProgress)}, ${Math.round(55 + 200 * scrollProgress)}, ${0.8 + 0.2 * scrollProgress})`;

  // vertical guide text color
  const guideR = Math.round(163 + 92 * scrollProgress);
  const guideOpacity = 1 - 0.8 * scrollProgress; // fade text down
  const verticalGuideStyle = {
    color: `rgba(${guideR}, ${guideR}, ${guideR}, ${guideOpacity})`,
    writingMode: 'vertical-rl' as const,
    transform: 'rotate(180deg)',
  };

  // decorative corner shapes
  const dotCornerColor = `rgb(${Math.round(10 + 245 * scrollProgress)}, ${Math.round(10 + 245 * scrollProgress)}, ${Math.round(10 + 245 * scrollProgress)})`;

  return (
    <section 
      id="hero" 
      style={{ backgroundColor: sectionBgColor }}
      className="relative min-h-screen py-24 md:py-32 flex items-center justify-center overflow-hidden border-b border-neutral-900/10 dark:border-white/5"
    >
      {/* Editorial Gridlines & Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Particle objects styled as minimal grey cells */}
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-neutral-500/10 dark:bg-white/10"
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

        {/* Dynamic editorial guide-lines inside the background */}
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="12%" y1="0" x2="12%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="88%" y1="0" x2="88%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
        </svg>

        {/* Vertical decorative lettering from Editorial concept */}
        <div 
          className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 font-mono uppercase tracking-[0.5em] text-[9px] whitespace-nowrap" 
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
              style={{ backgroundColor: photoFrameBg, borderColor: photoFrameBorder }}
              className="w-72 h-88 md:w-80 md:h-[390px] border p-3 transform -rotate-2 hover:rotate-0 transition-all duration-500 shadow-xl"
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
              style={{ backgroundColor: sectionBgColor }}
              className="absolute -bottom-6 -right-6 w-32 h-32 border border-current rounded-full flex flex-col items-center justify-center text-current text-[9px] font-black uppercase tracking-tighter leading-tight text-center p-3 transform rotate-12 shadow-lg select-none"
            >
              Top Rated<br/>Developer
            </div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-current"></div>
            <div 
              style={{ backgroundColor: dotCornerColor }}
              className="absolute bottom-0 left-0 w-2.5 h-2.5"
            ></div>
          </div>
        </div>

        {/* Right Side: Bold Typography & Outlined badged badges */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center items-center lg:items-start select-none">
          
          {/* Greeting label */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="h-[1px] w-12 bg-neutral-400 dark:bg-neutral-600"></div>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Sami Signature Portfolio</span>
            </div>
          </div>

          {/* Heading Name Bold Poppins Styled */}
          <motion.h1 
            style={{ color: headingTextColor }}
            className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-[0.9] mb-6 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {profile.name.split(' ')[0]}<br/>
            <span 
              style={{
                backgroundImage: `linear-gradient(to right, ${headingTextColor}, rgba(${textVal}, ${textVal}, ${textVal}, 0.35))`
              }}
              className="text-transparent bg-clip-text"
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
                  style={isFirst ? undefined : { backgroundColor: `rgba(${badgeBorderVal}, ${badgeBorderVal}, ${badgeBorderVal}, 0.05)`, borderColor: badgeBorderColor, color: badgeTextColor }}
                  className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase border ${
                    isFirst 
                      ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-sm font-extrabold' 
                      : ''
                  }`}
                >
                  {badge}
                </span>
              );
            })}
          </motion.div>

          {/* Description Bio text */}
          <motion.p 
            style={{ color: bioTextColor }}
            className="text-base md:text-[17px] leading-relaxed font-light max-w-md mb-10 text-center lg:text-left"
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
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 border border-transparent bg-neutral-950 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 font-extrabold uppercase tracking-widest text-[10px] transition-colors duration-300 cursor-pointer shadow-lg"
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
                style={{ color: headingTextColor, borderColor: `rgba(${textVal}, ${textVal}, ${textVal}, 0.2)` }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent font-bold uppercase tracking-widest text-[10px] border hover:border-current hover:text-current transition-colors cursor-pointer"
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

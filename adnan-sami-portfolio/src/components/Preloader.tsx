import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

const WELCOME_WORDS = [
  "Welcome",         // English
  "স্বাগতম",          // Bengali
  "Bienvenue",       // French
  "Bienvenido",      // Spanish
  "ようこそ",         // Japanese
  "Willkommen",      // German
  "أهلاً وسهلاً",     // Arabic
  "Välkommen",       // Swedish
  "स्वागत है",         // Hindi
  "Adnan Sami"       // Name Final
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index < WELCOME_WORDS.length - 1) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 160); // fast-paced word sequence
      return () => clearTimeout(timer);
    } else {
      // Stay on the name for a sub-second, then fade out
      const completeTimer = setTimeout(() => {
        setVisible(false);
        // Let the fade transition finish before triggers callback
        setTimeout(onComplete, 800);
      }, 900);
      return () => clearTimeout(completeTimer);
    }
  }, [index, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="preloader-container"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] text-white overflow-hidden"
          initial={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ 
            opacity: 0, 
            backdropFilter: "blur(0px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Subtle moving ambient light in the preloader bg */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] animate-pulse" />

          <div className="relative text-center select-none">
            {/* Word change motion */}
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-sans tracking-tight font-light flex flex-col items-center gap-2"
            >
              <span className="text-white/40 text-[10px] font-mono tracking-[0.4em] uppercase mb-1 flex items-center gap-2 justify-center">
                PORTFOLIO INGRESS <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              </span>
              <span className="font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-white/60 bg-clip-text text-transparent">
                {WELCOME_WORDS[index]}
              </span>
            </motion.div>

            {/* Micro loading line indicator */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-48 h-[1px] bg-neutral-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (index + 1) / WELCOME_WORDS.length }}
                transition={{ duration: 0.16 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

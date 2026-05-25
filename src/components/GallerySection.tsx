import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Award } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
  isDarkMode: boolean;
}

export default function GallerySection({ gallery, isDarkMode }: GallerySectionProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section 
      id="gallery" 
      className={`relative py-28 md:py-36 border-t overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#0c0c0c] text-white border-neutral-900' 
          : 'bg-white text-neutral-950 border-neutral-200'
      }`}
    >
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.01)_0%,transparent_60%)] opacity-100' : 'bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.02)_0%,transparent_60%)]'}`} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Gallery Headers */}
        <div className="max-w-xl mb-16 select-none">
          <div className="flex items-center gap-3 mb-3">
            <span className={`w-2 h-2 rounded-full inline-block ${isDarkMode ? 'bg-white' : 'bg-black'}`}></span>
            <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block">
              Moments & Triumphs
            </span>
          </div>
          <h2 className={`text-3xl md:text-5xl font-sans font-black tracking-tighter uppercase leading-[0.95] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-neutral-950'}`}>
            Milestone Log &<br/>
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? 'from-white via-white/85 to-white/40' : 'from-neutral-950 via-neutral-900 to-neutral-400'}`}>Visual Archives</span>
          </h2>
          <p className={`font-light mt-5 text-sm leading-relaxed max-w-lg transition-colors ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            A visual retrospective highlighting academic excellence, business venture milestones, and advocacy development.
          </p>
        </div>

        {/* Mosaic Bento-style Grid with Editorial frames */}
        <div id="gallery-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item, index) => {
            // Irregular bento layout
            const heightClass = index % 3 === 0 ? "h-80 lg:col-span-2" : "h-80";
            
            return (
              <motion.div
                key={item.id}
                id={`gallery-item-${item.id}`}
                onClick={() => setSelectedItem(item)}
                className={`group relative overflow-hidden rounded-none p-2.5 cursor-pointer transition-all duration-350 ${heightClass} ${
                  isDarkMode 
                    ? 'bg-[#0a0a0a] border-white/5 hover:border-white' 
                    : 'bg-neutral-50 border-black/5 hover:border-black'
                }`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className={`w-full h-full relative overflow-hidden border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                  {/* Backdrop image */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103 filter grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-95 select-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient cover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

                  {/* Maximizer Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-none bg-black/80 flex items-center justify-center text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Badge Category */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 text-[8px] font-mono tracking-widest font-bold uppercase bg-black text-white border border-white/20">
                      {item.category}
                    </span>
                  </div>

                  {/* Details absolute layout */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col pointer-events-none">
                    <h3 className="text-base font-bold text-white uppercase tracking-tight leading-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-300 font-light truncate max-w-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              id="gallery-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            >
              <div 
                className={`relative max-w-4xl w-full flex flex-col md:flex-row rounded-none border p-2 overflow-hidden shadow-2xl transition-colors duration-500 ${
                  isDarkMode ? 'bg-[#080808] border-white/15' : 'bg-white border-black/15'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  id="lightbox-btn-close"
                  onClick={() => setSelectedItem(null)}
                  className={`absolute top-4 right-4 w-8 h-8 rounded-none flex items-center justify-center border transition-colors z-10 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-black hover:bg-neutral-900 text-white border-white/20' 
                      : 'bg-white hover:bg-neutral-100 text-black border-black/20'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Left: Beautiful Large Picture */}
                <div className={`md:w-3/5 h-80 md:h-[500px] border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right: Picture Details */}
                <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                  <span className={`text-[9px] uppercase font-mono tracking-[0.4em] mb-3 block ${isDarkMode ? 'text-white/55' : 'text-neutral-500'}`}>
                    {selectedItem.category} Milestones
                  </span>
                  <h3 className={`text-xl md:text-2xl font-bold uppercase tracking-tight mb-4 leading-tight transition-colors ${
                    isDarkMode ? 'text-white' : 'text-neutral-950'
                  }`}>
                    {selectedItem.title}
                  </h3>
                  <p className={`text-sm font-light leading-relaxed mb-6 transition-colors ${
                    isDarkMode ? 'text-[#b5b5b5]' : 'text-neutral-600'
                  }`}>
                    {selectedItem.description}
                  </p>

                  {/* Stamp detail */}
                  <div className={`pt-6 border-t flex items-center gap-3 transition-colors ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center border transition-colors ${
                      isDarkMode ? 'bg-neutral-950 text-white border-white/10' : 'bg-neutral-100 text-black border-black/10'
                    }`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold block uppercase tracking-wider transition-colors ${isDarkMode ? 'text-white' : 'text-neutral-950'}`}>Adnan Sami Archive</span>
                      <span className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase">Verified Entry Ref</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

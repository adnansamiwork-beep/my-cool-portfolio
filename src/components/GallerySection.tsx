import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Award, MapPin, Calendar, Heart } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section 
      id="gallery" 
      className="relative py-28 md:py-36 bg-[#0c0c0c] text-white border-t border-neutral-900 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.01)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Gallery Headers */}
        <div className="max-w-xl mb-16 select-none">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 bg-white rounded-full inline-block"></span>
            <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block">
              Moments & Triumphs
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tighter text-white uppercase leading-[0.95]">
            Milestone Log &<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/85 to-white/40">Visual Archives</span>
          </h2>
          <p className="text-neutral-400 font-light mt-5 text-sm leading-relaxed max-w-lg">
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
                className={`group relative overflow-hidden rounded-none bg-[#0a0a0a] border border-white/5 p-2.5 cursor-pointer hover:border-white transition-all duration-350 ${heightClass}`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="w-full h-full relative overflow-hidden border border-white/5">
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
                    <p className="text-[11px] text-neutral-400 font-light truncate max-w-sm">
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
                className="relative max-w-4xl w-full flex flex-col md:flex-row bg-[#080808] rounded-none border border-white/15 p-2 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  id="lightbox-btn-close"
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-none bg-black hover:bg-neutral-900 text-white flex items-center justify-center border border-white/20 transition-colors z-10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Left: Beautiful Large Picture */}
                <div className="md:w-3/5 h-80 md:h-[500px] border border-white/5">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right: Picture Details */}
                <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                  <span className="text-[9px] uppercase font-mono tracking-[0.4em] text-white/55 mb-3 block">
                    {selectedItem.category} Milestones
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white mb-4 leading-tight">
                    {selectedItem.title}
                  </h3>
                  <p className="text-sm text-[#b5b5b5] font-light leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  {/* Stamp detail */}
                  <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-neutral-950 flex items-center justify-center text-white border border-white/10">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block uppercase tracking-wider">Adnan Sami Archive</span>
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

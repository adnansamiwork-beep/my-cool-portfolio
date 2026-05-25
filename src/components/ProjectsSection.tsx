import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Layers, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import Magnetic from './Magnetic';

interface ProjectsSectionProps {
  projects: Project[];
  isDarkMode: boolean;
}

type FilterCategory = 'All' | 'Major' | 'Side Quest';

export default function ProjectsSection({ projects, isDarkMode }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const filteredProjects = projects.filter(proj => {
    if (activeFilter === 'All') return true;
    return proj.category === activeFilter;
  });

  return (
    <section 
      id="projects" 
      className={`relative py-28 md:py-36 border-t overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#050505] text-white border-white/5' 
          : 'bg-[#fafafa] text-neutral-950 border-black/5'
      }`}
    >
      {/* Editorial Gridlines & Accents */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-500 ${isDarkMode ? 'opacity-10 text-white' : 'opacity-15 text-black'}`}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="1,6" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header content with sleek tracking */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 border-b pb-10 transition-colors duration-500 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-2 h-2 rounded-full inline-block ${isDarkMode ? 'bg-white' : 'bg-black'}`}></span>
              <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block">
                Selected Showcase
              </span>
            </div>
            <h2 className={`text-3xl md:text-5xl font-sans font-black tracking-tighter uppercase leading-[0.95] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-neutral-950'}`}>
              Major Ventures &<br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? 'from-white via-white/75 to-white/40' : 'from-neutral-950 via-neutral-900 to-neutral-400'}`}>Strategic Works</span>
            </h2>
          </div>

          {/* Filtering tabs */}
          <div className={`flex p-1.5 rounded-none border select-none transition-colors duration-500 ${isDarkMode ? 'bg-neutral-950 border-white/15' : 'bg-white border-black/15'}`}>
            {(['All', 'Major', 'Side Quest'] as FilterCategory[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-5 py-2 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  activeFilter === filter 
                    ? isDarkMode ? 'text-black z-10' : 'text-white z-10' 
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
                }`}
              >
                <span className="relative z-10">{filter === 'All' ? 'All Works' : filter}</span>
                {activeFilter === filter && (
                  <motion.div 
                    layoutId="activeFilterBg"
                    className={`absolute inset-0 ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Project Grid */}
        <motion.div 
          id="project-grid"
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                id={`project-card-${project.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4 }}
                className={`group flex flex-col h-full rounded-none border p-3 transition-all duration-500 relative ${
                  isDarkMode 
                    ? 'bg-[#0d0d0d] border-white/5 hover:border-white' 
                    : 'bg-white border-black/5 hover:border-black'
                }`}
              >
                {/* Corner detail dots */}
                <div className={`absolute top-0 right-0 w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>

                {/* Image Section */}
                <div className={`relative h-56 w-full overflow-hidden p-1 mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'bg-neutral-950 border-white/5' : 'bg-neutral-100 border-black/5'
                }`}>
                  <div className="w-full h-full overflow-hidden relative">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100 filter grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  </div>
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${
                      project.category === 'Major' 
                        ? isDarkMode 
                          ? 'bg-white text-black font-black' 
                          : 'bg-black text-white font-black'
                        : isDarkMode
                          ? 'bg-neutral-900 text-neutral-300 border border-white/10' 
                          : 'bg-neutral-200 text-neutral-700 border border-black/10'
                    }`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Date badge on top right */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-white bg-black/90 px-2 py-0.5 border border-white/15">
                      {project.date}
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="flex flex-col flex-1 px-2 pb-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border ${
                          isDarkMode 
                            ? 'text-neutral-400 bg-neutral-900 border-white/5' 
                            : 'text-neutral-500 bg-neutral-100 border-black/5'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-[18px] font-bold tracking-tight uppercase leading-snug mb-3 transition-colors font-sans ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {project.title}
                  </h3>
                  
                  <p className={`text-sm font-light leading-relaxed mb-6 flex-1 transition-colors ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    {project.description}
                  </p>

                  {/* External CTA element with magnetic option */}
                  <div className={`mt-auto pt-4 border-t flex items-center justify-between transition-colors ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                    {project.link ? (
                      <Magnetic strength={0.4}>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest transition-colors cursor-pointer ${
                            isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
                          }`}
                        >
                          <span>Explore Project</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Magnetic>
                    ) : (
                      <span className="text-[9px] uppercase font-mono text-neutral-500">Self-Contained Brief</span>
                    )}

                    <div className={`w-7 h-7 rounded-none border flex items-center justify-center transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-white/10 text-neutral-400 group-hover:border-white group-hover:text-white' 
                        : 'border-black/10 text-neutral-600 group-hover:border-black group-hover:text-black'
                    }`}>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state safeguard */}
        {filteredProjects.length === 0 && (
          <div className={`text-center py-24 rounded-2xl border ${
            isDarkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <Layers className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No items found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle, Info } from 'lucide-react';
import { ProfileInfo } from '../types';
import Magnetic from './Magnetic';

interface ContactSectionProps {
  profile: ProfileInfo;
  isDarkMode: boolean;
}

export default function ContactSection({ profile, isDarkMode }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let valid = true;
    const tempErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      tempErrors.name = 'Please provide your name.';
      valid = false;
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'Please provide an email.';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email format.';
      valid = false;
    }
    if (!formData.message.trim()) {
      tempErrors.message = 'Please type a quick message.';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate submission delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Auto-dismiss success after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className={`relative py-28 md:py-36 border-t overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#040404] text-white border-neutral-900' 
          : 'bg-[#fafafa] text-neutral-950 border-neutral-200'
      }`}
    >
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none transition-colors duration-500 ${
        isDarkMode ? 'bg-white/5' : 'bg-black/5'
      }`} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left column: Contact Info card */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3 select-none">
              <span className={`w-2 h-2 rounded-full inline-block ${isDarkMode ? 'bg-white' : 'bg-black'}`}></span>
              <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase block">
                Get In Touch
              </span>
            </div>
            <h2 className={`text-3xl md:text-5xl font-sans font-black tracking-tighter uppercase leading-[0.95] mb-6 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-neutral-950'
            }`}>
              Let's Discuss<br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode ? 'from-white to-white/40' : 'from-neutral-950 to-neutral-500'
              }`}>New Ventures</span>
            </h2>
            <p className={`font-light text-sm leading-relaxed mb-10 max-w-sm transition-colors ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Have a legal enquiry or looking to strategize an investment venture? Drop a message, and let's coordinate action.
            </p>
          </div>

          <div className="space-y-4">
            {/* Email card */}
            <div className={`flex items-center gap-4 p-4 rounded-none border transition-colors ${
              isDarkMode 
                ? 'bg-[#0a0a0a] border-white/5 hover:border-white/35' 
                : 'bg-white border-black/5 hover:border-black/35'
            }`}>
              <div className={`w-10 h-10 rounded-none flex items-center justify-center border transition-colors ${
                isDarkMode ? 'bg-neutral-950 text-white border-white/10' : 'bg-neutral-50 text-black border-black/10'
              }`}>
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono font-bold block animate-pulse">Email Ingress</span>
                <a href={`mailto:${profile.email}`} className={`text-sm font-bold transition-colors ${
                  isDarkMode ? 'text-neutral-250 hover:text-white' : 'text-neutral-750 hover:text-black'
                }`}>
                  {profile.email}
                </a>
              </div>
            </div>

            {/* Phone card */}
            <div className={`flex items-center gap-4 p-4 rounded-none border transition-colors ${
              isDarkMode 
                ? 'bg-[#0a0a0a] border-white/5 hover:border-white/35' 
                : 'bg-white border-black/5 hover:border-black/35'
            }`}>
              <div className={`w-10 h-10 rounded-none flex items-center justify-center border transition-colors ${
                isDarkMode ? 'bg-neutral-950 text-white border-white/10' : 'bg-neutral-50 text-black border-black/10'
              }`}>
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">Phone/Direct</span>
                <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-neutral-200' : 'text-neutral-700'}`}>
                  {profile.phone}
                </span>
              </div>
            </div>

            {/* Location card */}
            <div className={`flex items-center gap-4 p-4 rounded-none border transition-colors ${
              isDarkMode 
                ? 'bg-[#0a0a0a] border-white/5 hover:border-white/35' 
                : 'bg-white border-black/5 hover:border-black/35'
            }`}>
              <div className={`w-10 h-10 rounded-none flex items-center justify-center border transition-colors ${
                isDarkMode ? 'bg-neutral-950 text-white border-white/10' : 'bg-neutral-50 text-black border-black/10'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">HQ Location</span>
                <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-neutral-200' : 'text-neutral-700'}`}>
                  {profile.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form featuring Editorial details */}
        <div id="contact-form-container" className="lg:col-span-7">
          <div className={`relative p-8 md:p-12 rounded-none border overflow-hidden shadow-2xl transition-colors duration-500 ${
            isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/10'
          }`}>
            {/* Corner absolute geometric markers */}
            <div className={`absolute top-0 right-0 w-2 h-2 ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
            <div className={`absolute bottom-0 left-0 w-2 h-2 ${isDarkMode ? 'bg-white' : 'bg-black'}`} />

            {isSuccess ? (
              <motion.div 
                className="flex flex-col items-center justify-center text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={`w-16 h-16 rounded-none flex items-center justify-center border mb-6 font-semibold transition-colors ${
                  isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-500/20'
                }`}>
                  <CheckCircle className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-neutral-950'}`}>Message Dispatched!</h3>
                <p className={`text-sm max-w-xs leading-relaxed mb-6 transition-colors ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Thank you for connecting with Sami. Your information is delivered and prioritized.
                </p>
                <button
                  id="contact-btn-restart"
                  onClick={() => setIsSuccess(false)}
                  className={`px-6 py-3 rounded-none border text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer ${
                    isDarkMode 
                      ? 'border-white/15 text-white hover:bg-white hover:text-black' 
                      : 'border-black/15 text-black hover:bg-black hover:text-white'
                  }`}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Form header */}
                <h3 className={`text-base font-bold uppercase tracking-widest leading-tight transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-neutral-950'
                }`}>
                  Briefing / Inquiry Form
                </h3>

                {/* Name field */}
                <div id="field-name-container" className="group relative flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">
                    Client/Associate Name
                  </label>
                  <div className="relative col-span-12">
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Samuel Bennett" 
                      className={`w-full px-4 py-3.5 rounded-none border text-sm focus:outline-none focus:ring-0 transition-colors ${
                        isDarkMode 
                          ? 'bg-[#050505] border-white/10 text-white placeholder-neutral-700 focus:border-white' 
                          : 'bg-neutral-50 border-black/10 text-black placeholder-neutral-400 focus:border-black'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-xs text-rose-500 italic flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email field */}
                <div id="field-email-container" className="group relative flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">
                    Direct Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. samuel@firm.com" 
                      className={`w-full px-4 py-3.5 rounded-none border text-sm focus:outline-none focus:ring-0 transition-colors ${
                        isDarkMode 
                          ? 'bg-[#050505] border-white/10 text-white placeholder-neutral-700 focus:border-white' 
                          : 'bg-neutral-50 border-black/10 text-black placeholder-neutral-400 focus:border-black'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-xs text-rose-500 italic flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Message field */}
                <div id="field-message-container" className="group relative flex flex-col gap-2">
                  <label htmlFor="message" className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">
                    Strategic Inquiry Details
                  </label>
                  <div className="relative">
                    <textarea 
                      id="message"
                      name="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Discuss moot briefing, venture pitch or tutoring consulting details..." 
                      className={`w-full px-4 py-3.5 rounded-none border text-sm focus:outline-none focus:ring-0 transition-colors resize-none ${
                        isDarkMode 
                          ? 'bg-[#050505] border-white/10 text-white placeholder-neutral-700 focus:border-white' 
                          : 'bg-neutral-50 border-black/10 text-black placeholder-neutral-400 focus:border-black'
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <span className="text-xs text-rose-500 italic flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Action button */}
                <div className="pt-4 flex justify-end">
                  <Magnetic strength={0.25}>
                    <button
                      id="contact-btn-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className={`group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-none border transition-colors duration-300 cursor-pointer shadow-lg disabled:opacity-50 font-extrabold uppercase tracking-widest text-[10px] ${
                        isDarkMode 
                          ? 'bg-white text-black hover:bg-[#050505] hover:border-white hover:text-white border-transparent' 
                          : 'bg-black text-white hover:bg-[#fafafa] hover:border-black hover:text-black border-transparent'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${isDarkMode ? 'border-black' : 'border-white'}`} />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>{isSubmitting ? 'TRANSMITTING...' : 'DISPATCH LETTER'}</span>
                    </button>
                  </Magnetic>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

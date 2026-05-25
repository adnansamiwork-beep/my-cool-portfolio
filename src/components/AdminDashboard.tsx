import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Settings, BarChart3, Edit, Trash2, Plus, 
  LogIn, LogOut, Check, X, Sparkles, FolderGit2, Image, KeyRound, Globe, Zap 
} from 'lucide-react';
import { PortfolioData, AnalyticsData, Project, GalleryItem } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: PortfolioData;
  onUpdatePortfolio: (data: PortfolioData) => void;
  analyticsData: AnalyticsData;
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  portfolioData,
  onUpdatePortfolio,
  analyticsData,
  isAdminLoggedIn,
  onLoginSuccess
}: AdminDashboardProps) {

  // Auth States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab States
  const [activeTab, setActiveTab] = useState<'analytics' | 'profile' | 'projects' | 'gallery' | 'security'>('analytics');

  // Edit / Input States
  const [profileForm, setProfileForm] = useState({ ...portfolioData.profile });
  const [badgeInput, setBadgeInput] = useState('');

  // Sync internal form state with updated database profile info when admin dashboard opens or profile shifts
  React.useEffect(() => {
    if (isOpen) {
      setProfileForm({ ...portfolioData.profile });
    }
  }, [isOpen, portfolioData.profile]);

  // Password rotation state
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Project Creation State
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Major',
    tags: [],
    link: '',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600&h=400',
    date: '2026-05'
  });
  const [projectTagInput, setProjectTagInput] = useState('');

  // Gallery Creation State
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800&h=600',
    category: 'Achievement'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('sami_admin_pass') || 'adn123@@';
    if (username === 'adnansami' && password === storedPassword) {
      setAuthError('');
      onLoginSuccess();
    } else {
      setAuthError('Invalid credentials. Please enter your authorized username and password.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePortfolio({
      ...portfolioData,
      profile: { ...profileForm }
    });
    triggerSuccess('Profile data saved successfully!');
  };

  const handleAddBadge = () => {
    if (badgeInput.trim() && !profileForm.badges.includes(badgeInput.trim())) {
      setProfileForm(prev => ({
        ...prev,
        badges: [...prev.badges, badgeInput.trim()]
      }));
      setBadgeInput('');
    }
  };

  const handleRemoveBadge = (badgeToRemove: string) => {
    setProfileForm(prev => ({
      ...prev,
      badges: prev.badges.filter(b => b !== badgeToRemove)
    }));
  };

  // CRUD: Projects
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) return;
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: projectForm.title,
      description: projectForm.description,
      category: projectForm.category as 'Major' | 'Side Quest',
      tags: projectForm.tags || [],
      link: projectForm.link || undefined,
      image: projectForm.image || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600&h=400',
      date: projectForm.date || '2026-05'
    };

    onUpdatePortfolio({
      ...portfolioData,
      projects: [newProject, ...portfolioData.projects]
    });

    // Reset project state
    setProjectForm({
      title: '',
      description: '',
      category: 'Major',
      tags: [],
      link: '',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600&h=400',
      date: '2026-05'
    });
    setShowAddProject(false);
    triggerSuccess('New work/quest cataloged!');
  };

  const handleAddProjectTag = () => {
    if (projectTagInput.trim() && !(projectForm.tags || []).includes(projectTagInput.trim())) {
      setProjectForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), projectTagInput.trim()]
      }));
      setProjectTagInput('');
    }
  };

  const handleRemoveProjectTag = (tagToRemove: string) => {
    setProjectForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      onUpdatePortfolio({
        ...portfolioData,
        projects: portfolioData.projects.filter(p => p.id !== id)
      });
      triggerSuccess('Project erased successfully.');
    }
  };

  // CRUD: Gallery
  const handleAddGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.description) return;

    const newGal: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: galleryForm.title,
      description: galleryForm.description,
      image: galleryForm.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800&h=600',
      category: galleryForm.category as 'Achievement' | 'Moment' | 'Academic'
    };

    onUpdatePortfolio({
      ...portfolioData,
      gallery: [newGal, ...portfolioData.gallery]
    });

    setGalleryForm({
      title: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800&h=600',
      category: 'Achievement'
    });
    setShowAddGallery(false);
    triggerSuccess('New gallery milestone preserved!');
  };

  const handleDeleteGallery = (id: string) => {
    if (window.confirm("Remove item from milestone gallery log?")) {
      onUpdatePortfolio({
        ...portfolioData,
        gallery: portfolioData.gallery.filter(g => g.id !== id)
      });
      triggerSuccess('Milestone removed.');
    }
  };

  // Security Credentials Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('sami_admin_pass') || 'adn123@@';
    if (currentPassInput !== storedPassword) {
      setErrorMsg('Current password does not match system logs.');
      setSuccessMsg('');
      return;
    }
    if (newPassInput.length < 5) {
      setErrorMsg('New password must have at least 5 character tokens.');
      setSuccessMsg('');
      return;
    }

    localStorage.setItem('sami_admin_pass', newPassInput);
    setCurrentPassInput('');
    setNewPassInput('');
    setErrorMsg('');
    triggerSuccess('Credentials updated successfully. Security hardened!');
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (!isOpen) return null;

  return (
    <div id="admin-panel-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div 
        id="admin-dashboard-container"
        className="relative w-full max-w-5xl h-[85vh] bg-[#0c0c0c] text-white border border-white/10 rounded-none overflow-hidden flex flex-col shadow-2xl"
      >
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#070707]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-white text-black flex items-center justify-center font-black text-sm uppercase">
              AS
            </div>
            <div>
              <span className="text-sm font-bold block text-white uppercase tracking-tight">Adnan Sami Legacy</span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500">CMS Control Station</span>
            </div>
          </div>
          <button 
            id="admin-panel-btn-close"
            onClick={onClose} 
            className="w-8 h-8 rounded-none bg-black hover:bg-neutral-900 text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Barrier Screen */}
        {!isAdminLoggedIn ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_70%)]">
            <form onSubmit={handleLogin} className="w-full max-w-md p-8 md:p-12 rounded-3xl bg-neutral-950 border border-neutral-900 shadow-2xl flex flex-col gap-6">
              
              <div className="text-center">
                <ShieldAlert className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold">Admin Credentials Ingress</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Protect and maintain your presentation database. Login using standard secure tokens.
                </p>
              </div>

              {authError && (
                <div className="p-3 text-xs text-rose-400 rounded-xl bg-rose-500/10 border border-rose-500/20 leading-relaxed text-center">
                  {authError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold">Username token</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white placeholder-neutral-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold">Access Password</label>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white placeholder-neutral-700"
                />
              </div>

              <button
                id="btn-perform-admin-login"
                type="submit"
                className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-sm transition-transform cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Verify Credential Logs</span>
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Content Dashboard */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Sticky Tabs */}
            <div className="w-64 border-r border-neutral-900 bg-neutral-950 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                {[
                  { id: 'analytics', label: 'Dashboard Hub', icon: <BarChart3 className="w-4 h-4" /> },
                  { id: 'profile', label: 'Profile Bio Details', icon: <Sparkles className="w-4 h-4" /> },
                  { id: 'projects', label: 'Works & Quests', icon: <FolderGit2 className="w-4 h-4" /> },
                  { id: 'gallery', label: 'Milestone Gallery', icon: <Image className="w-4 h-4" /> },
                  { id: 'security', label: 'Identity Hardening', icon: <KeyRound className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSuccessMsg('');
                      setErrorMsg('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-white text-black font-bold' 
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Status information at the bottom of panel */}
              <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-900 space-y-1">
                <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-550 block font-semibold">Integrity Metrics</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Standard State Persisted
                </span>
              </div>
            </div>

            {/* Editable Screen body */}
            <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-[#0d0d0d]">
              
              {/* Context Feedback messages */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold mb-6 flex items-center gap-2.5 text-xs animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold mb-6 flex items-center gap-2.5 text-xs">
                  <X className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SECTION: Hub Analytics */}
              {activeTab === 'analytics' && (
                <div id="analytics-panel" className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">Analytics Metrics</h3>
                    <p className="text-xs text-neutral-500 mt-1">Live monitoring counts of viewer entry points and hosting conditions.</p>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* View counts */}
                    <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block mb-1">Lifetime Views</span>
                        <span className="text-3xl font-extrabold">{analyticsData.views}</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                        <BarChart3 className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>

                    {/* Speed indicator */}
                    <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block mb-1">Server Page Speed</span>
                        <span className="text-3xl font-extrabold text-[#52525b]">{analyticsData.loadingSpeed}ms</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                        <Zap className="w-5 h-5 text-emerald-450" />
                      </div>
                    </div>

                    {/* Status check */}
                    <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-900 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] block mb-1">Connection State</span>
                        <span className="text-3xl font-extrabold text-emerald-450">99.9%</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <Globe className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* HTML/SVG Column Traffic Chart */}
                  <div className="p-8 rounded-[2.5rem] bg-neutral-950 border border-neutral-900">
                    <h4 className="text-sm font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#a1a1aa]" />
                      <span>Traffic Velocity Log (This Week)</span>
                    </h4>
                    
                    {/* SVG/HTML Bar Charts */}
                    <div className="flex h-56 items-end justify-between gap-4 pt-4 px-2">
                      {analyticsData.viewsByDay.map((d) => {
                        const maxVal = Math.max(...analyticsData.viewsByDay.map(v => v.count));
                        const pctHeight = (d.count / maxVal) * 80; // keep headroom
                        return (
                          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-[10px] text-neutral-500 font-mono tracking-tighter">{d.count}</span>
                            {/* Animated column scale */}
                            <div className="w-full max-w-[28px] bg-neutral-900 rounded-t-lg h-36 relative overflow-hidden flex items-end border border-neutral-850">
                              <motion.div 
                                className="w-full bg-white rounded-t-sm"
                                initial={{ height: 0 }}
                                animate={{ height: `${pctHeight}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-neutral-400">{d.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="p-8 rounded-[2.5rem] bg-neutral-950 border border-neutral-900">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 mb-4 block">International Audience Origins</span>
                    <div className="space-y-4">
                      {analyticsData.visitorCountries.map((v) => (
                        <div key={v.country} className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-neutral-200">{v.country}</span>
                            <span className="font-mono text-neutral-400">{v.count} hits</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-white"
                              initial={{ width: 0 }}
                              animate={{ width: `${(v.count / 852) * 100}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Profile CMS */}
              {activeTab === 'profile' && (
                <div id="profile-panel" className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">Edit Profile Core</h3>
                    <p className="text-xs text-neutral-500 mt-1">Change visual headings, bio info and profile avatar parameters.</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl bg-neutral-950 p-8 rounded-[2.5rem] border border-neutral-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Full Public Name</label>
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Avatar Image URL</label>
                        <input 
                          type="text" 
                          value={profileForm.avatar}
                          onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Bio Description</label>
                      <textarea 
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Contact Email</label>
                        <input 
                          type="email" 
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Phone</label>
                        <input 
                          type="text" 
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">HQ/Office Location</label>
                        <input 
                          type="text" 
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                        />
                      </div>
                    </div>

                    {/* Manage Badges */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-neutral-900">
                      <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Manage Badges & Accreditations</label>
                      
                      <div className="flex flex-wrap gap-2">
                        {profileForm.badges.map((b) => (
                          <div key={b} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d0d0d] border border-neutral-850 text-xs text-neutral-300">
                            <span>{b}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveBadge(b)} 
                              className="text-neutral-500 hover:text-white cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-md">
                        <input 
                          type="text" 
                          value={badgeInput}
                          onChange={(e) => setBadgeInput(e.target.value)}
                          placeholder="e.g. Master Consultant"
                          className="flex-1 px-4 py-2 rounded-xl bg-[#0d0d0d] border border-neutral-850 text-xs focus:outline-none focus:border-white transition-all text-white"
                        />
                        <button 
                          type="button" 
                          onClick={handleAddBadge}
                          className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs cursor-pointer"
                        >
                          Add Badge
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        type="submit" 
                        className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs cursor-pointer flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Preserve Profile Changes</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* SECTION: Works Control (Projects) */}
              {activeTab === 'projects' && (
                <div id="projects-panel" className="space-y-8 animate-fadeIn">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold font-sans">Works & Side Quests Portfolio</h3>
                      <p className="text-xs text-neutral-500 mt-1">Catalog major contracts, investment decks, and case brief websites.</p>
                    </div>
                    <button
                      id="btn-trigger-add-project"
                      onClick={() => setShowAddProject(!showAddProject)}
                      className="px-4 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      {showAddProject ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{showAddProject ? 'Cancel Forms' : 'Add New Project'}</span>
                    </button>
                  </div>

                  {/* Add project form */}
                  {showAddProject && (
                    <form onSubmit={handleAddProjectSubmit} className="space-y-6 bg-neutral-950 p-8 rounded-[2.5rem] border border-neutral-800 animate-fadeIn">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Create New Catalog Record</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Project Title</label>
                          <input 
                            type="text" 
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="e.g. Sami Corporate Law Guide"
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Category Classification</label>
                          <select 
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as 'Major' | 'Side Quest' })}
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          >
                            <option value="Major">Major Work</option>
                            <option value="Side Quest">Side Quest / Interest</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Presentation Description</label>
                        <textarea 
                          rows={3}
                          required
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          placeholder="Provide structural briefs highlighting achievements, legal scopes, business outcomes..."
                          className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">External Links (Optional)</label>
                          <input 
                            type="text" 
                            value={projectForm.link}
                            onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Cover Display URL</label>
                          <input 
                            type="text" 
                            value={projectForm.image}
                            onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Archival Logging Date</label>
                          <input 
                            type="text" 
                            value={projectForm.date}
                            onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          />
                        </div>
                      </div>

                      {/* project tags */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">Project Attributes / Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {(projectForm.tags || []).map((t) => (
                            <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0d0d0d] border border-neutral-850 text-[10px]">
                              <span>{t}</span>
                              <button type="button" onClick={() => handleRemoveProjectTag(t)} className="text-neutral-500 hover:text-white cursor-pointer">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 max-w-sm">
                          <input 
                            type="text" 
                            value={projectTagInput}
                            onChange={(e) => setProjectTagInput(e.target.value)}
                            placeholder="Add legal/business term tag"
                            className="flex-1 px-3 py-1.5 bg-[#0d0d0d] border border-neutral-850 rounded-lg text-xs"
                          />
                          <button 
                            type="button" 
                            onClick={handleAddProjectTag}
                            className="px-3 rounded bg-white text-black font-semibold text-xs cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => setShowAddProject(false)}
                          className="px-4 py-2.5 rounded-xl text-neutral-400 text-xs hover:bg-neutral-900 transition-colors cursor-pointer"
                        >
                          Discard
                        </button>
                        <button 
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Publish Catalog Entry</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Existing Projects Table/Card List */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-550 uppercase block font-semibold">Active Records ({portfolioData.projects.length})</span>
                    <div className="grid grid-cols-1 gap-4">
                      {portfolioData.projects.map((proj) => (
                        <div 
                          key={proj.id} 
                          className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-800 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg bg-neutral-900 overflow-hidden border border-neutral-850 flex-shrink-0">
                              <img src={proj.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-neutral-900 text-neutral-400 border border-neutral-800">
                                  {proj.category}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 font-light truncate max-w-sm md:max-w-xl mt-1">{proj.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-neutral-900 pt-3 md:pt-0">
                            <button
                              id={`btn-delete-project-${proj.id}`}
                              onClick={() => handleDeleteProject(proj.id)}
                              className="px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors border border-rose-500/10 hover:border-rose-500/20 text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Erase Record</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Milestone Gallery */}
              {activeTab === 'gallery' && (
                <div id="gallery-cms-panel" className="space-y-8 animate-fadeIn">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold font-sans">Milestone Gallery Log</h3>
                      <p className="text-xs text-neutral-500 mt-1">Update media assets documenting moot finals and entrepreneur releases.</p>
                    </div>
                    <button
                      id="btn-trigger-add-gallery"
                      onClick={() => setShowAddGallery(!showAddGallery)}
                      className="px-4 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      {showAddGallery ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{showAddGallery ? 'Cancel forms' : 'Add Gallery Item'}</span>
                    </button>
                  </div>

                  {/* Add gallery item form */}
                  {showAddGallery && (
                    <form onSubmit={handleAddGallerySubmit} className="space-y-6 bg-neutral-950 p-8 rounded-[2.5rem] border border-neutral-800 animate-fadeIn">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Capture Milestone Data</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Milestone Heading</label>
                          <input 
                            type="text" 
                            required
                            value={galleryForm.title}
                            onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                            placeholder="e.g. Moot advocacy Champion"
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Classification</label>
                          <select 
                            value={galleryForm.category}
                            onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as 'Achievement' | 'Moment' | 'Academic' })}
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          >
                            <option value="Achievement">Achievement Award</option>
                            <option value="Moment">Enterprise Moment</option>
                            <option value="Academic">Academic Standard</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Milestone Narrative (Description)</label>
                          <input 
                            type="text" 
                            required
                            value={galleryForm.description}
                            onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                            placeholder="Briefly review key performance highlights..."
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Milestone Media Cover Link</label>
                          <input 
                            type="text" 
                            value={galleryForm.image}
                            onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                            className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => setShowAddGallery(false)}
                          className="px-4 py-2.5 rounded-xl text-neutral-400 text-xs hover:bg-neutral-900 transition-colors cursor-pointer"
                        >
                          Discard
                        </button>
                        <button 
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Commit Milestone</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List existing */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-550 uppercase block font-semibold">Active Milestone Archives ({portfolioData.gallery.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {portfolioData.gallery.map((g) => (
                        <div key={g.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-900 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
                              <img src={g.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-tighter">{g.category}</span>
                              <h4 className="text-xs font-bold text-neutral-200 truncate">{g.title}</h4>
                            </div>
                          </div>
                          <button
                            id={`btn-delete-gallery-${g.id}`}
                            onClick={() => handleDeleteGallery(g.id)}
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer border border-rose-500/5 hover:border-rose-500/20 transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SECTION: Identity Security rotation */}
              {activeTab === 'security' && (
                <div id="security-panel" className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold font-sans">Identity Hardening Logs</h3>
                    <p className="text-xs text-neutral-500 mt-1">Rotate administrative pass tokens to maintain CMS integrity standards.</p>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md bg-neutral-950 p-8 rounded-[2.5rem] border border-neutral-900">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Current Administrative Password</label>
                      <input 
                        type="password" 
                        required
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="••••••••"
                        className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white placeholder-neutral-700"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">New Administrative Password</label>
                      <input 
                        type="password" 
                        required
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Enter 5+ strong tokens"
                        className="px-4 py-3 rounded-xl bg-[#0d0d0d] border border-neutral-800 text-sm focus:outline-none focus:border-white transition-all text-white placeholder-neutral-700"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Harden Credential Logs</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

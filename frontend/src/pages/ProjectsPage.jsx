import { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapIcon, 
  ListBulletIcon,
  BriefcaseIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import api from '../api/axios';
import ProjectCard from '../components/projects/ProjectCard';
import Loader from '../components/common/Loader';
import { CATEGORIES } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [categories] = useState(['All', ...CATEGORIES]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const filteredProjects = projects.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 text-center md:text-left">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <GlobeAltIcon className="w-3 h-3" /> Global Marketplace
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                    Corporate <span className="text-primary-600">Projects</span>
                 </h1>
                 <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg font-medium">
                    Bridge the gap between campus and corporate. High-stakes contracts assigned based on merit badges and skill certification.
                 </p>
              </div>
              
              <div className="hidden lg:flex items-center gap-12 text-center">
                 <div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{projects.length}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Open Roles</p>
                 </div>
                 <div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">₹50K+</p>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Avg Budget</p>
                 </div>
              </div>
           </div>
        </header>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-12 flex flex-col lg:flex-row items-center gap-6">
           <div className="relative flex-1 w-full lg:w-auto">
              <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by role, stack, or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400"
              />
           </div>
           
           <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                     selectedCategory === cat 
                       ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                       : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                   }`}
                 >
                    {cat}
                 </button>
              ))}
           </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-32"><Loader size="lg" /></div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-32 flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <BriefcaseIcon className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No active contracts found</h3>
             <p className="text-gray-500 mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredProjects.map((project, idx) => (
                <motion.div 
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                   <ProjectCard project={project} />
                </motion.div>
             ))}
          </div>
        )}

        {/* Footer Note */}
        <footer className="mt-24 p-12 bg-gradient-to-br from-gray-900 to-black rounded-[3rem] text-white overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <GlobeAltIcon className="w-full h-full text-white/50 blur-3xl scale-110" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                 <h2 className="text-3xl font-black mb-2">Build Your Corporate Identity</h2>
                 <p className="text-gray-400 max-w-md">Earn merit badges in the Learning Hub to gain priority and get shortlisted for high-value corporate contracts.</p>
              </div>
              <button className="px-10 py-5 bg-white text-gray-900 font-black rounded-3xl text-sm uppercase tracking-widest hover:bg-primary-50 transition active:scale-95 shadow-xl">
                 Earn Merit Badges →
              </button>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default ProjectsPage;

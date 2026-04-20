import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Code2, Mic, BookOpen, Trophy, Zap,
  Maximize2, Minimize2,
  Target, BarChart3, GraduationCap, Rocket, Shield,
  ArrowRight, Sparkles, Clock, CheckCircle2
} from 'lucide-react';

const MODULES = [
  { id: 'home',      label: 'Dashboard',       icon: BarChart3,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30' },
  { id: 'crt',       label: 'CRT Practice',    icon: BrainCircuit, color: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30' },
  { id: 'technical', label: 'Technical Quiz',  icon: Code2,        color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  { id: 'interview', label: 'Interview Prep',  icon: Mic,          color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/30' },
  { id: 'history',   label: 'Quiz History',    icon: Trophy,       color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  { id: 'notes',     label: 'Study Notes',     icon: BookOpen,     color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
];

const STATS = [
  { value: '1,200+', label: 'Practice Questions', icon: Target },
  { value: '18+',    label: 'Topics Covered',      icon: BookOpen },
  { value: '6',      label: 'Training Modules',    icon: GraduationCap },
  { value: '100%',   label: 'Free to Use',         icon: Shield },
];

export default function PlacementPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [activeModule, setActiveModule] = useState('home');
  const [fullscreen,   setFullscreen]   = useState(false);
  const [showIntro,    setShowIntro]    = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem('placement_intro_seen');
    if (seen) setShowIntro(false);
  }, []);

  const handleLaunch = () => {
    sessionStorage.setItem('placement_intro_seen', '1');
    setShowIntro(false);
  };

  const activeInfo = MODULES.find(m => m.id === activeModule);

  // ── INTRO SCREEN ──────────────────────────────────────────────────────────
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(6,182,212,0.12) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(244,63,94,0.06) 0%, transparent 60%)`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 mb-8"
          >
            <Zap className="w-3 h-3" />
            C2C × Placement Academy
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight"
          >
            Master 
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 bg-clip-text text-transparent"> Placements.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The comprehensive training portal for Campus-to-Corporate success.
            Practice CRT, Technical Quizzes, and Mock Interviews with native C2C data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto"
          >
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleLaunch}
              className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-black rounded-2xl text-lg shadow-2xl shadow-violet-500/30 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3 justify-center"
            >
              <Rocket className="w-5 h-5" />
              Enter Placement Zone
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-5 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              Back to Marketplace
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── CONTENT RENDERER ───────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeModule) {
      case 'home':
        return (
          <div className="p-8 max-w-6xl mx-auto space-y-12">
            <header>
              <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Performance Dashboard</h2>
              <p className="text-gray-500">Track your progress across all training modules</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Overall Progress', value: '45%', icon: Target, color: 'text-cyan-400' },
                { label: 'Quizzes Completed', value: '12', icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Avg Score', value: '88%', icon: Trophy, color: 'text-amber-400' },
              ].map((s) => (
                <div key={s.label} className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
                   <s.icon className={`w-8 h-8 ${s.color} mb-4`} />
                   <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
                   <p className="text-3xl font-black text-white mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <section>
              <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider">Active Learning Tracks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODULES.filter(m => m.id !== 'home').map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${m.bg} ${m.color}`}>
                        <m.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black text-white">{m.label}</p>
                        <p className="text-xs text-gray-500">Ready for development</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12">
            <div className={`w-24 h-24 rounded-3xl ${activeInfo.bg} ${activeInfo.color} flex items-center justify-center mb-8`}>
              <activeInfo.icon className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
              {activeInfo.label} <span className="text-cyan-500">Module</span>
            </h2>
            <div className="max-w-md bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <Sparkles className="w-6 h-6 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium mb-6 leading-relaxed">
                This module is ready for your specific data and logic integration. 
                Keep the UI shell and plug in your CRT, Technical, or Interview components here.
              </p>
              <div className="flex items-center justify-center gap-2 py-3 px-6 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-black uppercase tracking-widest">
                <Clock className="w-4 h-4" />
                Under Development
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-[100] bg-gray-950' : 'min-h-screen bg-gray-950'}`}>

      {/* ── TOP CONTROL BAR ── */}
      <div className="flex-shrink-0 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex-shrink-0">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-white uppercase tracking-widest hidden sm:block">Placement Zone</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto flex-1 scrollbar-hide">
          {MODULES.map(mod => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0
                  ${isActive
                    ? `${mod.bg} ${mod.color} border ${mod.border} shadow-sm`
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:block">{mod.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition"
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── BOTTOM STATUS BAR ── */}
      {!fullscreen && (
        <div className="flex-shrink-0 bg-gray-900/60 border-t border-gray-800/50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              C2C Native Module
            </div>
            {activeInfo && (
              <>
                <span>·</span>
                <span className={activeInfo.color}>{activeInfo.label}</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-gray-700">
            Internal Development Suite
          </div>
        </div>
      )}
    </div>
  );
}

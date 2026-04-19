import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Code2, Mic, BookOpen, Trophy, Zap,
  ExternalLink, Maximize2, Minimize2, RefreshCw,
  Target, Users, BarChart3, ChevronRight, Star,
  GraduationCap, Rocket, Shield
} from 'lucide-react';

const PLACEMENT_URL = 'https://placemint.ct.ws/?i=2';

const MODULES = [
  { id: 'home',      label: 'Dashboard',       icon: BarChart3,    page: '/?i=2',                color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30' },
  { id: 'crt',       label: 'CRT Practice',    icon: BrainCircuit, page: '/crt.html',             color: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30' },
  { id: 'technical', label: 'Technical Quiz',  icon: Code2,        page: '/technical_home.php',   color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  { id: 'interview', label: 'Interview Prep',  icon: Mic,          page: '/interview.html',       color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/30' },
  { id: 'history',   label: 'Quiz History',    icon: Trophy,       page: '/crt_history.php',      color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  { id: 'notes',     label: 'Study Notes',     icon: BookOpen,     page: '/technical_notes.html', color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
];

const STATS = [
  { value: '1,200+', label: 'Practice Questions', icon: Target },
  { value: '18+',    label: 'Topics Covered',      icon: BookOpen },
  { value: '6',      label: 'Training Modules',    icon: GraduationCap },
  { value: '100%',   label: 'Free to Use',         icon: Shield },
];

const BASE = 'https://placemint.ct.ws';

export default function PlacementPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const iframeRef = useRef(null);
  const [activeModule, setActiveModule] = useState('home');
  const [iframeSrc,    setIframeSrc]    = useState(PLACEMENT_URL);
  const [fullscreen,   setFullscreen]   = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [showIntro,    setShowIntro]    = useState(true);

  // auto-dismiss intro after 3s if user has visited before
  useEffect(() => {
    const seen = sessionStorage.getItem('placement_intro_seen');
    if (seen) setShowIntro(false);
  }, []);

  const handleLaunch = () => {
    sessionStorage.setItem('placement_intro_seen', '1');
    setShowIntro(false);
  };

  const switchModule = (mod) => {
    setActiveModule(mod.id);
    setLoading(true);
    setIframeSrc(`${BASE}${mod.page}`);
  };

  const refresh = () => {
    setLoading(true);
    // force reload by appending timestamp
    setIframeSrc(prev => {
      const base = prev.split('?')[0];
      const qs   = new URL(prev, 'http://x').searchParams;
      qs.set('_t', Date.now());
      return `${base}?${qs.toString()}`;
    });
  };

  const openExternal = () => window.open(iframeSrc, '_blank', 'noopener');

  const activeInfo = MODULES.find(m => m.id === activeModule);

  // ── INTRO SCREEN ──────────────────────────────────────────────────────────
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(6,182,212,0.12) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(244,63,94,0.06) 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-cyan-400 mb-8"
          >
            <Zap className="w-3 h-3" />
            C2C × Placement Prep
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight"
            style={{ fontFamily: "'Clash Display', 'Syne', sans-serif" }}
          >
            Get
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 bg-clip-text text-transparent"> Placed.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Your integrated placement preparation suite — CRT aptitude, technical quizzes, mock interviews, and study notes. All inside C2C.
          </motion.p>

          {/* Stats row */}
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

          {/* Module pills preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {MODULES.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.id} className={`flex items-center gap-2 px-4 py-2 ${m.bg} border ${m.border} rounded-full text-xs font-bold ${m.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {m.label}
                </div>
              );
            })}
          </motion.div>

          {/* CTA */}
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
              Launch Placement Zone
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-5 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              Back to C2C
            </button>
          </motion.div>

          {user && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-xs text-gray-600"
            >
              Signed in as <span className="text-gray-400 font-bold">{user.name}</span> · C2C member
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN EMBEDDED VIEW ────────────────────────────────────────────────────
  return (
    <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-[100] bg-gray-950' : 'min-h-screen bg-gray-950'}`}>

      {/* ── TOP CONTROL BAR ── */}
      <div className="flex-shrink-0 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">

        {/* Logo pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex-shrink-0">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-white uppercase tracking-widest hidden sm:block">Placement Zone</span>
        </div>

        {/* Module tabs — scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1 scrollbar-hide">
          {MODULES.map(mod => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => switchModule(mod)}
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

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={refresh}
            title="Refresh"
            className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openExternal}
            title="Open in new tab"
            className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition"
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── IFRAME AREA ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-gray-950 flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-[18px] border-2 border-cyan-500/30 animate-ping" />
              </div>

              {activeInfo && (
                <div className="text-center">
                  <p className={`text-xs font-black uppercase tracking-widest ${activeInfo.color} mb-1`}>Loading</p>
                  <p className="text-lg font-bold text-white">{activeInfo.label}</p>
                </div>
              )}

              <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              </div>

              <p className="text-xs text-gray-600">Powered by Placemint × C2C</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The iframe */}
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title="Placement Prep"
          className="w-full h-full border-0"
          style={{ minHeight: fullscreen ? '100vh' : 'calc(100vh - 112px)' }}
          onLoad={() => setLoading(false)}
          allow="microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        />
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      {!fullscreen && (
        <div className="flex-shrink-0 bg-gray-900/60 border-t border-gray-800/50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Connected to Placemint
            </div>
            {activeInfo && (
              <>
                <span>·</span>
                <span className={activeInfo.color}>{activeInfo.label}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-700">
            <span>C2C Academy</span>
            <span>×</span>
            <a
              href={PLACEMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition"
            >
              placemint.ct.ws
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

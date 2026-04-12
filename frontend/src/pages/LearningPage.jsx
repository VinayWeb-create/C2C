import { useState, useEffect } from 'react';
import { 
  AcademicCapIcon, 
  VideoCameraIcon, 
  DocumentTextIcon, 
  MapIcon, 
  CheckCircleIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  LightBulbIcon,
  BriefcaseIcon,
  LockClosedIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/helpers';
import { LEARNING_DATA } from '../data/learningResources';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LearningPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [activeTab, setActiveTab] = useState('roadmap'); 
  
  // Test State
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const data = LEARNING_DATA[selectedCategory] || { roadmap: [], youtube: [], notes: [], test: [], projects: [] };

  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: MapIcon },
    { id: 'youtube', label: 'Videos', icon: VideoCameraIcon },
    { id: 'notes',   label: 'Notes',  icon: DocumentTextIcon },
    { id: 'projects', label: 'Hands-on Projects', icon: BriefcaseIcon, protected: true },
    { id: 'test',     label: 'Skill Test',        icon: CheckCircleIcon, protected: true },
  ];

  const handleOptionSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const submitTest = async () => {
    if (Object.keys(answers).length < data.test.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    let correctCount = 0;
    data.test.forEach(q => {
      if (answers[q.id] === q.answer) correctCount++;
    });

    const score = (correctCount / data.test.length) * 100;
    setTestResult({ score, correct: correctCount, total: data.test.length });

    if (score === 100) {
      try {
        await api.put('/auth/add-badge', { 
          name: `Professional Provider (${selectedCategory})`,
          role: selectedCategory 
        });
        toast.success(`🎉 Congratulations! You earned the Professional Provider Badge for ${selectedCategory}!`);
      } catch (err) {
        console.error('Badge update failed');
      }
    }
    setSubmitting(false);
  };

  const hasBadge = user?.badges?.some(b => b.role === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Categories */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Categories</h2>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setTestResult(null);
                    setAnswers({});
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 translate-x-1' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900'
                  }`}
                >
                  <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-sm font-medium truncate">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <span className="text-4xl">{CATEGORY_ICONS[selectedCategory]}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white">{selectedCategory} Academy</h1>
                  <p className="text-gray-500 dark:text-gray-400">Master the skills needed for a professional freelancing career.</p>
                </div>
              </div>

              {hasBadge && (
                <div className="flex items-center gap-3 p-3 px-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl shadow-amber-600/20">
                  <TrophyIcon className="w-6 h-6 animate-bounce" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Credential Earned</p>
                    <p className="text-sm font-bold">Verified Professional</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mt-8 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Sections */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[400px]"
              >
                
                {/* Protected View Overlay */}
                {tabs.find(t => t.id === activeTab)?.protected && !user && (
                   <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                      <LockClosedIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login to Unlock</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-sm">
                      Hands-on projects and Skill Tests are exclusively for our community members. 
                      Sign in to start your professional journey.
                    </p>
                    <div className="flex gap-4">
                      <button onClick={() => navigate('/login')} className="btn-primary">Sign In</button>
                      <button onClick={() => navigate('/register')} className="btn-secondary">Join C2C Hub</button>
                    </div>
                   </div>
                )}

                {/* Roadmap Content */}
                {activeTab === 'roadmap' && (
                  <div className="space-y-6">
                    {data.roadmap.map((step, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold border-2 border-primary-500/20">
                            {idx + 1}
                          </div>
                          {idx !== data.roadmap.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 my-2" />
                          )}
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm group-hover:shadow-md transition-all flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* YouTube Content */}
                {activeTab === 'youtube' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.youtube.map((video) => (
                      <div key={video.id} className="card overflow-hidden group">
                        <div className="relative aspect-video">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={video.url.replace('embed/', 'watch?v=')} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/20 backdrop-blur rounded-full text-white">
                              <PlayIcon className="w-8 h-8 fill-current" />
                            </a>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{video.title}</h3>
                          <p className="text-xs text-gray-500">{video.channel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes Content */}
                {activeTab === 'notes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.notes.map((note) => (
                      <div key={note.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                           <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{note.title}</h3>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{note.size} • {note.type}</p>
                        </div>
                        <button className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition">
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Content (Protected) */}
                {activeTab === 'projects' && user && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.projects.map((project) => (
                      <div key={project.id} className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between mb-4">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                             project.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                             project.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                             'bg-red-100 text-red-700'
                           }`}>
                             {project.difficulty}
                           </span>
                           <BriefcaseIcon className="w-6 h-6 text-gray-300 group-hover:text-primary-500 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{project.desc}</p>
                        <button className="w-full py-3 rounded-xl border-2 border-primary-600 text-primary-600 font-bold hover:bg-primary-600 hover:text-white transition-all">
                          Start Project Experience
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Test Content (Protected) */}
                {activeTab === 'test' && user && (
                  <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
                    {testResult ? (
                      <div className="flex flex-col items-center py-10 text-center animate-in fade-in duration-500">
                        {testResult.score === 100 ? (
                           <>
                             <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-50 dark:ring-amber-900/20">
                               <TrophyIcon className="w-12 h-12 text-amber-600" />
                             </div>
                             <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Perfect Merit!</h3>
                             <p className="text-gray-500 mb-8 max-w-sm">You scored 100% and earned the <strong>Professional Badge</strong>. You can now register as a provider for {selectedCategory} projects.</p>
                             <button onClick={() => navigate('/register', { state: { role: 'provider' } })} className="btn-primary py-4 px-10 rounded-2xl">Register as Provider →</button>
                           </>
                        ) : (
                          <>
                             <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                               <LockClosedIcon className="w-12 h-12 text-rose-600" />
                             </div>
                             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Score: {testResult.score}%</h3>
                             <p className="text-gray-500 mb-8 max-w-sm">You need 100% merit to earn the badge. Review the notes and try again!</p>
                             <button onClick={() => setTestResult(null)} className="btn-secondary">Restart Assessment</button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-3 mb-8 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                          <LightBulbIcon className="w-6 h-6 text-amber-600" />
                          <p className="text-xs text-amber-800 dark:text-amber-200 sm:text-sm">Pass this merit test with <strong>100% score</strong> to unlock the Professional Provider Badge!</p>
                        </div>
                        
                        <div className="space-y-12">
                          {data.test.map((item, idx) => (
                            <div key={item.id}>
                              <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                <span className="text-primary-600 mr-2">{idx + 1}.</span>
                                {item.question}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {item.options.map(opt => (
                                  <button 
                                    key={opt} 
                                    onClick={() => handleOptionSelect(item.id, opt)}
                                    className={`w-full p-4 rounded-xl border text-left transition-all text-sm font-bold ${
                                      answers[item.id] === opt 
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-600' 
                                        : 'border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-500'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-12 flex justify-center">
                          <button 
                            onClick={submitTest}
                            disabled={submitting}
                            className="btn-primary px-12 py-4 rounded-2xl shadow-xl shadow-primary-600/20"
                          >
                            {submitting ? 'Evaluating...' : 'Submit Assessment'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Success Path Section */}
          <section className="mt-20 p-12 rounded-[3rem] bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 text-center">Your Merit Path to C2C Professional Hub</h2>
              <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                We don't just provide resources; we provide a career path. You must prove your skills to earn your badge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { title: 'Learn', icon: AcademicCapIcon, desc: 'Complete the roadmaps and watch the curated high-quality sessions.' },
                  { title: 'Achieve 100%', icon: TrophyIcon, desc: 'Score 100% in our skill assessments to earn your merit badge.' },
                  { title: 'Unlock Pro', icon: StarIcon, desc: 'Once badged, register as a provider and start applying for projects.' }
                ].map((step, idx) => {
                   const Icon = step.icon;
                   return (
                    <div key={idx} className="p-8 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10">
                      <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LearningPage;

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PaperAirplaneIcon, ArrowLeftIcon, 
  ShieldCheckIcon, BriefcaseIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const WorkroomPage = () => {
  const { id } = useParams(); // Project ID
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [project, setProject] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchWorkroom = async () => {
      try {
        const [pRes, mRes] = await Promise.all([
          api.get(`/projects`), // Get all and find this one for context
          api.get(`/messages/${id}`)
        ]);
        const currentProject = pRes.data.projects.find(p => p._id === id);
        setProject(currentProject);
        setMessages(mRes.data.messages);
      } catch (err) {
        toast.error('Unauthorized access to workroom');
        navigate('/dashboard/provider');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkroom();
    // In a real app, we would use WebSockets (Socket.io) here.
    const interval = setInterval(fetchWorkroom, 10000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const { data } = await api.post(`/messages/${id}`, { content });
      setMessages([...messages, { ...data.message, sender: user }]);
      setContent('');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-950"><Loader size="lg" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
               {project?.title} 
               <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-[10px] uppercase font-black">Workroom</span>
            </h1>
            <p className="text-xs text-gray-500">Secure Direct Access between {user.role === 'admin' ? 'Provider' : 'Administrator'}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
           <div className="text-right">
              <p className="text-xs font-black uppercase text-gray-400">Budget</p>
              <p className="text-sm font-bold text-emerald-600">₹{project?.budget}</p>
           </div>
           <ShieldCheckIcon className="w-8 h-8 text-primary-500 opacity-50" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-10">
             <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-600">
                <BriefcaseIcon className="w-8 h-8" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest text-gray-400">Project Started</p>
             <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 mt-2">Workspace initialized. Discussion is now encrypted and private.</h2>
          </div>

          {messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex gap-3 ${msg.sender._id === user._id ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                  {msg.sender.name[0]}
                </div>
                <div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender._id === user._id 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`text-[10px] mt-1 text-gray-400 font-medium ${msg.sender._id === user._id ? 'text-right' : 'text-left'}`}>
                    {msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Discuss project milestones, deliverables, or ask questions..."
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-3xl py-5 pl-8 pr-16 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all dark:text-white shadow-inner"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary-600 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkroomPage;

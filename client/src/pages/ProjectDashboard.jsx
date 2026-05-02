import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ManageMembers from '../components/ManageMembers';
import TaskBoard from '../components/TaskBoard';
import DashboardStats from '../components/DashboardStats';
import { toast } from 'react-hot-toast';

const ProjectDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, tasks, members
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error('Failed to fetch project', error);
        toast.error('Project not found or access denied');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 text-center px-4">
        <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl max-w-md">
           <h2 className="text-3xl font-extrabold text-white mb-3">Project Not Found</h2>
           <p className="text-slate-400 mb-8 leading-relaxed">You either don't have access or it doesn't exist.</p>
           <Link to="/dashboard" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-900/50">
             Return to Dashboard
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col md:flex-row text-slate-200 selection:bg-indigo-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col md:min-h-screen relative z-10">
        {/* Subtle top gradient glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="p-8 border-b border-slate-800/60 relative">
          <Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 text-sm font-medium flex items-center mb-8 transition-colors group">
            <div className="bg-slate-800 p-1.5 rounded-md mr-3 group-hover:bg-indigo-500/20 transition-colors">
               <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
            </div>
            All Projects
          </Link>
          <h2 className="text-2xl font-extrabold text-white truncate tracking-tight" title={project.name}>{project.name}</h2>
          <span className={`inline-flex items-center mt-4 text-xs font-bold px-3 py-1.5 rounded-full border ${project.userRole === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${project.userRole === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
            {project.userRole === 'admin' ? 'Admin Access' : 'Member Access'}
          </span>
        </div>
        
        <nav className="flex-1 p-5 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-semibold ${activeTab === 'overview' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'}`}
          >
            <svg className={`w-5 h-5 mr-3 ${activeTab === 'overview' ? 'text-indigo-400' : 'opacity-70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-semibold ${activeTab === 'tasks' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'}`}
          >
             <svg className={`w-5 h-5 mr-3 ${activeTab === 'tasks' ? 'text-indigo-400' : 'opacity-70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-semibold ${activeTab === 'members' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'}`}
          >
            <svg className={`w-5 h-5 mr-3 ${activeTab === 'members' ? 'text-indigo-400' : 'opacity-70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Members
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto relative">
        {/* Decorative background blur blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-10 tracking-tight">Project Overview</h3>
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-xl mb-12">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Description
                </h4>
                <p className="text-slate-300 text-lg leading-relaxed">{project.description || 'No description provided for this project.'}</p>
              </div>

              <DashboardStats projectId={project._id} />
            </div>
          )}

          {activeTab === 'tasks' && (
             <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TaskBoard projectId={project._id} userRole={project.userRole} />
             </div>
          )}

          {activeTab === 'members' && (
             <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <ManageMembers projectId={project._id} userRole={project.userRole} />
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDashboard;

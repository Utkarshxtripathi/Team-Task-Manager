import { useState, useEffect } from 'react';
import api from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const DashboardStats = ({ projectId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/dashboard`);
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [projectId]);

  if (loading) return <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div></div>;
  if (error) return <div className="text-red-400 py-6 text-center">{error}</div>;
  if (!stats) return null;

  const pieData = [
    { name: 'To Do', value: stats.todoTasks, color: '#94a3b8' }, // slate-400
    { name: 'In Progress', value: stats.inProgressTasks, color: '#60a5fa' }, // blue-400
    { name: 'Review', value: stats.reviewTasks, color: '#c084fc' }, // purple-400
    { name: 'Done', value: stats.doneTasks, color: '#34d399' }, // emerald-400
  ];

  const barData = [
    { name: 'Tasks', 'To Do': stats.todoTasks, 'In Progress': stats.inProgressTasks, 'Review': stats.reviewTasks, 'Done': stats.doneTasks }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-xl transition-transform hover:-translate-y-1">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Tasks</p>
          <h3 className="text-4xl font-extrabold text-white">{stats.totalTasks}</h3>
        </div>
        <div className="bg-blue-900/20 backdrop-blur-xl border border-blue-800/50 p-6 rounded-2xl shadow-xl transition-transform hover:-translate-y-1">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">In Progress</p>
          <h3 className="text-4xl font-extrabold text-white">{stats.inProgressTasks}</h3>
        </div>
        <div className="bg-emerald-900/20 backdrop-blur-xl border border-emerald-800/50 p-6 rounded-2xl shadow-xl transition-transform hover:-translate-y-1">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-2">Completed</p>
          <h3 className="text-4xl font-extrabold text-white">{stats.doneTasks}</h3>
        </div>
        <div className="bg-red-900/20 backdrop-blur-xl border border-red-800/50 p-6 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-red-400 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Overdue</p>
          <h3 className="text-4xl font-extrabold text-red-300 relative z-10">{stats.overdueTasks}</h3>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-xl flex flex-col h-[400px]">
          <h4 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
            Task Distribution
          </h4>
          <div className="flex-1 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData.filter(d => d.value > 0)}
                   cx="50%"
                   cy="50%"
                   innerRadius={80}
                   outerRadius={120}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {pieData.filter(d => d.value > 0).map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                   itemStyle={{ color: '#f8fafc' }}
                 />
               </PieChart>
             </ResponsiveContainer>
             {stats.totalTasks === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">No tasks yet</div>
             )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-xl flex flex-col h-[400px]">
          <h4 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>
            Pipeline Overview
          </h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Bar dataKey="To Do" stackId="a" fill="#94a3b8" radius={[0, 0, 4, 4]} />
                <Bar dataKey="In Progress" stackId="a" fill="#60a5fa" />
                <Bar dataKey="Review" stackId="a" fill="#c084fc" />
                <Bar dataKey="Done" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

import api from '../api/axios';

const TaskDetailsModal = ({ task, onClose, userRole, onDelete }) => {
  if (!task) return null;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-8">
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-start relative overflow-hidden">
          {/* Subtle header gradient */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <div className="pr-4 relative z-10">
             <h2 className="text-2xl lg:text-3xl font-extrabold text-white break-words leading-tight mb-2 tracking-tight">{task.title}</h2>
             <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
               <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  {task.created_by?.name || 'Unknown'}
               </span>
               <span className="w-1 h-1 rounded-full bg-slate-700"></span>
               <span>{new Date(task.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors p-2 rounded-xl relative z-10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Status</span>
                <span className={`inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border
                   ${task.status === 'todo' ? 'bg-slate-800 text-slate-300 border-slate-700' : ''}
                   ${task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                   ${task.status === 'review' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                   ${task.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                `}>
                  {task.status.replace('_', ' ')}
                </span>
             </div>
             <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Priority</span>
                <span className={`inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border
                    ${task.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                    ${task.priority === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                    ${task.priority === 'medium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                    ${task.priority === 'low' ? 'bg-slate-800 text-slate-400 border-slate-700' : ''}
                `}>
                  {task.priority}
                </span>
             </div>
             <div className={`p-5 rounded-2xl border ${isOverdue ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}>
                <span className={`block text-xs font-bold uppercase tracking-widest mb-3 ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>Due Date</span>
                <span className={`text-sm font-bold ${isOverdue ? 'text-red-400' : 'text-slate-300'}`}>
                  {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'No due date'}
                </span>
             </div>
          </div>

          <div className="mb-10">
            <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center">
               <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
               Description
            </h4>
            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800 min-h-[120px] text-slate-400 whitespace-pre-wrap leading-relaxed text-[15px]">
               {task.description || <span className="italic opacity-50">No description provided.</span>}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Assigned To
            </h4>
            <div className="flex items-center">
              {task.assigned_to ? (
                <div className="flex items-center bg-slate-800/50 pr-6 p-2 rounded-2xl border border-slate-700/50">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-lg mr-4">
                    {task.assigned_to.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-[15px]">{task.assigned_to.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{task.assigned_to.email}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-slate-500 italic bg-slate-800/50 px-5 py-3 rounded-xl border border-slate-700/50">
                  Unassigned
                </div>
              )}
            </div>
          </div>
        </div>
        
        {userRole === 'admin' && (
          <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/50 flex justify-end">
             <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm flex items-center gap-2"
             >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Delete Task
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;

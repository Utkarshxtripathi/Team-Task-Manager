import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const CreateTaskModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get(`/projects/${projectId}/members`)
        .then(res => setMembers(res.data))
        .catch(err => console.error('Failed to load members for task assignment'));
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        priority,
        status: 'todo'
      };
      if (dueDate) payload.due_date = dueDate;
      if (assignedTo) payload.assigned_to = assignedTo;

      await api.post(`/projects/${projectId}/tasks`, payload);
      
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setAssignedTo('');
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-8">
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight relative z-10">Create New Task</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors p-2 rounded-xl relative z-10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>{error}</div>}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Task Title <span className="text-indigo-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 bg-slate-950/50 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-600 font-medium"
                placeholder="What needs to be done?"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3 bg-slate-950/50 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-600 min-h-[120px] resize-y font-medium"
                placeholder="Add more details..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-950/50 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-950/50 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium style-color-scheme-dark"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-5 py-3 bg-slate-950/50 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.user_id._id} value={m.user_id._id}>
                    {m.user_id.name} ({m.user_id.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import { toast } from 'react-hot-toast';

const TaskBoard = ({ projectId, userRole }) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      toast.success('Task status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (assigneeFilter && task.assigned_to?._id !== assigneeFilter) return false;
    return true;
  });

  const assignees = Array.from(new Set(tasks.map(t => t.assigned_to?._id).filter(Boolean))).map(id => {
    return tasks.find(t => t.assigned_to?._id === id).assigned_to;
  });

  if (loading) return (
    <div className="py-12 flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">Task Board</h3>
        
        {userRole === 'admin' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 mb-8 flex flex-wrap gap-5 shadow-lg">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full text-sm bg-slate-800 border-slate-700 text-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full text-sm bg-slate-800 border-slate-700 text-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Assignee</label>
          <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="w-full text-sm bg-slate-800 border-slate-700 text-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
            <option value="">All Assignees</option>
            {assignees.map(a => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map(task => {
          const canEditStatus = userRole === 'admin' || (task.assigned_to && task.assigned_to._id === user.id);
          const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
          
          return (
            <div key={task._id} className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1 overflow-hidden flex flex-col group relative">
              {/* Subtle accent line */}
              <div className={`absolute top-0 inset-x-0 h-1 
                ${task.status === 'todo' ? 'bg-slate-600' : ''}
                ${task.status === 'in_progress' ? 'bg-blue-500' : ''}
                ${task.status === 'review' ? 'bg-purple-500' : ''}
                ${task.status === 'done' ? 'bg-emerald-500' : ''}
              `}></div>

              <div 
                className="p-6 flex-1 cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h4 className="font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                  <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider
                    ${task.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                    ${task.priority === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : ''}
                    ${task.priority === 'medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                    ${task.priority === 'low' ? 'bg-slate-800 text-slate-400 border border-slate-700' : ''}
                  `}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 min-h-[40px]">{task.description}</p>
                
                <div className="flex justify-between items-center text-sm mt-auto">
                  <div className="flex items-center text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {task.assigned_to ? task.assigned_to.name.split(' ')[0] : 'Unassigned'}
                  </div>
                  {task.due_date && (
                    <div className={`flex items-center font-medium ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
                      <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Card Footer (Status Updater) */}
              <div className="border-t border-slate-800 bg-slate-900/80 p-4 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Status</span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  disabled={!canEditStatus}
                  className={`text-sm font-bold rounded-xl py-2 pl-4 pr-10 appearance-none bg-[length:1.2em_1.2em] bg-[right_0.5rem_center]
                    ${task.status === 'done' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-200 bg-slate-800 border-slate-700'}
                    ${!canEditStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-500 transition-colors focus:ring-indigo-500'}
                  `}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed backdrop-blur-xl">
          <svg className="mx-auto h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400 text-lg font-medium">No tasks match your filters.</p>
        </div>
      )}

      {userRole === 'admin' && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          projectId={projectId}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchTasks();
            toast.success('Task created successfully');
          }}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          userRole={userRole}
          onDelete={() => {
             setSelectedTask(null);
             fetchTasks();
             toast.success('Task deleted');
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;

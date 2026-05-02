import { useState, useEffect } from 'react';
import api from '../api/axios';

const ManageMembers = ({ projectId, userRole }) => {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/members`);
      setMembers(response.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      await api.post(`/projects/${projectId}/members`, { email, role });
      setSuccessMsg('Member added successfully!');
      setEmail('');
      setRole('member');
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (uid) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/projects/${projectId}/members/${uid}`);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) return <div>Loading members...</div>;

  return (
    <div>
      <h3 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Manage Members</h3>
      
      {/* Add Member Form (Admins Only) */}
      {userRole === 'admin' && (
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-800 mb-10">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Invite New Member
          </h4>
          {error && <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm font-bold mb-6 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>{error}</div>}
          {successMsg && <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-sm font-bold mb-6 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{successMsg}</div>}
          
          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-5 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-950/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-600 font-medium"
                placeholder="colleague@example.com"
                required
              />
            </div>
            <div className="w-full sm:w-56">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-950/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium appearance-none bg-[length:1.2em_1.2em] bg-[right_0.5rem_center]"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
            >
              Add User
            </button>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-800/60">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
              <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
              {userRole === 'admin' && (
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {members.map((m) => (
              <tr key={m._id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-lg shadow-sm">
                      {m.user_id.name ? m.user_id.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="ml-5">
                      <div className="text-[15px] font-bold text-white">{m.user_id.name}</div>
                      <div className="text-sm text-slate-400 font-medium">{m.user_id.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1.5 inline-flex text-xs font-bold uppercase tracking-wider rounded-lg border ${m.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {m.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                </td>
                {userRole === 'admin' && (
                  <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveMember(m.user_id._id)}
                      className="text-red-400 hover:text-red-300 transition-all bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-xl font-bold flex items-center justify-end ml-auto gap-2"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-medium">No members found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageMembers;

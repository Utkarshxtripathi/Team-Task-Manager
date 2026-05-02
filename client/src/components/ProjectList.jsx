import { Link } from 'react-router-dom';

const ProjectList = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed backdrop-blur-xl">
        <svg className="mx-auto h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
        <p className="text-slate-400">Get started by creating your first project.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link
          key={project._id}
          to={`/projects/${project._id}`}
          className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 block relative overflow-hidden"
        >
          {/* Subtle gradient hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-colors duration-500"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {project.name}
            </h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ml-3 shrink-0 ${
              project.userRole === 'admin' 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {project.userRole === 'admin' ? 'Admin' : 'Member'}
            </span>
          </div>
          
          <p className="text-slate-400 text-sm line-clamp-2 mb-6 relative z-10 min-h-[40px]">
            {project.description || 'No description provided.'}
          </p>
          
          <div className="flex justify-between items-center text-sm relative z-10 pt-4 border-t border-slate-800/60">
            <div className="flex items-center text-slate-500">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {project.members ? project.members.length : 0} Members
            </div>
            <div className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform flex items-center">
              View Dashboard
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;

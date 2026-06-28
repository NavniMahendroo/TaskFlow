import React from 'react';
import { Calendar, Edit2, Trash2, Clock, CheckCircle2, PlayCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, theme }) => {
  const { _id, title, description, status, createdAt } = task;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusStyle = (statusVal, isDark) => {
    switch (statusVal) {
      case 'Completed':
        return {
          bg: isDark 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className={`w-4 h-4 mr-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />,
        };
      case 'In Progress':
        return {
          bg: isDark 
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
            : 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <PlayCircle className={`w-4 h-4 mr-1.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />,
        };
      case 'Pending':
      default:
        return {
          bg: isDark 
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
            : 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className={`w-4 h-4 mr-1.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />,
        };
    }
  };

  const isDark = theme === 'dark';
  const statusStyle = getStatusStyle(status, isDark);

  return (
    <div className={`rounded-2xl p-6 border hover-lift flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900/40 border-slate-800 shadow-lg' 
        : 'bg-white border-slate-200/60 shadow-premium'
    }`}>
      {/* Visual background gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-300 ${statusStyle.bg}`}>
            {statusStyle.icon}
            {status}
          </span>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                isDark 
                  ? 'text-slate-500 hover:text-brand-400 hover:bg-slate-800/80' 
                  : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100'
              }`}
              aria-label={`Edit task: ${title}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
                  onDelete(_id);
                }
              }}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                isDark 
                  ? 'text-slate-500 hover:text-rose-400 hover:bg-slate-800/80' 
                  : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
              }`}
              aria-label={`Delete task: ${title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className={`text-lg font-bold transition-colors mb-2 break-words ${
          isDark 
            ? 'text-slate-100 group-hover:text-brand-400' 
            : 'text-slate-800 group-hover:text-brand-600'
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm leading-relaxed mb-6 break-words whitespace-pre-line line-clamp-4 transition-colors duration-300 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {description}
        </p>
      </div>

      <div className={`flex items-center text-xs pt-4 border-t relative transition-colors duration-300 ${
        isDark 
          ? 'border-slate-800/70 text-slate-500' 
          : 'border-slate-100 text-slate-400'
      }`}>
        <Calendar className="w-3.5 h-3.5 mr-1.5" />
        <span>Created {formatDate(createdAt)}</span>
      </div>
    </div>
  );
};

export default TaskCard;

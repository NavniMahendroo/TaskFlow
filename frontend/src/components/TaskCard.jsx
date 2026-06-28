import React from 'react';
import { Calendar, Edit2, Trash2, Clock, CheckCircle2, PlayCircle, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { _id, title, description, status, createdAt } = task;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusStyle = (statusVal) => {
    switch (statusVal) {
      case 'Completed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          badge: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />,
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          badge: 'bg-blue-500',
          icon: <PlayCircle className="w-4 h-4 text-blue-500 mr-1.5" />,
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          badge: 'bg-amber-500',
          icon: <Clock className="w-4 h-4 text-amber-500 mr-1.5" />,
        };
    }
  };

  const statusStyle = getStatusStyle(status);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/60 hover-lift flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Visual background gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-50/10 to-brand-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg}`}>
            {statusStyle.icon}
            {status}
          </span>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-label={`Delete task: ${title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors mb-2 break-words">
          {title}
        </h3>
        
        <p className="text-sm text-slate-600 leading-relaxed mb-6 break-words whitespace-pre-line line-clamp-4">
          {description}
        </p>
      </div>

      <div className="flex items-center text-xs text-slate-400 pt-4 border-t border-slate-100 relative">
        <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
        <span>Created {formatDate(createdAt)}</span>
      </div>
    </div>
  );
};

export default TaskCard;

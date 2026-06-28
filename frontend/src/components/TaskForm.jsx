import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { z } from 'zod';

// Client-side Zod validation schema
const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string()
    .trim()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description must be less than 1000 characters' }),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
});

const TaskForm = ({ taskToEdit, onSubmit, onCancel, isSubmitting, theme }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
      });
    }
    setErrors({});
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate with Zod
    const validation = taskFormSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        const fieldName = err.path[0];
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(formData);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
      isDark ? 'bg-slate-955/80 dark:bg-slate-950/80' : 'bg-slate-900/40'
    }`}>
      <div className={`rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform scale-100 border transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900 border-slate-800/80 text-slate-100' 
          : 'bg-white border-slate-100 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-5 border-b transition-colors duration-300 ${
          isDark ? 'border-slate-800/70' : 'border-slate-100'
        }`}>
          <h2 className="text-xl font-bold">
            {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
          </h2>
          <button
            onClick={onCancel}
            className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 ${
              isDark 
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 focus:ring-slate-700' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 focus:ring-slate-300'
            }`}
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Design Landing Page"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.title 
                  ? 'border-rose-500/80 focus:ring-rose-500' 
                  : (isDark ? 'border-slate-800 focus:ring-brand-500' : 'border-slate-200 focus:ring-brand-500')
              } ${
                isDark 
                  ? 'bg-slate-955/40 dark:bg-slate-950/40 focus:bg-slate-950/80 text-slate-100 placeholder-slate-500' 
                  : 'bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400'
              }`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className={`text-xs font-medium mt-1.5 block ${isDark ? 'text-rose-400' : 'text-rose-500'}`}>{errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Detail the instructions or criteria for this task..."
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
                errors.description 
                  ? 'border-rose-500/80 focus:ring-rose-500' 
                  : (isDark ? 'border-slate-800 focus:ring-brand-500' : 'border-slate-200 focus:ring-brand-500')
              } ${
                isDark 
                  ? 'bg-slate-955/40 dark:bg-slate-950/40 focus:bg-slate-950/80 text-slate-100 placeholder-slate-500' 
                  : 'bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400'
              }`}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className={`text-xs font-medium mt-1.5 block ${isDark ? 'text-rose-400' : 'text-rose-500'}`}>{errors.description}</span>
            )}
          </div>

          {/* Status */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Status Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'border-slate-800 bg-slate-950/40 text-slate-100 [&>option]:bg-slate-900 [&>option]:text-slate-100' 
                  : 'border-slate-200 bg-slate-50/50 text-slate-800 [&>option]:bg-white [&>option]:text-slate-800'
              } focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent`}
              disabled={isSubmitting}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className={`flex justify-end space-x-3 pt-4 border-t mt-6 transition-colors duration-300 ${
            isDark ? 'border-slate-800/70' : 'border-slate-100'
          }`}>
            <button
              type="button"
              onClick={onCancel}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                isDark 
                  ? 'text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700/80 focus:ring-slate-700' 
                  : 'text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/70 focus:ring-slate-300'
              }`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 flex items-center justify-center min-w-[100px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

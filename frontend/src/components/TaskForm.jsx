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

const TaskForm = ({ taskToEdit, onSubmit, onCancel, isSubmitting }) => {
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
    // Clear field error as user types
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

    // Call submit handler with validated data
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-transform duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Design Landing Page"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.title ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-brand-500'
              } bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Detail the instructions or criteria for this task..."
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.description ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-brand-500'
              } bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className="text-xs text-rose-500 font-medium mt-1 block">{errors.description}</span>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Status Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
              disabled={isSubmitting}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 flex items-center justify-center min-w-[100px]"
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

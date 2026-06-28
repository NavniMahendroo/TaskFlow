import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Plus, Search, Filter, LayoutDashboard, CheckSquare, 
  Activity, Clock, Layers, AlertCircle, RefreshCw 
} from 'lucide-react';

import { fetchTasks, createTask, updateTask, deleteTask } from './api';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';

const App = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Queries
  const { data: tasks = [], isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
      setIsFormOpen(false);
    },
    onError: (err) => {
      const serverMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || err.message;
      toast.error(`Failed to create task: ${serverMessage}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully!');
      setIsFormOpen(false);
      setTaskToEdit(null);
    },
    onError: (err) => {
      const serverMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || err.message;
      toast.error(`Failed to update task: ${serverMessage}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: (err) => {
      toast.error(`Failed to delete task: ${err.message}`);
    },
  });

  // Form submission handler
  const handleFormSubmit = (formData) => {
    if (taskToEdit) {
      updateMutation.mutate({ id: taskToEdit._id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    deleteMutation.mutate(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };

  // Metrics calculations
  const totalTasks = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  // Filter tasks based on Search and Status Filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 flex flex-col relative overflow-hidden">
      
      {/* Dynamic ambient header background shapes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Navbar / Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-bold text-xl">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">TaskFlow</h1>
              <span className="text-xs font-semibold text-slate-400">Task Tracker System</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="p-2.5 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-premium focus:outline-none focus:ring-2 focus:ring-slate-300"
              title="Refresh Task Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 hover-lift focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full flex-grow">
        
        {/* KPI Scorecard Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" aria-label="Task metrics summary">
          {/* Card: Total */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-premium flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{isLoading ? '...' : totalTasks}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* Card: Pending */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-premium flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{isLoading ? '...' : pendingCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Card: In Progress */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-premium flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{isLoading ? '...' : inProgressCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          {/* Card: Completed */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-premium flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{isLoading ? '...' : completedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Filter controls / Toolbar */}
        <section className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" aria-label="Search and filter options">
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search task titles or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Status Group */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center mr-2">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filter:
            </div>
            {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {/* Task Grid Loading / Error / Content */}
        {isLoading ? (
          /* Skeleton loading grids */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-premium space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-20 h-6 rounded-full shimmer-loading" />
                  <div className="w-16 h-6 rounded shimmer-loading" />
                </div>
                <div className="h-6 w-3/4 rounded shimmer-loading" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded shimmer-loading" />
                  <div className="h-4 w-5/6 rounded shimmer-loading" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center">
                  <div className="w-4 h-4 rounded-full shimmer-loading mr-2" />
                  <div className="w-24 h-4 rounded shimmer-loading" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error Banner */
          <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12 shadow-premium">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-rose-900 mb-2">Connection Failure</h3>
            <p className="text-sm text-rose-600 leading-relaxed mb-6">
              Could not communicate with the database backend server. Ensure that MongoDB is running, and start the Express server at <code>http://localhost:5000</code>.
            </p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-rose-600/10 hover-lift"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          /* Empty Dashboard State */
          <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center max-w-md mx-auto mt-12 shadow-premium">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-3xl mx-auto mb-6">
              📋
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {searchTerm || statusFilter !== 'All' ? 'No Matching Tasks Found' : 'No Tasks Yet'}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {searchTerm || statusFilter !== 'All'
                ? 'Try tweaking your search term or selecting a different status filter option.'
                : 'Create your very first task to organize and track progress of your current work.'}
            </p>
            {searchTerm || statusFilter !== 'All' ? (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-all"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all hover-lift"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          /* Task Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Creation / Edit Modal */}
      {isFormOpen && (
        <TaskForm
          taskToEdit={taskToEdit}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { X, User, Mail, ShieldAlert, Sparkles, Volume2, Save, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SettingsModal = ({ currentUser, onUpdateProfile, onLogout, onResetAll, onClose, theme }) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatarSeed, setAvatarSeed] = useState(currentUser.email);
  const [errors, setErrors] = useState({});
  const [isResetConfirm, setIsResetConfirm] = useState(false);

  const isDark = theme === 'dark';

  // Cute seed options for adventure avatars
  const seeds = ['Cookie', 'Felix', 'Dusty', 'Buster', 'Tiger', 'Milo', 'Luna', 'Cleo'];

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    onUpdateProfile(updatedUser);
    toast.success('Settings updated successfully! ✨');
    onClose();
  };

  const triggerReset = () => {
    if (!isResetConfirm) {
      setIsResetConfirm(true);
      toast.error('Click Reset again to confirm deleting all tasks!');
      return;
    }
    onResetAll();
    setIsResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all duration-300">
      <div className={`rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900 border-slate-800/80 text-slate-100' 
          : 'bg-white border-slate-100 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-5 border-b transition-colors duration-300 ${
          isDark ? 'border-slate-800/70' : 'border-slate-100'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-xl font-bold">Account Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 ${
              isDark 
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 focus:ring-slate-700' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 focus:ring-slate-300'
            }`}
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {/* Avatar Selector */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Select Cute Character Avatar
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`}
                alt="Selected profile character preview"
                className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100/50 p-1 flex-shrink-0 object-contain shadow-md"
              />
              <div className="grid grid-cols-4 gap-2 flex-grow">
                {seeds.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAvatarSeed(s)}
                    className={`py-1 text-xs font-semibold rounded-lg border transition-all ${
                      avatarSeed === s
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : (isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600')
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: null })); }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm ${
                    errors.name 
                      ? 'border-rose-400 focus:ring-rose-500' 
                      : (isDark ? 'border-slate-800 focus:ring-brand-500 bg-[#0f172a] text-slate-100' : 'border-slate-300 bg-white text-slate-950 focus:ring-brand-500')
                  }`}
                />
              </div>
              {errors.name && (
                <span className="text-xs text-rose-500 mt-1 block font-medium">{errors.name}</span>
              )}
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: null })); }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm ${
                    errors.email 
                      ? 'border-rose-400 focus:ring-rose-500' 
                      : (isDark ? 'border-slate-800 focus:ring-brand-500 bg-[#0f172a] text-slate-100' : 'border-slate-300 bg-white text-slate-950 focus:ring-brand-500')
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-rose-500 mt-1 block font-medium">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Dangerous Actions (Board Reset) */}
          <div className={`pt-5 border-t transition-colors duration-300 ${
            isDark ? 'border-slate-800/70' : 'border-slate-100'
          }`}>
            <h3 className="text-sm font-bold text-rose-500 flex items-center mb-2">
              <ShieldAlert className="w-4 h-4 mr-1.5" />
              Danger Zone
            </h3>
            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Permanently delete all tasks on this board. This action is irreversible.
            </p>
            <button
              type="button"
              onClick={triggerReset}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isResetConfirm 
                  ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
              }`}
            >
              {isResetConfirm ? 'Confirm Reset Dashboard' : 'Reset All Tasks'}
            </button>
          </div>

          {/* Footer Actions */}
          <div className={`flex justify-between items-center pt-4 border-t transition-colors duration-300 ${
            isDark ? 'border-slate-800/70' : 'border-slate-100'
          }`}>
            {/* Logout Action */}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center px-4 py-2.5 bg-slate-800/20 hover:bg-slate-800/40 text-rose-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Log Out
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  isDark 
                    ? 'text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700/80 border-slate-800' 
                    : 'text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;

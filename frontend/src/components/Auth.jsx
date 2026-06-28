import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(3, { message: 'Password must be at least 3 characters' }),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(3, { message: 'Password must be at least 3 characters' }),
});

const Auth = ({ onAuthSuccess, theme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme === 'dark';

  // Pre-seed default account on mount
  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userIndex = registeredUsers.findIndex((u) => u.email === 'abc@gmail.com');
    
    const defaultUser = {
      name: 'Abc',
      email: 'abc@gmail.com',
      password: '123',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=abc%40gmail.com',
    };

    if (userIndex === -1) {
      registeredUsers.push(defaultUser);
    } else {
      registeredUsers[userIndex] = defaultUser;
    }
    
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const schema = isLogin ? loginSchema : signupSchema;
    const validation = schema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const emailKey = formData.email.trim().toLowerCase();

    // Simulate Network Latency
    setTimeout(() => {
      if (isLogin) {
        // Sign In verification
        const matchedUser = registeredUsers.find((u) => u.email === emailKey);
        
        if (!matchedUser) {
          setErrors({ email: 'Account not found. Please Sign Up first.' });
          setIsLoading(false);
          return;
        }

        if (matchedUser.password !== formData.password) {
          setErrors({ password: 'Incorrect password. Please try again.' });
          setIsLoading(false);
          return;
        }

        // Login success
        const loggedInUser = {
          name: matchedUser.name,
          email: matchedUser.email,
          avatar: matchedUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(matchedUser.email)}`,
        };
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        onAuthSuccess(loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name}! 👋`);
      } else {
        // Sign Up verification
        const emailExists = registeredUsers.some((u) => u.email === emailKey);
        
        if (emailExists) {
          setErrors({ email: 'This email is already registered. Please Sign In.' });
          setIsLoading(false);
          return;
        }

        // Register new user
        const newUser = {
          name: formData.name.trim(),
          email: emailKey,
          password: formData.password,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(emailKey)}`,
        };

        registeredUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

        // Auto login on signup success
        const sessionUser = {
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
        };
        localStorage.setItem('user', JSON.stringify(sessionUser));
        onAuthSuccess(sessionUser);
        toast.success(`Account created successfully! Welcome, ${sessionUser.name}! 🎉`);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#060813] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Decorative premium floating glowing bubbles */}
      <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse transition-colors duration-300 ${
        isDark ? 'bg-gradient-to-br from-brand-600/15 via-indigo-650/10 to-transparent' : 'bg-brand-200/20'
      }`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse transition-colors duration-300 ${
        isDark ? 'bg-gradient-to-tr from-pink-500/10 via-brand-500/5 to-transparent' : 'bg-pink-100/15'
      }`} />

      {/* Main glassmorphic card */}
      <div className={`w-full max-w-md rounded-3xl p-8 border transition-all duration-300 backdrop-blur-xl ${
        isDark 
          ? 'bg-[#0f1322]/60 border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.35)]' 
          : 'bg-white/80 border-slate-200/50 shadow-[0_15px_35px_rgba(0,0,0,0.05)]'
      }`}>
        
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25 text-white font-bold text-3xl mb-3 animate-bounce">
            ⚡
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            TaskFlow
          </h1>
          <p className={`text-xs mt-1.5 flex items-center font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400 animate-pulse" />
            Organize tasks beautifully
          </p>
        </div>

        {/* Tab Selector */}
        <div className={`flex p-1 rounded-xl mb-6 border transition-colors ${
          isDark ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-100/80 border-slate-200/50'
        }`}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrors({}); }}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              isLogin 
                ? (isDark ? 'bg-slate-800/70 border border-slate-700/30 text-white shadow-lg' : 'bg-white text-slate-900 shadow-sm') 
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrors({}); }}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              !isLogin 
                ? (isDark ? 'bg-slate-800/70 border border-slate-700/30 text-white shadow-lg' : 'bg-white text-slate-900 shadow-sm') 
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className={`w-4 h-4 ${isDark ? 'text-brand-400' : 'text-slate-400'}`} />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="abc"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:border-transparent transition-all text-sm ${
                    errors.name 
                      ? 'border-rose-500 focus:ring-rose-500/10' 
                      : (isDark ? 'border-slate-800/80 bg-slate-950/50 text-slate-100 focus:bg-[#060813]/90 focus:ring-brand-500/10 placeholder-slate-600' : 'border-slate-300 bg-white text-slate-950 focus:ring-brand-500/10 placeholder-slate-400')
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <span className="text-xs text-rose-500 dark:text-rose-400 mt-1 block font-medium">{errors.name}</span>
              )}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className={`w-4 h-4 ${isDark ? 'text-brand-400' : 'text-slate-400'}`} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="abc@gmail.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:border-transparent transition-all text-sm ${
                  errors.email 
                    ? 'border-rose-500 focus:ring-rose-500/10' 
                    : (isDark ? 'border-slate-800/80 bg-slate-950/50 text-slate-100 focus:bg-[#060813]/90 focus:ring-brand-500/10 placeholder-slate-600' : 'border-slate-300 bg-white text-slate-950 focus:ring-brand-500/10 placeholder-slate-400')
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-rose-500 dark:text-rose-400 mt-1 block font-medium">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${isDark ? 'text-brand-400' : 'text-slate-400'}`} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="..."
                className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:border-transparent transition-all text-sm ${
                  errors.password 
                    ? 'border-rose-500 focus:ring-rose-500/10' 
                    : (isDark ? 'border-slate-800/80 bg-slate-950/50 text-slate-100 focus:bg-[#060813]/90 focus:ring-brand-500/10 placeholder-slate-600' : 'border-slate-300 bg-white text-slate-950 focus:ring-brand-500/10 placeholder-slate-400')
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-rose-500 dark:text-rose-400 mt-1 block font-medium">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 mt-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover-lift focus:outline-none focus:ring-2 focus:ring-brand-500 flex items-center justify-center cursor-pointer text-sm ${
              isDark 
                ? 'shadow-[0_4px_25px_rgba(79,70,229,0.15)] hover:shadow-[0_6px_35px_rgba(79,70,229,0.25)]' 
                : 'shadow-[0_4px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_6px_30px_rgba(79,70,229,0.3)]'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In to Board' : 'Get Started'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Toggle Note */}
        <div className="text-center mt-6">
          <button
            onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
            className={`text-xs font-semibold hover:underline focus:outline-none transition-colors ${
              isDark ? 'text-brand-400 hover:text-brand-300' : 'text-brand-600 hover:text-brand-700'
            }`}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

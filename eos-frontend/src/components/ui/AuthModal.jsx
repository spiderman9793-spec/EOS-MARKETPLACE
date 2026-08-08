import React, { useState } from 'react';
import { colleges } from '../../data/colleges';
import { useAuthStore } from '../../store/authStore';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    location: '',
    academicYear: '1st Year',
    password: ''
  });

  // Autocomplete State
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { login, signup, isLoading, error } = useAuthStore();

  if (!isOpen) return null;

  // Filter Colleges (Case-insensitive matching)
  const filteredColleges = colleges.filter(college =>
    college.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  // Form Submission Event Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'signup') {
      if (!formData.name || !formData.email || !formData.college || !formData.password) {
        alert('Please fill in all required fields!');
        return;
      }
    }

    let result;
    if (mode === 'signup') {
      result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        campus: formData.college
      });
    } else {
      result = await login(formData.email, formData.password);
    }

    if (result.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      alert(result.error || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-xl border border-white/20 text-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          type="button" 
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-1">
          {mode === 'signup' ? 'Join Eos' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          {mode === 'signup' ? 'Set up your student marketplace profile' : 'Sign in to access your campus items'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* AKTU / College Autocomplete Combobox */}
              <div className="relative">
                <label className="block text-xs text-gray-300 mb-1">College / University Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Type to search AKTU / College..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  value={collegeSearch}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setCollegeSearch(e.target.value);
                    setFormData({ ...formData, college: e.target.value });
                    setShowDropdown(true);
                  }}
                />

                {/* Dropdown Options */}
                {showDropdown && (
                  <div className="absolute z-20 w-full mt-1 max-h-48 overflow-y-auto rounded-lg bg-slate-900 border border-white/20 shadow-xl">
                    {filteredColleges.length > 0 ? (
                      filteredColleges.slice(0, 8).map((college, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-300 cursor-pointer border-b border-white/5"
                          onClick={() => {
                            setCollegeSearch(college);
                            setFormData({ ...formData, college: college });
                            setShowDropdown(false);
                          }}
                        >
                          {college}
                        </div>
                      ))
                    ) : (
                      <div 
                        className="px-3 py-2 text-sm text-gray-400 cursor-pointer hover:bg-white/5"
                        onClick={() => {
                          setFormData({ ...formData, college: collegeSearch });
                          setShowDropdown(false);
                        }}
                      >
                        Use "{collegeSearch}" as custom campus
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Location & Academic Year Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Location / City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Noida, Lucknow"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Academic Year</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgrad">Postgrad</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">Personal Email</label>
            <input 
              type="email" 
              required
              placeholder="you@gmail.com"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait...' : (mode === 'signup' ? 'Create Student Account' : 'Log In')}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-4 text-center text-xs text-gray-400">
          {mode === 'signup' ? (
            <span>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-cyan-400 underline ml-1">Log In</button></span>
          ) : (
            <span>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-cyan-400 underline ml-1">Get Started</button></span>
          )}
        </div>

      </div>
    </div>
  );
}
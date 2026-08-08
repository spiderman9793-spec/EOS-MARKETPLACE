import React from 'react';

export default function Navbar({ currentUser, onOpenAuth, onLogout }) {
  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-extrabold tracking-wider text-cyan-400">
        EOS<span className="text-white text-xs ml-1 font-normal">Market</span>
      </div>

      <div>
        {currentUser ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{currentUser.name}</p>
              <p className="text-xs text-cyan-400 max-w-[150px] truncate">
                {currentUser.college ? currentUser.college.split('-')[0].trim() : ''}
              </p>
            </div>
            <button 
              onClick={onLogout}
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-lg border border-white/10"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
}
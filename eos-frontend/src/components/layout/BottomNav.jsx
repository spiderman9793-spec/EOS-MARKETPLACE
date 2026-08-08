import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Plus, MessageCircle, User } from 'lucide-react';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/browse', label: 'Wishlist', icon: Heart },
  { to: '/sell', label: 'Add', icon: Plus, primary: true },
  { to: '/chat', label: 'Inbox', icon: MessageCircle },
  { to: '/dashboard', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 px-3 pb-3">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl flex items-center justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to;
          if (primary) {
            return (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#8b5cf6] flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-[#0066FF] mt-1">
                  {label}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={label}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                active
                  ? 'text-[#0066FF]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

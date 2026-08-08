import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', withText = true, to = '/', textId }) {
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-lg' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { box: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-2xl' },
  };

  const s = sizes[size];

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div
        className={`${s.box} rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform`}
      >
        <svg
          className={`${s.icon}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#eos-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="eos-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M18 5H8v14h10" />
          <path d="M8 12h7" />
        </svg>
      </div>
      {withText && (
        <span id={textId} className={`${s.text} font-bold font-display text-[#0f172a] tracking-tight`}>
          Eos
        </span>
      )}
    </Link>
  );
}



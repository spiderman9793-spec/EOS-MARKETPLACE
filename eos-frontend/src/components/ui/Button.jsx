import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-r from-[#0066FF] to-[#0ea5e9] text-white shadow-sm hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5',
  secondary:
    'bg-white/80 backdrop-blur-md border border-white/40 text-slate-700 hover:bg-white shadow-sm',
  ghost: 'text-slate-600 hover:bg-slate-100/70',
  accent:
    'bg-gradient-to-r from-[#8b5cf6] to-[#0066FF] text-white shadow-sm hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5',
  outline:
    'border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap, Search } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
import { useAuthStore } from '../../store/authStore';
import { colleges } from '../../data/colleges';

export default function Register() {
  const navigate = useNavigate();
  const registerAccount = useAuthStore((s) => s.register);
  const [showPassword, setShowPassword] = useState(false);
  const [campusSearch, setCampusSearch] = useState('');
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const campusRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const filteredColleges = useMemo(() => {
    if (!campusSearch.trim()) return colleges.slice(0, 6);
    const lower = campusSearch.toLowerCase();
    const matches = colleges.filter((c) => c.toLowerCase().includes(lower));
    return matches.slice(0, 6);
  }, [campusSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (campusRef.current && !campusRef.current.contains(e.target)) {
        setShowCampusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = async (data) => {
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 1000));
      registerAccount({
        user: { name: data.name, email: data.email, college: data.university },
        token: 'mock_jwt_token',
      });
      toast.success('Account created! Welcome to Eos.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="text-3xl font-bold text-[#0f172a] mt-6">Create your account</h1>
          <p className="text-slate-500 mt-2">Join your campus marketplace</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field
              label="Full name"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
            >
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Enter your full name' },
                })}
              />
            </Field>

            <Field
              label="Campus email"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
            >
              <input
                type="email"
                placeholder="you@campus.edu"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email',
                  },
                })}
              />
            </Field>

            <Field
              label="University"
              icon={<GraduationCap className="w-4 h-4" />}
              error={errors.university?.message}
            >
              <div className="relative" ref={campusRef}>
                <input
                  type="text"
                  placeholder="Type your college or university name..."
                  value={campusSearch}
                  onChange={(e) => {
                    setCampusSearch(e.target.value);
                    setShowCampusDropdown(true);
                    setValue('university', e.target.value);
                  }}
                  onFocus={() => setShowCampusDropdown(true)}
                  className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                  {...register('university', {
                    required: 'University is required',
                    onChange: (e) => setValue('university', e.target.value),
                  })}
                />
                {showCampusDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
                    {filteredColleges.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-500">No colleges found</div>
                    )}
                    {filteredColleges.map((college) => (
                      <button
                        key={college}
                        type="button"
                        onClick={() => {
                          setCampusSearch(college);
                          setValue('university', college);
                          setShowCampusDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50/80 transition-colors text-sm text-slate-700 border-b border-slate-100 last:border-0"
                      >
                        {college}
                      </button>
                    ))}
                    {campusSearch.trim() && !filteredColleges.includes(campusSearch) && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowCampusDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50/80 transition-colors text-sm text-slate-500 italic border-t border-slate-200"
                      >
                        Can't find yours? Use '{campusSearch}'
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Field>

            <Field
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            >
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
            </Field>

            <Field
              label="Confirm password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) =>
                    v === password || 'Passwords do not match',
                })}
              />
            </Field>

            <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 accent-[#0066FF]"
                {...register('terms', { required: 'You must accept the terms' })}
              />
              <span>
                I agree to the{' '}
                <span className="font-medium text-[#0066FF]">Terms of Service</span>{' '}
                and{' '}
                <span className="font-medium text-[#0066FF]">Privacy Policy</span>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500 -mt-3">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              Create account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#0066FF] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, error, trailing, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/60 border transition-colors ${
          error ? 'border-red-300' : 'border-slate-200 focus-within:border-[#0066FF]'
        }`}
      >
        <span className="text-slate-400">{icon}</span>
        {children}
        {trailing}
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

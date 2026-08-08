import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 800));
      login({
        user: { name: 'Student User', email: data.email, college: 'Eos University' },
        token: 'mock_jwt_token',
      });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0f172a]">Welcome back</h1>
          <p className="text-slate-500 mt-2">Sign in to continue to Eos</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field
              label="Email"
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
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
            </Field>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="accent-[#0066FF]" />
                Remember me
              </label>
              <button
                type="button"
                className="font-medium text-[#0066FF] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              Sign in
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white/80 text-xs text-slate-400">
                or
              </span>
            </div>
          </div>

          <Button variant="secondary" size="lg" className="w-full">
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#0066FF] hover:underline"
          >
            Create one
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

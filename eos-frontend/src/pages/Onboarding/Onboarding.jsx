import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import colleges from '../../data/colleges';

export default function Onboarding() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [campus, setCampus] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCampusChange = (e) => {
    const value = e.target.value;
    setCampus(value);
    if (value.length > 1) {
      const filtered = colleges.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campus) return toast.error('Please select your campus');

    setLoading(true);
    try {
      await api.put('/users/profile', { campus });
      toast.success('Campus set successfully!');
      navigate('/browse');
    } catch (error) {
      toast.error('Failed to update campus');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to EOS 🎓</h1>
        <p className="text-center text-gray-600 mb-6">
          Select your campus to get started
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={campus}
              onChange={handleCampusChange}
              placeholder="Search for your college..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
                {suggestions.map((college, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setCampus(college);
                      setSuggestions([]);
                    }}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {college}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !campus}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
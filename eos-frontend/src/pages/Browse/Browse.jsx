import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../../components/ui/ListingCard';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

export default function Browse() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const campusScope = useAuthStore((s) => s.campusScope);
  const userCollege = useAuthStore((s) => s.user?.college);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scoped = products.filter((p) => {
    if (campusScope === 'all') return true;
    if (!userCollege) return true;
    return p.campus === userCollege;
  });

  const filtered = scoped.filter((p) => {
    const matchesQuery = p.title?.toLowerCase().includes(query.toLowerCase()) || 
                         p.description?.toLowerCase().includes(query.toLowerCase());
    const matchesCat = cat === 'All' || p.category === cat;
    return matchesQuery && matchesCat;
  });

  if (loading) return <div className="p-4 text-center">Loading products...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl px-5 py-4">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-3">Browse</h1>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 border border-slate-200 focus-within:border-[#0066FF] transition-colors">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Textbooks, bikes, calculators…"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100/70 hover:text-slate-700 transition-colors" aria-label="Filters">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Other'].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  cat === c
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#0ea5e9] text-white shadow-sm'
                    : 'bg-white/60 text-slate-600 hover:bg-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ListingCard
              key={p._id}
              item={p}
              onClick={() => navigate(`/product/${p._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
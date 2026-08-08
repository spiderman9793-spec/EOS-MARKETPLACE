import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Package, MessageCircle, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/products');
        const userProducts = response.data.filter(
          (product) => product.seller?._id === user?._id
        );
        setListings(userProducts);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  const changePrice = (id, currentPrice) => {
    const value = prompt('Enter new price', String(currentPrice));
    const nextPrice = Number(value);
    if (!value || Number.isNaN(nextPrice) || nextPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    setListings((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              originalPrice: p.originalPrice ?? p.price,
              price: nextPrice,
            }
          : p
      )
    );
    toast.success('Price updated');
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Dashboard</p>
            <h1 className="text-3xl font-bold text-[#0f172a] mt-1">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-slate-600 mt-2">
              Manage listings, chat with buyers, and track campus deals.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => navigate('/sell')}>
              <Plus className="w-5 h-5" /> Sell
            </Button>
            <Button variant="secondary" onClick={() => navigate('/browse')}>
              <ShoppingBag className="w-5 h-5" /> Browse
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <Card hover onClick={() => navigate('/sell')} className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0f172a]">Create a listing</h2>
            <p className="text-sm text-slate-600 mt-1">
              Post items for sale in seconds with photos, price, and pickup info.
            </p>
          </Card>

          <Card hover onClick={() => navigate('/chat')} className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#0066FF] flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0f172a]">Messages</h2>
            <p className="text-sm text-slate-600 mt-1">
              Chat with buyers and sellers to coordinate handoffs on campus.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-900/20 mb-4">
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0f172a]">Account</h2>
            <p className="text-sm text-slate-600 mt-1">
              Signed in{user?.email ? ` as ${user.email}` : ''}.
            </p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign out
            </Button>
          </Card>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Your listings</h2>
              <p className="text-sm text-slate-500 mt-1">
                Update pricing and see the fee breakdown (5% platform fee).
              </p>
            </div>
            <button
              onClick={() => navigate('/sell')}
              className="text-sm font-semibold text-[#0066FF] hover:underline"
            >
              Create new
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            {listings.map((p) => {
              const fee = Math.round(p.price * 0.05 * 100) / 100;
              const payout = Math.round((p.price - fee) * 100) / 100;
              return (
                <Card key={p._id} className="p-5">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.title || p.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-slate-100"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate">
                        {p.title || p.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {p.pickupSpot || p.campus || 'Campus'}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-[#0066FF]">
                            ₹{p.price}
                          </p>
                          <p className="text-xs text-slate-500">
                            Fee ₹{fee} • Payout ₹{payout}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            changePrice(p._id, p.price || p.originalPrice)
                          }
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
            {!listings.length && (
              <Card className="p-6 md:col-span-3">
                <p className="text-slate-600">
                  No listings found for {user?.campus || 'your campus'}. Create your first listing to
                  start selling.
                </p>
                <Button className="mt-4" onClick={() => navigate('/sell')}>
                  <Plus className="w-5 h-5" /> Create listing
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
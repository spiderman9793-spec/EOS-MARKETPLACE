import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
import Card from '../../components/ui/Card';
import ListingCard from '../../components/ui/ListingCard';
import { useAuthStore } from '../../store/authStore';

export default function Landing({ openAuth }) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'myCampus'
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useAuthStore();
  const userCampus = user?.college || null;

  const campuses = ['All Campuses', 'Stanford University', 'UC Berkeley', 'NYU', 'MIT'];

  const listings = [
    {
      title: 'Sony WH-1000XM4',
      price: '$180',
      verified: 'Stanford Verified',
      campus: 'Stanford University',
      category: 'Electronics',
      condition: 'Like New',
      pickupSpot: 'Student Center',
      distance: '0.5 mi',
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      ],
    },
    {
      title: 'Calculus: Early Transcendentals',
      price: '$35',
      verified: 'UC Berkeley',
      campus: 'UC Berkeley',
      category: 'Books',
      condition: 'Good',
      pickupSpot: 'Library',
      distance: '0.3 mi',
      images: [
        'https://images.unsplash.com/photo-1532012194024-ab5ba0a5fd25?w=800',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      ],
    },
    {
      title: 'Ergonomic Desk Chair',
      price: '$50',
      verified: 'NYU Verified',
      campus: 'NYU',
      category: 'Furniture',
      condition: 'Good',
      pickupSpot: 'Dorm Lobby',
      distance: '0.8 mi',
      images: [
        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
        'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
      ],
    },
    {
      title: 'MacBook Pro M2',
      category: 'Electronics',
      location: 'Main Canteen',
      campus: 'MIT',
      condition: 'Like New',
      price: '$950',
      pickupSpot: 'Engineering Building',
      distance: '1.2 mi',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489683fd588c?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c6?w=800',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
        'https://images.unsplash.com/photo-1517336714731-489683fd588c?w=800',
      ],
    },
    {
      title: 'Textbooks Bundle',
      category: 'Books',
      location: 'Library Entrance',
      campus: 'Stanford University',
      condition: 'Good',
      price: '$120',
      pickupSpot: 'Main Library',
      distance: '0.4 mi',
      images: [
        'https://images.unsplash.com/photo-1532012194024-ab5ba0a5fd25?w=800',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
      ],
    },
    {
      title: 'IKEA Chair',
      category: 'Furniture',
      location: 'Student Housing',
      campus: 'UC Berkeley',
      condition: 'Fair',
      price: '$45',
      pickupSpot: 'Dormitory A',
      distance: '0.6 mi',
      images: [
        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
        'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      ],
    },
  ];

  const filteredListings = useMemo(() => {
    let filtered = listings;
    if (viewMode === 'myCampus' && isAuthenticated && userCampus) {
      filtered = listings.filter((item) => item.campus === userCampus);
    }
    const searchLower = searchQuery.toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [viewMode, isAuthenticated, userCampus, searchQuery]);

  const premiumItems = useMemo(() => {
    return listings.filter((item) => ['MIT', 'Stanford University'].includes(item.campus)).slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Logo size="sm" withText={true} to="/" />
          <div className="flex items-center gap-3">
            <button onClick={openAuth} className="text-sm font-medium text-slate-600 hover:text-[#0f172a] transition-colors">
              Log in
            </button>
            <Button size="sm" onClick={openAuth}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-5xl mx-auto">
          {/* EOS Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/80 border border-slate-200/60 shadow-lg backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                [
              </div>
              <span className="font-bold text-slate-900 tracking-wider text-lg uppercase">
                EOS
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Buy. Sell. Connect.
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl font-medium text-indigo-600/90 mb-4">
            Your campus marketplace, simplified.
          </p>

          {/* Subtext */}
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-normal mt-2 mb-10">
            Trade textbooks, electronics, and dorm essentials with verified students at your university.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={openAuth} className="min-w-[200px]">
              Start selling
            </Button>
            <Button size="lg" variant="secondary" onClick={openAuth} className="min-w-[200px]">
              Browse listings
            </Button>
          </div>
        </div>
      </section>

      {/* Live Campus Feed Preview */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-3xl bg-white/60 border border-slate-200/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              {/* Glassmorphic Segmented Toggle */}
              <div className="inline-flex items-center p-1 rounded-full bg-white/80 border border-slate-200/60 shadow-sm backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    viewMode === 'all'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Campuses
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      openAuth('login');
                    } else {
                      setViewMode('myCampus');
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    viewMode === 'myCampus'
                      ? 'bg-[#0066FF] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>📍</span>
                  My Campus
                </button>
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search textbooks, tech, dorm gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-1.5 rounded-full bg-slate-100/80 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50"
                />
              </div>
            </div>

            {/* My Campus Active Badge */}
            {viewMode === 'myCampus' && isAuthenticated && userCampus && (
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 text-xs font-medium text-[#0066FF]">
                <span>Showing exclusive listings for {userCampus}</span>
              </div>
            )}

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredListings.map((item, idx) => (
                  <ListingCard
                    key={idx}
                    item={item}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No listings found on this campus</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Product Preview */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4 transition-all duration-200 ease-out hover:text-slate-800">
              Premium items, trusted sellers
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto transition-all duration-200 ease-out">
              Discover high-quality campus essentials from verified students
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumItems.map((item, idx) => (
              <Card key={idx} hover className="glass-card overflow-hidden group cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-30 transition-all duration-300 ease-out`} />
                  <div className="absolute inset-0 flex items-center justify-center text-6xl transition-all duration-300 ease-out group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#0066FF] shadow-sm transition-all duration-200 ease-out group-hover:shadow-md">
                      📍 {item.location}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-[#0066FF] inline-block mb-2 transition-all duration-200 ease-out group-hover:bg-blue-100">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-[#0f172a] text-lg mb-3 transition-all duration-200 ease-out group-hover:text-slate-800">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 transition-all duration-200 ease-out group-hover:text-slate-700">
                      Verified seller
                    </span>
                    <svg className="w-5 h-5 text-[#0066FF] transition-all duration-200 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="px-4 py-12 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="sm" withText={true} to="/" />
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <button onClick={() => {}} className="hover:text-[#0066FF] transition-colors">
                About
              </button>
              <button onClick={() => {}} className="hover:text-[#0066FF] transition-colors">
                Privacy
              </button>
              <button onClick={() => {}} className="hover:text-[#0066FF] transition-colors">
                Terms
              </button>
            </div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Eos. Built by students, for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
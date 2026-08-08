import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/ui/Navbar';
import BottomNav from './components/layout/BottomNav';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useAuthStore } from './store/authStore';

import Onboarding from './pages/Onboarding/Onboarding';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Landing from './pages/Landing/Landing';
import Browse from './pages/Browse/Browse';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import Chat from './pages/Chat/Chat';
import Sell from './pages/Sell/Sell';
import AuthModal from './components/ui/AuthModal';
import InfoModal from './components/ui/InfoModal';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState('about');
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };
  const closeAuth = () => setAuthModalOpen(false);
  const openInfo = (type) => {
    setInfoModalType(type);
    setInfoModalOpen(true);
  };
  const closeInfo = () => setInfoModalOpen(false);

  return (
    <Router>
      <AppLayout openAuth={openAuth} openInfo={openInfo} />
      <AuthModal isOpen={authModalOpen} onClose={closeAuth} />
      <InfoModal isOpen={infoModalOpen} onClose={closeInfo} type={infoModalType} />
    </Router>
  );
}

function AppLayout({ openAuth, openInfo }) {
  const { pathname } = useLocation();
  const hideBottomNav =
    pathname === '/onboarding' || pathname === '/login' || pathname === '/register';
  const hideNavbar = hideBottomNav || pathname === '/';
  const hydrate = useAuthStore((state) => state.hydrate);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {!hideNavbar && <Navbar currentUser={user} onOpenAuth={openAuth} onLogout={logout} />}
      <main className={!hideNavbar ? 'pt-20' : ''}>
        <Routes>
          <Route path="/" element={<Landing openAuth={openAuth} />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <Sell />
              </ProtectedRoute>
            }
          />
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideBottomNav && <BottomNav />}
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </div>
  );
}

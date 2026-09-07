import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { 
  FiHome, FiInfo, FiLayers, FiGlobe, 
  FiMail, FiUser, FiLogOut, FiMenu, FiX, FiShield, FiCheckCircle
} from 'react-icons/fi';
import { organizationInfo } from '../data/siteContent';

// Helper: Resolve full image URL for backend-served images
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const backendUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
    : 'http://localhost:5000';
  return `${backendUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Extract user first name
  const firstName = useMemo(() => {
    if (!user) return 'Member';
    if (user.firstName) return user.firstName;
    if (user.profile?.fullName) return user.profile.fullName.split(' ')[0];
    if (user.email) return user.email.split('@')[0];
    return 'Member';
  }, [user]);

  // Resolve user avatar
  const profilePhotoUrl = useMemo(() => {
    if (!user) return null;
    const photo = user.profile?.profilePhotoUrl || user.profilePhotoUrl;
    if (photo && photo !== '/default-avatar.png') {
      return resolveImageUrl(photo);
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=0284c7&color=fff&size=128`;
  }, [user, firstName]);

  const navLinks = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/about', label: 'About Us', icon: FiInfo },
    { path: '/programs', label: 'Programs', icon: FiLayers },
    { path: '/news', label: 'News & Updates', icon: FiGlobe },
    { path: '/get-involved', label: 'Get Involved', icon: FiShield },
    { path: '/contact', label: 'Contact', icon: FiMail },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
        : 'bg-white py-4 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo & Organization Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-navy-900 via-primary-700 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden p-1">
              <img 
                src="/uploads/thumbnails/logo.png" 
                alt={organizationInfo.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-white font-bold text-lg tracking-wider" style={{ display: 'none' }}>AY</span>
            </div>
            <div>
              <span className="font-extrabold text-xl text-navy-900 block leading-tight tracking-tight group-hover:text-primary-600 transition-colors">
                {organizationInfo.shortName}
              </span>
              <span className="text-xs text-slate-500 font-medium block -mt-0.5 tracking-wider uppercase">
                South Sudan
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Admin Portal Link if Admin */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-1.5 bg-accent-50 text-accent-700 border border-accent-200 hover:bg-accent-100 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                {/* Profile Pill */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-white shadow-xs">
                    <img
                      src={profilePhotoUrl}
                      alt={firstName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=0284c7&color=fff`;
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{firstName}</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-navy-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] bg-white border-b border-slate-200 shadow-xl py-6 px-4 z-50 animate-fade-in-up">
          <nav className="flex flex-col space-y-1.5 mb-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-base transition-all ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                    <img src={profilePhotoUrl} alt={firstName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{firstName}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="block w-full text-center px-4 py-3 bg-accent-50 text-accent-700 rounded-xl font-semibold text-sm"
                  >
                    Go to Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="block w-full text-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-sm transition-colors"
                >
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="block w-full text-center px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="text-center py-3 px-4 rounded-xl border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center py-3 px-4 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

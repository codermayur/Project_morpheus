import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(3);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/market', label: 'Market', icon: '📊' },
    { to: '/weather', label: 'Weather', icon: '🌦️' },
    { to: '/qa', label: 'Q&A', icon: '💬' },
  ];

  const authNavLinks = [
    { to: '/feed', label: 'Feed', icon: '📰' },
    { to: '/chat', label: 'Chat', icon: '💬' },
  ];

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50'
            : 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo Section */}
            <Link
              to="/"
              className={`flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 group`}
            >
              <div className={`text-3xl lg:text-4xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}>
                🌾
              </div>
              <div className={`hidden sm:block transition-all duration-300 ${
                isScrolled ? 'text-slate-900' : 'text-white'
              }`}>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  KrishiConnect
                </h1>
                <p className={`text-xs lg:text-sm font-medium ${isScrolled ? 'text-slate-500' : 'text-emerald-100'}`}>
                  Farm to Market
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 group ${
                    isActive(link.to)
                      ? isScrolled
                        ? 'bg-emerald-100 text-emerald-700 font-semibold'
                        : 'bg-white/20 text-white font-semibold'
                      : isScrolled
                        ? 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
                  <span className="hidden lg:inline">{link.label}</span>

                  {isActive(link.to) && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-lg animate-slideIn" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3 lg:gap-4">
              {isAuthenticated ? (
                <>
                  {/* Desktop Auth Nav Links */}
                  <div className="hidden lg:flex items-center gap-2">
                    {authNavLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 group ${
                          isActive(link.to)
                            ? isScrolled
                              ? 'bg-emerald-100 text-emerald-700 font-semibold'
                              : 'bg-white/20 text-white font-semibold'
                            : isScrolled
                              ? 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100'
                              : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
                        <span>{link.label}</span>

                        {isActive(link.to) && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-lg animate-slideIn" />
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Notification Icon */}
                  <button
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                    aria-label="Notifications"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {activeNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                        {activeNotifications}
                      </span>
                    )}
                  </button>

                  {/* User Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 rounded-lg transition-all duration-300 group ${
                        isScrolled
                          ? 'hover:bg-slate-100'
                          : 'hover:bg-white/10'
                      }`}
                      aria-label="User menu"
                    >
                      <div className="relative">
                        <img
                          src={user?.avatar?.url || '/default-avatar.png'}
                          alt={user?.name || 'User'}
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 object-cover border-2 border-white/30 transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = 'https://ui-avatars.com/api/?name=' +
                              encodeURIComponent(user?.name || 'U') + '&background=10b981&color=fff&bold=true';
                          }}
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className={`text-sm font-semibold transition-colors duration-300 ${
                          isScrolled ? 'text-slate-900' : 'text-white'
                        }`}>
                          {user?.name || 'User'}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isScrolled ? 'text-slate-500' : 'text-white/70'
                        }`}>
                          Farmer
                        </p>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-all duration-300 ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        } ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>

                    {/* User Dropdown Content */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideDown border border-slate-100">
                        {/* User Info Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 text-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={user?.avatar?.url || '/default-avatar.png'}
                              alt={user?.name || 'User'}
                              className="w-12 h-12 rounded-full border-2 border-white object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://ui-avatars.com/api/?name=' +
                                  encodeURIComponent(user?.name || 'U') + '&background=fff&color=10b981&bold=true';
                              }}
                            />
                            <div>
                              <p className="font-semibold">{user?.name || 'User'}</p>
                              <p className="text-sm text-white/80">{user?.email || 'farmer@krishiconnect.com'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <span className="text-lg">👤</span>
                            <div>
                              <p className="font-medium">My Profile</p>
                              <p className="text-xs text-slate-500">View and edit profile</p>
                            </div>
                          </Link>

                          <a
                            href="#settings"
                            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                          >
                            <span className="text-lg">⚙️</span>
                            <div>
                              <p className="font-medium">Settings</p>
                              <p className="text-xs text-slate-500">Account & preferences</p>
                            </div>
                          </a>

                          <a
                            href="#help"
                            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                          >
                            <span className="text-lg">❓</span>
                            <div>
                              <p className="font-medium">Help & Support</p>
                              <p className="text-xs text-slate-500">Get assistance</p>
                            </div>
                          </a>

                          <div className="border-t border-slate-100 my-2" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                          >
                            <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
                            <div className="text-left">
                              <p className="font-medium">Logout</p>
                              <p className="text-xs text-red-500/70">Sign out of your account</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isScrolled
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <span>🔐</span>
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white/90 hover:bg-white/10'
                }`}
                aria-label="Toggle menu"
              >
                <svg className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t transition-all duration-300 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border-slate-200'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}>
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive(link.to)
                      ? isScrolled
                        ? 'bg-emerald-100 text-emerald-700 font-semibold'
                        : 'bg-white/20 text-white font-semibold'
                      : isScrolled
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-white/90 hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className={`border-t my-2 ${isScrolled ? 'border-slate-200' : 'border-white/20'}`} />
                  {authNavLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                        isActive(link.to)
                          ? isScrolled
                            ? 'bg-emerald-100 text-emerald-700 font-semibold'
                            : 'bg-white/20 text-white font-semibold'
                          : isScrolled
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-white/90 hover:bg-white/10'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}

                  <Link
                    to="/profile"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                      isScrolled
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-2xl">👤</span>
                    <span className="font-medium">Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group font-medium ${
                      isScrolled
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-red-200 hover:bg-red-500/20'
                    }`}
                  >
                    <span className="text-2xl">🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <div className={`border-t my-2 ${isScrolled ? 'border-slate-200' : 'border-white/20'}`} />
                  <Link
                    to="/login"
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>🔐</span>
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16 lg:h-20" />

      {/* Global animations */}
      <style>{`
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
}

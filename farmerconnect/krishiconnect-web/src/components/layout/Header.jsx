import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          KrishiConnect
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/market" className="hover:underline">Market</Link>
          <Link to="/weather" className="hover:underline">Weather</Link>
          <Link to="/qa" className="hover:underline">Q&A</Link>

          {isAuthenticated ? (
            <>
              <Link to="/feed" className="hover:underline">Feed</Link>
              <Link to="/chat" className="hover:underline">Chat</Link>
              <Link to="/profile" className="flex items-center gap-2">
                <img
                  src={user?.avatar?.url || '/default-avatar.png'}
                  alt=""
                  className="w-8 h-8 rounded-full bg-white/20 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'U');
                  }}
                />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-white/20 hover:bg-white/30">
                Login
              </Link>
              <Link to="/register" className="px-3 py-1 rounded bg-white text-primary-600 hover:bg-white/90">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

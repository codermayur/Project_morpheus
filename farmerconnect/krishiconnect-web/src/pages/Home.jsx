import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
          🌾 KrishiConnect
        </h1>
        <p className="text-xl text-stone-600 mb-2">
          किसानों का सोशल प्लेटफॉर्म
        </p>
        <p className="text-stone-500 mb-12 max-w-2xl mx-auto">
          Connect with fellow farmers, get expert advice, real-time mandi prices,
          weather alerts, and share your farming journey.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link
            to={isAuthenticated ? '/feed' : '/register'}
            className="btn-primary text-lg px-8 py-3"
          >
            {isAuthenticated ? 'Go to Feed' : 'Get Started'}
          </Link>
          <Link to="/market" className="btn-secondary text-lg px-8 py-3">
            Market Prices
          </Link>
          <Link to="/weather" className="btn-secondary text-lg px-8 py-3">
            Weather
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="card">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-lg mb-2">Connect</h3>
            <p className="text-stone-600">
              Follow experts, share tips, and learn from the farming community.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-lg mb-2">Market Data</h3>
            <p className="text-stone-600">
              Real-time mandi prices and trends for informed selling decisions.
            </p>
          </div>
          <div className="card">
            <div className="text-3xl mb-2">🌤️</div>
            <h3 className="font-semibold text-lg mb-2">Weather Alerts</h3>
            <p className="text-stone-600">
              Hyperlocal weather forecasts and crop-specific recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

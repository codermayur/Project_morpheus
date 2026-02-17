import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import {
  ChevronRight,
  Users,
  TrendingUp,
  Cloud,
  Leaf,
  MapPin,
  Award,
  Zap
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center space-y-8 animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full border border-emerald-300">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Empowering Indian Agriculture
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="text-4xl md:text-6xl">🌾</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
                  {' '}KrishiConnect
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-emerald-900">
                किसानों का सोशल प्लेटफॉर्म
              </p>
              <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Connect with fellow farmers, get expert advice, real-time mandi prices,
                weather alerts, and grow your farming business together.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slideUp">
              <Link
                to={isAuthenticated ? '/feed' : '/register'}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {isAuthenticated ? 'Go to Feed' : 'Get Started'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/market"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <TrendingUp className="w-5 h-5" />
                Market Prices
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-12 animate-slideUp animation-delay-200">
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-emerald-600">50K+</p>
                <p className="text-sm text-stone-600">Active Farmers</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-amber-600">1000+</p>
                <p className="text-sm text-stone-600">Daily Updates</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-teal-600">24/7</p>
                <p className="text-sm text-stone-600">Support</p>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder with Animation */}
          <div className="mt-16 relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🌾</div>
                <p className="text-white text-xl font-semibold">Experience the Future of Farming</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900">
              Why Choose <span className="text-emerald-600">KrishiConnect?</span>
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Everything farmers need in one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1 */}
            <div className="group h-full bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 border border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Connect</h3>
              <p className="text-stone-600 leading-relaxed">
                Follow agricultural experts, share farming tips, and learn from a thriving community of farmers.
              </p>
              <div className="mt-4 inline-flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all">
                Learn more <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 border border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-amber-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Market Data</h3>
              <p className="text-stone-600 leading-relaxed">
                Real-time mandi prices, market trends, and price predictions to make informed selling decisions.
              </p>
              <div className="mt-4 inline-flex items-center text-amber-600 font-semibold group-hover:gap-2 transition-all">
                Explore <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group h-full bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-8 border border-cyan-200 hover:border-cyan-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-cyan-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                <Cloud className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Weather Alerts</h3>
              <p className="text-stone-600 leading-relaxed">
                Hyperlocal weather forecasts, crop-specific recommendations, and timely alerts for your region.
              </p>
              <div className="mt-4 inline-flex items-center text-cyan-600 font-semibold group-hover:gap-2 transition-all">
                Check weather <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group h-full bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-8 border border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-orange-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Smart Tools</h3>
              <p className="text-stone-600 leading-relaxed">
                AI-powered crop recommendations, pest detection, and personalized farming guidance.
              </p>
              <div className="mt-4 inline-flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                Try now <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-stone-900 mb-16">
            Get Started in <span className="text-emerald-600">3 Simple Steps</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line - Hidden on Mobile */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 -z-10"></div>

            {/* Step 1 */}
            <div className="relative text-center animate-fadeIn">
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg hover:shadow-2xl transition-shadow">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Sign Up</h3>
              <p className="text-stone-600">
                Create your account in seconds with your phone number or email address.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center animate-fadeIn animation-delay-200">
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg hover:shadow-2xl transition-shadow">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Build Profile</h3>
              <p className="text-stone-600">
                Add your farming details, crops, location, and connect with the community.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center animate-fadeIn animation-delay-400">
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg hover:shadow-2xl transition-shadow">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Start Growing</h3>
              <p className="text-stone-600">
                Access market data, weather alerts, expert advice, and grow your business.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to={isAuthenticated ? '/feed' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isAuthenticated ? 'Go to Feed' : 'Get Started Now'}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-stone-900 mb-16">
            Trusted by Farmers Across <span className="text-emerald-600">India</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-8 border border-emerald-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-stone-700 mb-6 leading-relaxed">
                "KrishiConnect has completely transformed my farming business. The real-time market prices help me sell my produce at the best rates."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  RK
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Rajesh Kumar</p>
                  <p className="text-sm text-stone-600">Farmer, Punjab</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-8 border border-amber-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-stone-700 mb-6 leading-relaxed">
                "The weather alerts are incredibly accurate. I've saved my entire crop multiple times thanks to timely notifications."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  PM
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Priya Mishra</p>
                  <p className="text-sm text-stone-600">Farmer, Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-8 border border-teal-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-stone-700 mb-6 leading-relaxed">
                "Being part of this farming community has given me access to knowledge and resources I never thought possible."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Amit Singh</p>
                  <p className="text-sm text-stone-600">Farmer, Haryana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Transform Your Farming Journey?
          </h2>
          <p className="text-xl text-emerald-50">
            Join thousands of farmers already benefiting from KrishiConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to={isAuthenticated ? '/feed' : '/register'}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isAuthenticated ? 'Go to Feed' : 'Get Started Free'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/market"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg border-2 border-white hover:border-emerald-200 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <MapPin className="w-5 h-5" />
              Explore Market
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Features */}
      <section className="py-16 px-4 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                KrishiConnect
              </h4>
              <p className="text-stone-400 text-sm">Empowering farmers with technology and community.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-stone-400 text-sm">
                <li><Link to="/market" className="hover:text-emerald-400 transition">Market Prices</Link></li>
                <li><Link to="/weather" className="hover:text-emerald-400 transition">Weather</Link></li>
                <li><Link to="/feed" className="hover:text-emerald-400 transition">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700 pt-8">
            <p className="text-center text-stone-400 text-sm">
              © 2026 KrishiConnect. All rights reserved. Made with ❤️ for farmers.
            </p>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

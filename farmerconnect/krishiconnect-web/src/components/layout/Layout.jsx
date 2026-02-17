import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <main className="flex-1 w-full">
        {/* Decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Top gradient blur */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Page transition animation wrapper */}
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer
      <footer className="relative z-10 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🌾</span>
                <h3 className="text-xl font-bold text-slate-900">KrishiConnect</h3>
              </div>
              <p className="text-sm text-slate-600">
                Connecting farmers to markets, weather, and knowledge.
              </p>
            </div>

            {/* Quick Links
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/market" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    Market
                  </a>
                </li>
                <li>
                  <a href="/weather" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    Weather
                  </a>
                </li>
                <li>
                  <a href="/qa" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    Q&A
                  </a>
                </li>
              </ul>
            </div>

            {/* Support
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#help" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#feedback" className="text-slate-600 hover:text-primary-600 transition-colors duration-200">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            {/* Social
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Connect</h4>
              <div className="flex gap-3">
                <a
                  href="#twitter"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200/50 hover:bg-primary-600 text-slate-600 hover:text-white transition-all duration-200 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 2 3.5 2.5c2 0 3.5-1 3.5-1" />
                  </svg>
                </a>
                <a
                  href="#facebook"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200/50 hover:bg-primary-600 text-slate-600 hover:text-white transition-all duration-200 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href="#instagram"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200/50 hover:bg-primary-600 text-slate-600 hover:text-white transition-all duration-200 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="currentColor"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Divider
          <div className="border-t border-slate-200/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
              <p>&copy; 2026 KrishiConnect. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#privacy" className="hover:text-primary-600 transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#terms" className="hover:text-primary-600 transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#cookies" className="hover:text-primary-600 transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all duration-300 flex items-center justify-center transform ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Global styles with animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        /* Selection styling */
        ::selection {
          background-color: rgba(59, 130, 246, 0.2);
          color: inherit;
        }
      `}</style>
    </div>
  );
}

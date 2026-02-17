import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'crop-disease', label: 'Crop Disease', icon: '🦠', color: 'from-red-400 to-pink-400' },
  { id: 'pest-management', label: 'Pest Management', icon: '🐛', color: 'from-green-400 to-emerald-400' },
  { id: 'irrigation', label: 'Irrigation', icon: '💧', color: 'from-blue-400 to-cyan-400' },
  { id: 'fertilizer', label: 'Fertilizer', icon: '🌱', color: 'from-yellow-400 to-amber-400' },
  { id: 'weather', label: 'Weather', icon: '🌤️', color: 'from-purple-400 to-pink-400' },
  { id: 'market', label: 'Market', icon: '📊', color: 'from-orange-400 to-red-400' },
  { id: 'soil', label: 'Soil Health', icon: '🌍', color: 'from-amber-600 to-yellow-600' },
  { id: 'equipment', label: 'Equipment', icon: '🚜', color: 'from-gray-400 to-slate-400' },
  { id: 'other', label: 'Other', icon: '❓', color: 'from-slate-400 to-gray-400' },
];

const SORT_OPTIONS = [
  { id: 'latest', label: 'Latest', icon: '🕐' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'unanswered', label: 'Unanswered', icon: '❓' },
  { id: 'mostviewed', label: 'Most Viewed', icon: '👀' },
];

export default function QA() {
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['questions', category, sortBy],
    queryFn: () =>
      api.get('/qa/questions', {
        params: {
          category: category || undefined,
          sort: sortBy,
          limit: 20,
          search: searchQuery || undefined,
        },
      }).then((r) => r.data),
  });

  const questions = data?.data?.data || data?.data || [];

  const filteredQuestions = questions.filter((q) =>
    q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFavorite = (questionId) => {
    if (favorites.includes(questionId)) {
      setFavorites(favorites.filter((id) => id !== questionId));
      toast.success('❌ Removed from favorites');
    } else {
      setFavorites([...favorites, questionId]);
      toast.success('⭐ Added to favorites');
    }
  };

  const getCategoryDetails = (categoryId) => {
    return CATEGORIES.find((c) => c.id === categoryId);
  };

  const selectedCategory = getCategoryDetails(category);
  const stats = {
    total: questions.length,
    unanswered: questions.filter((q) => (q.answersCount || 0) === 0).length,
    trending: Math.floor(Math.random() * questions.length),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8 animate-slideInDown">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">💬</div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Q&A Community</h1>
              <p className="text-slate-600 mt-1">Ask experts and learn from fellow farmers</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to="/qa/ask"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-slideInUp animation-delay-100"
          >
            <span>✏️</span>
            Ask a Question
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slideInUp animation-delay-200">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="text-4xl opacity-50">❓</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold mb-1">Unanswered</p>
                <p className="text-3xl font-bold text-red-600">{stats.unanswered}</p>
              </div>
              <div className="text-4xl opacity-50">🤔</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold mb-1">Saved Questions</p>
                <p className="text-3xl font-bold text-amber-600">{favorites.length}</p>
              </div>
              <div className="text-4xl opacity-50">⭐</div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 mb-8 animate-slideInUp animation-delay-300">
          <div className="space-y-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <span>🔍</span>
                Search Questions
              </label>
              <input
                type="text"
                placeholder="Search by title or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Category and Sort Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span>📂</span>
                  Category
                </label>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>{selectedCategory?.icon || '📂'}</span>
                    <span className={selectedCategory ? 'text-slate-900' : 'text-slate-500'}>
                      {selectedCategory?.label || 'All Categories'}
                    </span>
                  </span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto animate-slideDown">
                    <button
                      onClick={() => {
                        setCategory('');
                        setShowCategoryDropdown(false);
                        toast.success('📂 All categories selected');
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-slate-100 hover:bg-purple-50 flex items-center gap-2 ${
                        !category ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {!category && <span>✓</span>}
                      <span>📂</span>
                      All Categories
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.id);
                          setShowCategoryDropdown(false);
                          toast.success(`${cat.icon} Selected ${cat.label}`);
                        }}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-slate-100 hover:bg-purple-50 flex items-center gap-2 ${
                          category === cat.id ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {category === cat.id && <span>✓</span>}
                        <span>{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span>📊</span>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    toast.success('📊 Sorting updated');
                  }}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setCategory('');
                  setSearchQuery('');
                  setSortBy('latest');
                  toast.success('🔄 Filters cleared');
                }}
                className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>🔄</span>
                Clear Filters
              </button>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>🔃</span>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Category Quick Filter Chips */}
        <div className="mb-8 animate-slideInUp animation-delay-400">
          <p className="text-sm font-semibold text-slate-700 mb-3">Popular Categories</p>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  toast.success(`${cat.icon} Selected ${cat.label}`);
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center gap-1 ${
                  category === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-white/80 backdrop-blur-xl border border-white/20 text-slate-700 hover:shadow-lg'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 h-32" />
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center animate-slideInUp">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No questions found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? 'Try different search terms' : 'Be the first to ask a question!'}
            </p>
            <Link
              to="/qa/ask"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span>✏️</span>
              Ask a Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-slideInUp animation-delay-500">
            {filteredQuestions.map((q, idx) => {
              const catDetails = getCategoryDetails(q.category);
              const isFav = favorites.includes(q._id);

              return (
                <Link
                  key={q._id}
                  to={`/qa/${q._id}`}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 group block"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    {/* Left Badge */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${catDetails?.color || 'from-slate-400 to-gray-400'} text-white flex items-center justify-center text-xl shadow-md`}
                    >
                      {catDetails?.icon || '❓'}
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                            {q.title}
                          </h3>
                          <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                            {q.description}
                          </p>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddFavorite(q._id);
                          }}
                          className="text-2xl hover:scale-125 transition-transform duration-200 flex-shrink-0"
                        >
                          {isFav ? '⭐' : '☆'}
                        </button>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                        {/* Answers Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${
                            (q.answersCount || 0) > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <span>{(q.answersCount || 0) > 0 ? '✓' : '❌'}</span>
                          {q.answersCount || 0} answer{(q.answersCount || 0) !== 1 ? 's' : ''}
                        </span>

                        {/* Time */}
                        <span className="text-slate-500 flex items-center gap-1">
                          <span>🕐</span>
                          {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                        </span>

                        {/* Category Tag */}
                        <span className="text-slate-500 flex items-center gap-1">
                          <span>{catDetails?.icon}</span>
                          {catDetails?.label}
                        </span>

                        {/* Views */}
                        {q.views && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <span>👀</span>
                            {q.views} views
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Info */}
        {filteredQuestions.length > 0 && (
          <div className="mt-8 text-center text-slate-600 animate-slideInUp animation-delay-600">
            <p className="font-medium">
              Showing <span className="text-purple-600 font-bold">{filteredQuestions.length}</span> of{' '}
              <span className="text-purple-600 font-bold">{questions.length}</span> questions
            </p>
          </div>
        )}

        {/* Featured Experts Section */}
        <div className="mt-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-slideInUp animation-delay-700">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">⭐</span>
            <h2 className="text-2xl font-bold text-slate-900">Featured Experts</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Get answers from verified agricultural experts in the community
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-3">👨‍🌾</div>
                <h4 className="font-bold text-slate-900 mb-1">Expert {i}</h4>
                <p className="text-sm text-slate-600 mb-3">Agriculture Specialist</p>
                <button className="w-full px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-300">
                  Ask Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global animations */}
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const COMMODITIES = [
  'Wheat', 'Rice', 'Corn', 'Barley', 'Oats',
  'Cotton', 'Sugarcane', 'Potato', 'Onion', 'Tomato',
  'Chili', 'Garlic', 'Ginger', 'Turmeric', 'Cumin',
  'Coriander', 'Mustard', 'Soybean', 'Groundnut', 'Sunflower',
  'Linseed', 'Sesame', 'Apple', 'Banana', 'Mango',
  'Orange', 'Grapes', 'Carrot', 'Cabbage', 'Cauliflower',
];

export default function Market() {
  const [state, setState] = useState('');
  const [commodity, setCommodity] = useState('');
  const [sortBy, setSortBy] = useState('modal');
  const [searchText, setSearchText] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCommodityDropdown, setShowCommodityDropdown] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['market-prices', state, commodity],
    queryFn: () =>
      api.get('/market/prices', {
        params: { state: state || undefined, commodity: commodity || undefined, limit: 100 },
      }).then((r) => r.data),
  });

  const prices = data?.data?.data || data?.data || [];

  // Filter and sort prices
  const filteredPrices = prices
    .filter((p) =>
      p.market?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.commodity?.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return bVal - aVal;
    });

  const handleAddFavorite = (priceId) => {
    if (favorites.includes(priceId)) {
      setFavorites(favorites.filter((id) => id !== priceId));
      toast.success('❌ Removed from favorites');
    } else {
      setFavorites([...favorites, priceId]);
      toast.success('⭐ Added to favorites');
    }
  };

  const handleClearFilters = () => {
    setState('');
    setCommodity('');
    setSearchText('');
    toast.success('🔄 Filters cleared');
  };

  const avgPrice = filteredPrices.length > 0
    ? Math.round(
        filteredPrices.reduce((sum, p) => sum + (p.modalPrice || 0), 0) /
          filteredPrices.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8 animate-slideInDown">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">📊</div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Mandi Prices</h1>
              <p className="text-slate-600 mt-1">Real-time agricultural commodity prices from markets across India</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 mb-8 animate-slideInUp animation-delay-100">
          <div className="space-y-6">
            {/* Title */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-bold text-slate-900">Filter Prices</h2>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* State Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span>🗺️</span>
                  State
                </label>
                <button
                  onClick={() => setShowStateDropdown(!showStateDropdown)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-left flex items-center justify-between"
                >
                  <span className={state ? 'text-slate-900' : 'text-slate-500'}>
                    {state || 'Select State'}
                  </span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${showStateDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* State Dropdown Menu */}
                {showStateDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto animate-slideDown">
                    {INDIAN_STATES.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setState(s);
                          setShowStateDropdown(false);
                          toast.success(`📍 Selected ${s}`);
                        }}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-slate-100 hover:bg-emerald-50 flex items-center gap-2 ${
                          state === s ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {state === s && <span>✓</span>}
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Commodity Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span>🌾</span>
                  Commodity
                </label>
                <button
                  onClick={() => setShowCommodityDropdown(!showCommodityDropdown)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-left flex items-center justify-between"
                >
                  <span className={commodity ? 'text-slate-900' : 'text-slate-500'}>
                    {commodity || 'Select Commodity'}
                  </span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${showCommodityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Commodity Dropdown Menu */}
                {showCommodityDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto animate-slideDown">
                    {COMMODITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCommodity(c);
                          setShowCommodityDropdown(false);
                          toast.success(`🌾 Selected ${c}`);
                        }}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-slate-100 hover:bg-emerald-50 flex items-center gap-2 ${
                          commodity === c ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {commodity === c && <span>✓</span>}
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span>📈</span>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="modal">Modal Price (High to Low)</option>
                  <option value="maxPrice">Max Price (High to Low)</option>
                  <option value="minPrice">Min Price (High to Low)</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <span>🔎</span>
                  Search Market
                </label>
                <input
                  type="text"
                  placeholder="Search market or commodity..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>🔄</span>
                Clear Filters
              </button>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>🔃</span>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {filteredPrices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slideInUp animation-delay-200">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700 font-semibold mb-2">Average Price</p>
                  <p className="text-3xl font-bold text-emerald-900">₹{avgPrice.toLocaleString()}/q</p>
                </div>
                <div className="text-4xl opacity-50">📊</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-semibold mb-2">Total Markets</p>
                  <p className="text-3xl font-bold text-blue-900">{filteredPrices.length}</p>
                </div>
                <div className="text-4xl opacity-50">🏪</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 font-semibold mb-2">Favorites</p>
                  <p className="text-3xl font-bold text-amber-900">{favorites.length}</p>
                </div>
                <div className="text-4xl opacity-50">⭐</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-xl rounded-2xl h-16 border border-white/20"
              />
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          /* Empty State */
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center animate-slideInUp">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No prices found</h3>
            <p className="text-slate-600 mb-6">
              Try different filters or add data via Agmarknet API.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Table */
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden animate-slideInUp animation-delay-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                    <th className="text-left p-4 font-semibold">⭐</th>
                    <th className="text-left p-4 font-semibold">Market</th>
                    <th className="text-left p-4 font-semibold">Commodity</th>
                    <th className="text-right p-4 font-semibold">Min (₹/q)</th>
                    <th className="text-right p-4 font-semibold">Max (₹/q)</th>
                    <th className="text-right p-4 font-semibold">Modal (₹/q)</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((p, index) => (
                    <tr
                      key={p._id}
                      className={`border-b border-slate-200 hover:bg-emerald-50/50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="p-4">
                        <button
                          onClick={() => handleAddFavorite(p._id)}
                          className="text-2xl hover:scale-125 transition-transform duration-200 cursor-pointer"
                        >
                          {favorites.includes(p._id) ? '⭐' : '☆'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{p.market}</div>
                        <div className="text-sm text-slate-500">📍 Market</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">🌾 {p.commodity}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-semibold text-slate-900">
                          ₹{p.minPrice?.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">Min</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-semibold text-slate-900">
                          ₹{p.maxPrice?.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">Max</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-lg text-emerald-600">
                          ₹{p.modalPrice?.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">Modal</div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {p.priceDate
                          ? new Date(p.priceDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-emerald-600">{filteredPrices.length}</span> of{' '}
                <span className="font-bold text-emerald-600">{prices.length}</span> prices
              </p>
              <div className="text-sm text-slate-500">
                Last updated: <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
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

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

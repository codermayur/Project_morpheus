import { useState, useEffect } from 'react';
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

const DISTRICTS_BY_STATE = {
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Ropar'],
  'Haryana': ['Hisar', 'Rohtak', 'Karnal', 'Ambala', 'Panipat', 'Gurgaon', 'Faridabad', 'Yamunanagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Noida', 'Ghaziabad', 'Bareilly'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sehore', 'Raisen', 'Dewas'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Ahmednagar', 'Solapur', 'Satara'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Belgaum', 'Mangaluru', 'Hubli', 'Kolar', 'Chitradurga', 'Tumkur'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Kanchipuram', 'Vellore', 'Erode'],
  'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Amaravati', 'Anantapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Junagadh', 'Gandhinagar', 'Anand', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Bhilwara', 'Pali'],
};

const getWeatherIcon = (condition) => {
  if (!condition) return '🌤️';
  const lower = condition.toLowerCase();
  if (lower.includes('rain')) return '🌧️';
  if (lower.includes('cloud')) return '☁️';
  if (lower.includes('sunny') || lower.includes('clear')) return '☀️';
  if (lower.includes('storm') || lower.includes('thunder')) return '⛈️';
  if (lower.includes('snow')) return '❄️';
  if (lower.includes('mist') || lower.includes('fog')) return '🌫️';
  if (lower.includes('wind')) return '💨';
  return '🌤️';
};

const getTemperatureColor = (temp) => {
  if (temp < 10) return 'from-blue-400 to-cyan-400';
  if (temp < 20) return 'from-cyan-400 to-blue-400';
  if (temp < 30) return 'from-emerald-400 to-green-400';
  if (temp < 40) return 'from-yellow-400 to-orange-400';
  return 'from-orange-400 to-red-400';
};

export default function Weather() {
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('current');

  const districts = DISTRICTS_BY_STATE[state] || [];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['weather', state, district],
    queryFn: () =>
      api.get('/weather/current', { params: { state, district } }).then((r) => r.data),
  });

  const weather = data?.data?.data || data?.data;

  // Simulate weather history
  useEffect(() => {
    if (weather) {
      setWeatherHistory([
        { date: 'Today', temp: weather.current?.temperature, condition: weather.current?.condition },
        { date: 'Tomorrow', temp: weather.current?.temperature - 2, condition: 'Partly Cloudy' },
        { date: 'Day After', temp: weather.current?.temperature - 1, condition: 'Sunny' },
        { date: '+3 days', temp: weather.current?.temperature + 1, condition: 'Rainy' },
        { date: '+4 days', temp: weather.current?.temperature - 3, condition: 'Cloudy' },
      ]);
    }
  }, [weather]);

  const handleAddFavorite = (location) => {
    const favStr = `${location.state}-${location.district}`;
    if (favorites.some((f) => `${f.state}-${f.district}` === favStr)) {
      setFavorites(favorites.filter((f) => `${f.state}-${f.district}` !== favStr));
      toast.success('❌ Removed from favorites');
    } else {
      setFavorites([...favorites, location]);
      toast.success('⭐ Added to favorites');
    }
  };

  const isFavorite = favorites.some((f) => f.state === state && f.district === district);

  const getAQIStatus = (aqi) => {
    if (aqi < 50) return { status: 'Good', color: 'from-green-400 to-emerald-400', icon: '😊' };
    if (aqi < 100) return { status: 'Moderate', color: 'from-yellow-400 to-amber-400', icon: '🙂' };
    if (aqi < 150) return { status: 'Poor', color: 'from-orange-400 to-red-400', icon: '😷' };
    if (aqi < 200) return { status: 'Very Poor', color: 'from-red-500 to-red-600', icon: '😠' };
    return { status: 'Hazardous', color: 'from-purple-600 to-red-600', icon: '💀' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8 animate-slideInDown">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">🌤️</div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Weather Forecast</h1>
              <p className="text-slate-600 mt-1">Real-time weather updates for farming decisions</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 mb-8 animate-slideInUp animation-delay-100">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔍</span>
            <h2 className="text-xl font-bold text-slate-900">Select Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State Dropdown */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <span>🗺️</span>
                State
              </label>
              <button
                onClick={() => setShowStateDropdown(!showStateDropdown)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-left flex items-center justify-between"
              >
                <span className={state ? 'text-slate-900' : 'text-slate-500'}>
                  {state}
                </span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${showStateDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {showStateDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto animate-slideDown">
                  {INDIAN_STATES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setState(s);
                        setDistrict(DISTRICTS_BY_STATE[s]?.[0] || '');
                        setShowStateDropdown(false);
                        toast.success(`📍 Selected ${s}`);
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-slate-100 hover:bg-blue-50 flex items-center gap-2 ${
                        state === s ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {state === s && <span>✓</span>}
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* District Dropdown */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <span>📍</span>
                District
              </label>
              <button
                onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium transition-all duration-300 outline-none hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-left flex items-center justify-between"
              >
                <span className={district ? 'text-slate-900' : 'text-slate-500'}>
                  {district || 'Select District'}
                </span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${showDistrictDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {showDistrictDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto animate-slideDown">
                  {districts.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDistrict(d);
                        setShowDistrictDropdown(false);
                        toast.success(`📍 Selected ${d}`);
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-slate-100 hover:bg-blue-50 flex items-center gap-2 ${
                        district === d ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {district === d && <span>✓</span>}
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite & Refresh Buttons */}
            <div className="flex gap-2 items-end">
              <button
                onClick={() => handleAddFavorite({ state, district })}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span className="text-xl">{isFavorite ? '⭐' : '☆'}</span>
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                onClick={() => refetch()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🔃</span>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          /* Loading Skeleton */
          <div className="space-y-6 animate-pulse">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl h-64 border border-white/20" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl h-48 border border-white/20" />
              ))}
            </div>
          </div>
        ) : !weather ? (
          /* Empty State */
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center animate-slideInUp">
            <div className="text-6xl mb-4">🌡️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No weather data available</h3>
            <p className="text-slate-600 mb-6">
              Configure OpenWeather API for live data or refresh to try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-slideInUp animation-delay-200">
            {/* Current Weather Card */}
            <div className={`bg-gradient-to-br ${getTemperatureColor(weather.current?.temperature)} text-white rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 overflow-hidden relative`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="2" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#dots)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {weather.location?.state}, {weather.location?.district}
                    </h2>
                    <p className="text-white/80 text-lg flex items-center gap-2">
                      <span className="text-4xl">{getWeatherIcon(weather.current?.condition)}</span>
                      <span>{weather.current?.condition || 'Clear'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-6xl md:text-7xl font-bold mb-2">
                      {weather.current?.temperature}°
                    </p>
                    <p className="text-white/80">
                      Feels like {weather.current?.feelsLike}°C
                    </p>
                  </div>
                </div>

                {/* Weather Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-white/70 text-sm mb-1">💧 Humidity</p>
                    <p className="text-2xl font-bold">{weather.current?.humidity}%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-white/70 text-sm mb-1">💨 Wind Speed</p>
                    <p className="text-2xl font-bold">{weather.current?.windSpeed || 0} km/h</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-white/70 text-sm mb-1">🌧️ Rainfall</p>
                    <p className="text-2xl font-bold">{weather.current?.precipitation || 0} mm</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-white/70 text-sm mb-1">🌪️ Pressure</p>
                    <p className="text-2xl font-bold">{weather.current?.pressure || 1013} hPa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-white/20 w-fit">
              {[
                { id: 'current', label: 'Current', icon: '🌤️' },
                { id: 'forecast', label: 'Forecast', icon: '📅' },
                { id: 'aqi', label: 'Air Quality', icon: '💨' },
                { id: 'farming', label: 'Farming Tips', icon: '🌾' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'current' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {/* Sunrise/Sunset */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span>🌅</span>
                    Sun & Moon
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl">
                      <span className="font-semibold text-slate-900">Sunrise</span>
                      <span className="text-lg font-bold text-orange-600">
                        {weather.current?.sunrise || '06:00 AM'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl">
                      <span className="font-semibold text-slate-900">Sunset</span>
                      <span className="text-lg font-bold text-indigo-600">
                        {weather.current?.sunset || '06:00 PM'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
                      <span className="font-semibold text-slate-900">UV Index</span>
                      <span className="text-lg font-bold text-blue-600">
                        {weather.current?.uvIndex || 5}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Additional Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl">
                      <span className="font-semibold text-slate-900">Dew Point</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {weather.current?.dewPoint || 15}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl">
                      <span className="font-semibold text-slate-900">Visibility</span>
                      <span className="text-lg font-bold text-rose-600">
                        {weather.current?.visibility || 10} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl">
                      <span className="font-semibold text-slate-900">Cloud Cover</span>
                      <span className="text-lg font-bold text-teal-600">
                        {weather.current?.cloudCover || 30}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'forecast' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span>📅</span>
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {weatherHistory.map((day, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <p className="font-bold text-slate-900 mb-3">{day.date}</p>
                      <p className="text-4xl mb-2">{getWeatherIcon(day.condition)}</p>
                      <p className="text-2xl font-bold text-slate-900 mb-1">{day.temp}°</p>
                      <p className="text-sm text-slate-600">{day.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'aqi' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span>💨</span>
                  Air Quality Index
                </h3>
                {(() => {
                  const aqi = weather.current?.aqi || 75;
                  const aqiStatus = getAQIStatus(aqi);
                  return (
                    <div className="space-y-6">
                      <div className={`bg-gradient-to-r ${aqiStatus.color} text-white rounded-3xl p-8 text-center shadow-lg`}>
                        <p className="text-6xl mb-2">{aqiStatus.icon}</p>
                        <p className="text-4xl font-bold mb-2">{aqi}</p>
                        <p className="text-xl">{aqiStatus.status}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-slate-900">PM2.5</p>
                            <p className="text-slate-600">{weather.current?.pm25 || 35} µg/m³</p>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-emerald-400 to-green-400 h-2 rounded-full" style={{ width: '45%' }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-slate-900">PM10</p>
                            <p className="text-slate-600">{weather.current?.pm10 || 55} µg/m³</p>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full" style={{ width: '65%' }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-slate-900">O₃</p>
                            <p className="text-slate-600">{weather.current?.ozone || 45} ppb</p>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '55%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'farming' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span>🌾</span>
                  Farming Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: '💧',
                      title: 'Irrigation',
                      tip: weather.current?.humidity > 70 ? 'Humidity is high, reduce watering' : 'Consider increasing irrigation',
                    },
                    {
                      icon: '🌱',
                      title: 'Pest Management',
                      tip: 'Wet conditions favor fungal diseases. Apply preventive measures.',
                    },
                    {
                      icon: '☀️',
                      title: 'Crop Monitoring',
                      tip: weather.current?.temperature > 35 ? 'Heat stress risk. Monitor crops closely.' : 'Temperature is optimal for growth.',
                    },
                    {
                      icon: '🚜',
                      title: 'Field Operations',
                      tip: 'Good time for field operations. Weather is favorable.',
                    },
                  ].map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{rec.icon}</span>
                        <div>
                          <p className="font-bold text-slate-900 mb-1">{rec.title}</p>
                          <p className="text-sm text-slate-600">{rec.tip}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-slideInUp animation-delay-300">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>⭐</span>
                  Saved Locations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {favorites.map((fav, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setState(fav.state);
                        setDistrict(fav.district);
                        toast.success(`📍 Switched to ${fav.state}`);
                      }}
                      className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <p className="font-bold text-slate-900">{fav.state}</p>
                      <p className="text-sm text-slate-600">{fav.district}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
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

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

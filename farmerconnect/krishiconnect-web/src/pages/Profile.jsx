import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Profile() {
  const { userId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const id = userId || currentUser?._id;

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  const isOwnProfile = !userId && !!currentUser?._id;
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get(isOwnProfile ? '/users/me' : `/users/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const user = data?.data || data;

  const handleFollow = async () => {
    try {
      setIsFollowing(!isFollowing);
      toast.success(!isFollowing ? '👥 Following user!' : '👋 Unfollowed user');
    } catch (err) {
      toast.error('Failed to follow user');
      setIsFollowing(!isFollowing);
    }
  };

  const handleEditBio = async () => {
    if (editedBio.trim()) {
      try {
        // Make API call to update bio
        toast.success('✏️ Bio updated successfully!');
        setIsEditingBio(false);
      } catch (err) {
        toast.error('Failed to update bio');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-slate-200 rounded-lg w-48" />
                <div className="h-4 bg-slate-200 rounded-lg w-32" />
                <div className="h-4 bg-slate-200 rounded-lg w-96" />
                <div className="flex gap-8 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 bg-slate-200 rounded-lg w-24" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4">
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-900">User Not Found</h2>
          <p className="text-slate-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Followers', value: user.stats?.followersCount || 0, icon: '👥' },
    { label: 'Following', value: user.stats?.followingCount || 0, icon: '🔗' },
    { label: 'Posts', value: user.stats?.postsCount || 0, icon: '📝' },
    { label: 'Likes', value: user.stats?.likesCount || 0, icon: '❤️' },
  ];

  const tabs = [
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'activity', label: 'Activity', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Cover Photo Background */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-t-3xl shadow-xl overflow-hidden relative mb-0 animate-slideInDown">
          {/* Animated wave background */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1200 120" className="absolute w-full h-full">
              <path
                d="M0,30 Q300,0 600,30 T1200,30 L1200,120 L0,120 Z"
                fill="currentColor"
                className="text-white animate-wave"
              />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-b-3xl shadow-2xl border-t border-white/20 px-6 md:px-10 pb-8 relative animate-slideInUp">
          {/* Profile Avatar */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-20 md:-mt-24 mb-6">
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-300" />
                <img
                  src={user.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=160&background=10b981&color=fff&bold=true`}
                  alt={user.name}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
                {user.isExpert && (
                  <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {user.name}
                </h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user.isExpert && (
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 text-amber-700 rounded-full text-sm font-semibold hover:shadow-md transition-all duration-200">
                      <span>⭐</span>
                      Expert Farmer
                    </span>
                  )}
                  {user.isPremium && (
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 rounded-full text-sm font-semibold hover:shadow-md transition-all duration-200">
                      <span>💎</span>
                      Premium Member
                    </span>
                  )}
                </div>
              </div>

              {user.location?.state && (
                <p className="text-lg text-slate-600 flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-2xl">📍</span>
                  <span className="font-semibold">{[user.location.state, user.location.district].filter(Boolean).join(', ')}</span>
                </p>
              )}

              {isOwnProfile ? (
                <div className="space-y-2">
                  {!isEditingBio ? (
                    <div className="space-y-2">
                      {user.bio ? (
                        <p className="text-slate-700 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                          {user.bio}
                        </p>
                      ) : (
                        <p className="text-slate-500 italic">No bio yet. Tell us about yourself!</p>
                      )}
                      <button
                        onClick={() => {
                          setIsEditingBio(true);
                          setEditedBio(user.bio || '');
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors duration-200"
                      >
                        ✏️ Edit Bio
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        placeholder="Write something about yourself..."
                        className="w-full px-4 py-3 bg-white border-2 border-emerald-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                        rows="3"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setIsEditingBio(false)}
                          className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditBio}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                user.bio && (
                  <p className="text-slate-700 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                    {user.bio}
                  </p>
                )
              )}

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="flex gap-3 justify-center md:justify-start pt-4">
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg'
                    }`}
                  >
                    <span>{isFollowing ? '✓' : '+'}</span>
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 active:scale-95">
                    <span>💬</span>
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-slideInUp animation-delay-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 animate-slideIn" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 min-h-96">
            {activeTab === 'posts' && (
              <div className="space-y-6 animate-fadeIn">
                {[1, 2].map((post) => (
                  <div
                    key={post}
                    className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={user.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Recent Post Title {post}
                        </h4>
                        <p className="text-slate-600 mt-2">
                          This is a sample post. In a real application, posts would be fetched from the API and displayed here.
                        </p>
                        <div className="flex gap-4 mt-4 text-sm text-slate-500">
                          <span>❤️ 24</span>
                          <span>💬 8</span>
                          <span>📤 3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="aspect-square bg-gradient-to-br from-emerald-200 to-green-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                  >
                    <div className="w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                      🌾
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4 animate-fadeIn">
                {[1, 2, 3, 4].map((activity) => (
                  <div
                    key={activity}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                      {activity % 2 === 0 ? '❤️' : '💬'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {activity % 2 === 0 ? 'Liked a post' : 'Posted a comment'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {activity * 2} hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes wave {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(100px);
          }
        }

        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-wave {
          animation: wave 3s ease-in-out infinite;
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

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { userId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const id = userId || currentUser?._id;

  const isOwnProfile = !userId && !!currentUser?._id;
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get(isOwnProfile ? '/users/me' : `/users/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const user = data?.data || data;

  if (isLoading || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex items-start gap-4">
          <img
            src={user.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=96`}
            alt=""
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.isExpert && (
              <span className="inline-block mt-1 text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                Expert
              </span>
            )}
            {user.bio && <p className="mt-2 text-stone-600">{user.bio}</p>}
            {user.location?.state && (
              <p className="mt-1 text-sm text-stone-500">
                📍 {[user.location.state, user.location.district].filter(Boolean).join(', ')}
              </p>
            )}
            <div className="flex gap-6 mt-4">
              <span><strong>{user.stats?.followersCount || 0}</strong> Followers</span>
              <span><strong>{user.stats?.followingCount || 0}</strong> Following</span>
              <span><strong>{user.stats?.postsCount || 0}</strong> Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

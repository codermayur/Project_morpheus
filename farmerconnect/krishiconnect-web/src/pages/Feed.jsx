import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import PostCard from '../components/post/PostCard';
import PostCreate from '../components/post/PostCreate';

export default function Feed() {
  const [filter, setFilter] = useState('following');

  const { data, isLoading } = useQuery({
    queryKey: ['feed', filter],
    queryFn: () => postService.getFeed({ filter, page: 1, limit: 20 }),
  });

  const posts = data?.data || [];
  const pagination = data?.meta?.pagination;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PostCreate onSuccess={() => window.location.reload()} />

      <div className="flex gap-2 mb-4">
        {['following', 'latest', 'trending'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-48" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-12 text-stone-500">
          No posts yet. Follow farmers to see their posts, or create your first post!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

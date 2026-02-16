import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { postService } from '../../services/post.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const queryClient = useQueryClient();
  const author = post.author;

  const likeMutation = useMutation({
    mutationFn: () => postService.like(post._id),
    onSuccess: () => queryClient.invalidateQueries(['feed']),
  });

  const unlikeMutation = useMutation({
    mutationFn: () => postService.unlike(post._id),
    onSuccess: () => queryClient.invalidateQueries(['feed']),
  });

  const handleLike = () => {
    if (post.isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <article className="card">
      <div className="flex gap-3 mb-3">
        <Link to={`/profile/${author?._id}`}>
          <img
            src={author?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'U')}`}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${author?._id}`} className="font-semibold hover:underline">
            {author?.name}
          </Link>
          {author?.isExpert && (
            <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">Expert</span>
          )}
          <p className="text-sm text-stone-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {post.content?.text && (
        <p className="mb-3 whitespace-pre-wrap">{post.content.text}</p>
      )}

      {post.media?.length > 0 && (
        <div className="mb-3 rounded-lg overflow-hidden">
          {post.media[0]?.type === 'image' && (
            <img src={post.media[0].url} alt="" className="w-full max-h-80 object-cover" />
          )}
        </div>
      )}

      {post.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.hashtags.map((tag) => (
            <span key={tag} className="text-primary-600 text-sm">#{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-stone-600">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${post.isLiked ? 'text-primary-600' : ''}`}
        >
          <span>{post.isLiked ? '❤️' : '🤍'}</span>
          <span>{post.stats?.likes || 0}</span>
        </button>
        <span className="flex items-center gap-1">💬 {post.stats?.comments || 0}</span>
      </div>
    </article>
  );
}

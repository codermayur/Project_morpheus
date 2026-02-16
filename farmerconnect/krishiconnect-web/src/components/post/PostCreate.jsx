import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { postService } from '../../services/post.service';

const schema = z.object({
  type: z.literal('text'),
  content: z.object({ text: z.string().min(1, 'Write something') }),
  category: z.string().optional(),
  visibility: z.string().optional(),
});

export default function PostCreate({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'text', content: { text: '' }, visibility: 'public' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await postService.create(data);
      toast.success('Post created!');
      reset({ content: { text: '' } });
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card mb-6">
      <textarea
        {...register('content.text')}
        placeholder="Share your farming tips, ask a question..."
        rows={3}
        className="input-field resize-none"
      />
      {errors.content?.text && (
        <p className="text-red-500 text-sm mt-1">{errors.content.text.message}</p>
      )}
      <div className="flex justify-end mt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}

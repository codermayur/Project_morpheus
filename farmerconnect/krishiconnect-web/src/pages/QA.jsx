import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function QA() {
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['questions', category],
    queryFn: () => api.get('/qa/questions', { params: { category: category || undefined, limit: 20 } }).then((r) => r.data),
  });

  const questions = data?.data?.data || data?.data || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Q&A - Ask Experts</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input-field mb-6 max-w-xs"
      >
        <option value="">All Categories</option>
        <option value="crop-disease">Crop Disease</option>
        <option value="pest-management">Pest Management</option>
        <option value="irrigation">Irrigation</option>
        <option value="fertilizer">Fertilizer</option>
        <option value="weather">Weather</option>
        <option value="market">Market</option>
        <option value="other">Other</option>
      </select>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-24" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="card text-center py-12 text-stone-500">
          No questions yet. Be the first to ask!
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Link
              key={q._id}
              to={`/qa/${q._id}`}
              className="card block hover:bg-stone-50"
            >
              <h3 className="font-semibold mb-1">{q.title}</h3>
              <p className="text-sm text-stone-600 line-clamp-2">{q.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-stone-500">
                <span>{q.answersCount || 0} answers</span>
                <span>{formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</span>
                <span className="capitalize">{q.category}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function Chat() {
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/chat/conversations').then((r) => r.data),
  });

  const conversations = data?.data?.data || data?.data || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="card text-center py-12 text-stone-500">
          No conversations yet. Start a chat from a user's profile!
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const other = conv.participants?.find(
              (p) => p.user?._id !== conv.participants?.[0]?.user?._id
            )?.user || conv.participants?.[0]?.user;
            return (
              <Link
                key={conv._id}
                to={`/chat/${conv._id}`}
                className="card flex items-center gap-3 hover:bg-stone-50 block"
              >
                <img
                  src={other?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(other?.name || 'U')}`}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{other?.name || 'Unknown'}</p>
                  <p className="text-sm text-stone-500 truncate">
                    {conv.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

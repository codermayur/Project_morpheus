import { api } from './api';

export const postService = {
  create: (data) => api.post('/posts', data),
  getFeed: (params) => api.get('/posts', { params }).then((r) => r.data),
  getById: (postId) => api.get(`/posts/${postId}`),
  update: (postId, data) => api.patch(`/posts/${postId}`, data),
  delete: (postId) => api.delete(`/posts/${postId}`),
  like: (postId) => api.post(`/posts/${postId}/like`),
  unlike: (postId) => api.delete(`/posts/${postId}/like`),
  addComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  getComments: (postId, params) => api.get(`/posts/${postId}/comments`, { params }),
  getByUser: (userId, params) => api.get(`/posts/user/${userId}`, { params }),
  getByHashtag: (tag, params) => api.get(`/posts/hashtag/${tag}`, { params }),
};

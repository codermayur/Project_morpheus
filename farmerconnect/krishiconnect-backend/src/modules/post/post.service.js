const Post = require('./models/post.model');
const Comment = require('./models/comment.model');
const Like = require('./models/like.model');
const Follow = require('../user/follow.model');
const ApiError = require('../../utils/ApiError');
const Pagination = require('../../utils/pagination');

const postPagination = new Pagination(Post);
const commentPagination = new Pagination(Comment);

const parseHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[\w\u0900-\u097F]+/g) || [];
  return [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))];
};

const createPost = async (authorId, postData) => {
  const hashtags = parseHashtags(postData.content?.text);
  const post = await Post.create({
    author: authorId,
    ...postData,
    hashtags,
  });

  await require('../user/user.model')
    .findByIdAndUpdate(authorId, { $inc: { 'stats.postsCount': 1 } });

  return post.populate('author', 'name avatar isExpert');
};

const getFeed = async (userId, options = {}) => {
  const { page = 1, limit = 20, filter = 'following' } = options;

  let query = { isDeleted: false, isApproved: true, visibility: 'public' };

  if (filter === 'following' && userId) {
    const following = await Follow.find({ follower: userId }).distinct('following');
    query.author = { $in: [...following, userId] };
  }

  if (filter === 'trending') {
    return postPagination.paginate(
      { ...query, 'stats.likes': { $gt: 0 } },
      {
        page,
        limit,
        sort: { 'stats.likes': -1, createdAt: -1 },
        populate: [{ path: 'author', select: 'name avatar isExpert' }],
      }
    );
  }

  return postPagination.paginate(query, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [{ path: 'author', select: 'name avatar isExpert' }],
  });
};

const getPostById = async (postId, userId = null) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false })
    .populate('author', 'name avatar isExpert stats')
    .lean();

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (userId) {
    const like = await Like.findOne({ user: userId, target: postId, targetModel: 'Post' });
    post.isLiked = !!like;
  }

  return post;
};

const updatePost = async (postId, userId, updateData) => {
  const post = await Post.findOne({ _id: postId, author: userId });

  if (!post) {
    throw new ApiError(404, 'Post not found or unauthorized');
  }

  const allowedFields = ['content', 'category', 'visibility'];
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) filteredData[field] = updateData[field];
  });

  if (filteredData.content?.text) {
    filteredData.hashtags = parseHashtags(filteredData.content.text);
  }

  Object.assign(post, filteredData);
  await post.save();

  return post.populate('author', 'name avatar isExpert');
};

const deletePost = async (postId, userId) => {
  const post = await Post.findOne({ _id: postId, author: userId });

  if (!post) {
    throw new ApiError(404, 'Post not found or unauthorized');
  }

  post.isDeleted = true;
  post.deletedAt = new Date();
  await post.save();

  await require('../user/user.model')
    .findByIdAndUpdate(userId, { $inc: { 'stats.postsCount': -1 } });

  return { success: true };
};

const likePost = async (userId, postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  const existingLike = await Like.findOne({
    user: userId,
    target: postId,
    targetModel: 'Post',
  });

  if (existingLike) {
    throw new ApiError(400, 'Already liked');
  }

  await Like.create({ user: userId, target: postId, targetModel: 'Post' });
  await Post.findByIdAndUpdate(postId, { $inc: { 'stats.likes': 1 } });

  return { success: true };
};

const unlikePost = async (userId, postId) => {
  const result = await Like.findOneAndDelete({
    user: userId,
    target: postId,
    targetModel: 'Post',
  });

  if (result) {
    await Post.findByIdAndUpdate(postId, { $inc: { 'stats.likes': -1 } });
  }

  return { success: true };
};

const addComment = async (userId, postId, commentData) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  const comment = await Comment.create({
    post: postId,
    author: userId,
    ...commentData,
  });

  await Post.findByIdAndUpdate(postId, { $inc: { 'stats.comments': 1 } });

  return comment.populate('author', 'name avatar isExpert');
};

const getComments = async (postId, options = {}) => {
  const { page = 1, limit = 20 } = options;

  return commentPagination.paginate(
    { post: postId, isDeleted: false, parentComment: null },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'author', select: 'name avatar isExpert' }],
    }
  );
};

const getUserPosts = async (targetUserId, options = {}) => {
  const { page = 1, limit = 20 } = options;

  return postPagination.paginate(
    { author: targetUserId, isDeleted: false, isApproved: true },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'author', select: 'name avatar isExpert' }],
    }
  );
};

const getPostsByHashtag = async (tag, options = {}) => {
  const { page = 1, limit = 20 } = options;

  return postPagination.paginate(
    { hashtags: tag.toLowerCase(), isDeleted: false, isApproved: true },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'author', select: 'name avatar isExpert' }],
    }
  );
};

module.exports = {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  getUserPosts,
  getPostsByHashtag,
};

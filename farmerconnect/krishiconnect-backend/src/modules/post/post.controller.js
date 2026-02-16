const postService = require('./post.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
});

const getFeed = asyncHandler(async (req, res) => {
  const result = await postService.getFeed(req.user._id, req.query);
  res.status(200).json(
    new ApiResponse(200, result.data, 'Feed fetched successfully', {
      pagination: result.pagination,
    })
  );
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(req.params.postId, req.user?._id);
  res.status(200).json(new ApiResponse(200, post, 'Post fetched successfully'));
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(
    req.params.postId,
    req.user._id,
    req.body
  );
  res.status(200).json(new ApiResponse(200, post, 'Post updated successfully'));
});

const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.postId, req.user._id);
  res.status(200).json(new ApiResponse(200, { success: true }, 'Post deleted successfully'));
});

const likePost = asyncHandler(async (req, res) => {
  await postService.likePost(req.user._id, req.params.postId);
  res.status(200).json(new ApiResponse(200, { success: true }, 'Post liked'));
});

const unlikePost = asyncHandler(async (req, res) => {
  await postService.unlikePost(req.user._id, req.params.postId);
  res.status(200).json(new ApiResponse(200, { success: true }, 'Post unliked'));
});

const addComment = asyncHandler(async (req, res) => {
  const comment = await postService.addComment(
    req.user._id,
    req.params.postId,
    req.body
  );
  res.status(201).json(new ApiResponse(201, comment, 'Comment added successfully'));
});

const getComments = asyncHandler(async (req, res) => {
  const result = await postService.getComments(req.params.postId, req.query);
  res.status(200).json(
    new ApiResponse(200, result.data, 'Comments fetched successfully', {
      pagination: result.pagination,
    })
  );
});

const getUserPosts = asyncHandler(async (req, res) => {
  const result = await postService.getUserPosts(req.params.userId, req.query);
  res.status(200).json(
    new ApiResponse(200, result.data, 'Posts fetched successfully', {
      pagination: result.pagination,
    })
  );
});

const getPostsByHashtag = asyncHandler(async (req, res) => {
  const result = await postService.getPostsByHashtag(req.params.tag, req.query);
  res.status(200).json(
    new ApiResponse(200, result.data, 'Posts fetched successfully', {
      pagination: result.pagination,
    })
  );
});

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

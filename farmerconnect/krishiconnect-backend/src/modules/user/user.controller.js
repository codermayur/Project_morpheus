const userService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const avatarData = req.uploadResult;
  const user = await userService.updateAvatar(req.user._id, avatarData);
  res.status(200).json(new ApiResponse(200, user, 'Avatar updated successfully'));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.params.userId, req.user?._id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

const searchUsers = asyncHandler(async (req, res) => {
  const result = await userService.searchUsers(req.query);
  res.status(200).json(
    new ApiResponse(200, result.data, 'Users fetched successfully', {
      pagination: result.pagination,
    })
  );
});

const followUser = asyncHandler(async (req, res) => {
  await userService.followUser(req.user._id, req.params.userId);
  res.status(200).json(new ApiResponse(200, { success: true }, 'User followed successfully'));
});

const unfollowUser = asyncHandler(async (req, res) => {
  await userService.unfollowUser(req.user._id, req.params.userId);
  res.status(200).json(new ApiResponse(200, { success: true }, 'User unfollowed successfully'));
});

const getFollowers = asyncHandler(async (req, res) => {
  const result = await userService.getFollowers(req.params.userId, req.query);
  res.status(200).json(
    new ApiResponse(200, result.data, 'Followers fetched successfully', {
      pagination: result.pagination,
    })
  );
});

const getFollowing = asyncHandler(async (req, res) => {
  const result = await userService.getFollowing(req.params.userId, req.query);
  res.status(200).json(
    new ApiResponse(200, result.data, 'Following fetched successfully', {
      pagination: result.pagination,
    })
  );
});

module.exports = {
  getMe,
  updateMe,
  uploadAvatar,
  getUserById,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};

const User = require('./user.model');
const Follow = require('./follow.model');
const ApiError = require('../../utils/ApiError');
const Pagination = require('../../utils/pagination');
const { deleteFromCloudinary } = require('../../utils/uploadToCloudinary');

const userPagination = new Pagination(User);
const followPagination = new Pagination(Follow);

const getProfile = async (userId, viewerId = null) => {
  const user = await User.findById(userId)
    .select('-password -refreshTokens -fcmTokens')
    .lean();

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (viewerId) {
    const follow = await Follow.findOne({
      follower: viewerId,
      following: userId,
    });
    user.isFollowing = !!follow;
  }

  return user;
};

const updateProfile = async (userId, updateData) => {
  const allowedFields = [
    'name',
    'bio',
    'location',
    'farmSize',
    'crops',
    'languages',
    'preferences',
  ];

  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  }).select('-password -refreshTokens -fcmTokens');

  return user;
};

const updateAvatar = async (userId, avatarData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  user.avatar = avatarData;
  await user.save();

  return user;
};

const searchUsers = async (query, options = {}) => {
  const { q, filter = 'all', page = 1, limit = 20 } = query;

  let searchQuery = { isActive: true, isBanned: false };

  if (q) {
    searchQuery.$or = [
      { name: { $regex: q, $options: 'i' } },
      { phoneNumber: { $regex: q, $options: 'i' } },
    ];
  }

  if (filter === 'experts') {
    searchQuery.isExpert = true;
  }

  return userPagination.paginate(searchQuery, {
    page,
    limit,
    sort: { createdAt: -1 },
    select: '-password -refreshTokens -fcmTokens',
  });
};

const followUser = async (followerId, followingId) => {
  if (followerId.toString() === followingId.toString()) {
    throw new ApiError(400, 'Cannot follow yourself');
  }

  const targetUser = await User.findById(followingId);
  if (!targetUser) {
    throw new ApiError(404, 'User not found');
  }

  const existingFollow = await Follow.findOne({
    follower: followerId,
    following: followingId,
  });

  if (existingFollow) {
    throw new ApiError(400, 'Already following this user');
  }

  await Follow.create({ follower: followerId, following: followingId });

  await User.findByIdAndUpdate(followerId, { $inc: { 'stats.followingCount': 1 } });
  await User.findByIdAndUpdate(followingId, { $inc: { 'stats.followersCount': 1 } });

  return { success: true };
};

const unfollowUser = async (followerId, followingId) => {
  const result = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });

  if (result) {
    await User.findByIdAndUpdate(followerId, { $inc: { 'stats.followingCount': -1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { 'stats.followersCount': -1 } });
  }

  return { success: true };
};

const getFollowers = async (userId, options = {}) => {
  const { page = 1, limit = 20 } = options;

  return followPagination.paginate(
    { following: userId },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'follower', select: 'name avatar bio isExpert stats' }],
    }
  );
};

const getFollowing = async (userId, options = {}) => {
  const { page = 1, limit = 20 } = options;

  return followPagination.paginate(
    { follower: userId },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'following', select: 'name avatar bio isExpert stats' }],
    }
  );
};

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { uploadSingle } = require('../../middlewares/upload.middleware');
const { uploadToCloudinary } = require('../../utils/uploadToCloudinary');

router.use(authenticate);

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

router.post(
  '/me/avatar',
  uploadSingle('avatar'),
  async (req, res, next) => {
    if (req.file) {
      try {
        req.uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: 'krishiconnect/avatars',
        });
      } catch (err) {
        return next(err);
      }
    }
    next();
  },
  userController.uploadAvatar
);

router.get('/search', userController.searchUsers);
router.get('/:userId', userController.getUserById);
router.post('/:userId/follow', userController.followUser);
router.delete('/:userId/follow', userController.unfollowUser);
router.get('/:userId/followers', userController.getFollowers);
router.get('/:userId/following', userController.getFollowing);

module.exports = router;

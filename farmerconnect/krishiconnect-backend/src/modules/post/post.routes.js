const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const { authenticate, optionalAuth } = require('../../middlewares/auth.middleware');
const { validate, createPostSchema, updatePostSchema, commentSchema } = require('./post.validation');

router.post('/', authenticate, validate(createPostSchema), postController.createPost);
router.get('/', authenticate, postController.getFeed); // Feed requires auth for personalized content
router.get('/user/:userId', optionalAuth, postController.getUserPosts);
router.get('/hashtag/:tag', optionalAuth, postController.getPostsByHashtag);
router.get('/:postId', optionalAuth, postController.getPostById);
router.patch('/:postId', authenticate, validate(updatePostSchema), postController.updatePost);
router.delete('/:postId', authenticate, postController.deletePost);
router.post('/:postId/like', authenticate, postController.likePost);
router.delete('/:postId/like', authenticate, postController.unlikePost);
router.post('/:postId/comments', authenticate, validate(commentSchema), postController.addComment);
router.get('/:postId/comments', postController.getComments);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { validate, registerSchema, verifyOTPSchema, loginSchema, refreshTokenSchema } = require('./auth.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authLimiter } = require('../../middlewares/rateLimit.middleware');

router.use(authLimiter);

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

module.exports = router;

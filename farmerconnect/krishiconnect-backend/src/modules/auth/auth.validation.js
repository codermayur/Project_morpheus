const Joi = require('joi');

const registerSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Indian phone number',
    }),
  name: Joi.string().required().trim().max(100),
  password: Joi.string().min(6).required(),
  location: Joi.object({
    state: Joi.string(),
    district: Joi.string(),
    village: Joi.string(),
  }),
});

const verifyOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  otp: Joi.string().length(6).required(),
});

const loginSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
});

const resetPasswordSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    const ApiError = require('../../utils/ApiError');
    throw new ApiError(400, 'Validation failed', errors);
  }

  req.body = value;
  next();
};

module.exports = {
  registerSchema,
  verifyOTPSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validate,
};

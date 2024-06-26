import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

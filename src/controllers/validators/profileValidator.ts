import Joi from 'joi';

export const profileSchema = Joi.object({
  country: Joi.string().required(),
  currency: Joi.string().required(),
});

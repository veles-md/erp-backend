import Joi from 'joi';

export const ENV_SCHEMA = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  MONGODB_CONNECTION: Joi.string().required(),
});

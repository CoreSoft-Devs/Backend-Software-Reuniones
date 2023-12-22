import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  APP_NAME: Joi.string().default('NestJS'),
  APP_PROD: Joi.boolean().default(false),
  APP_VERSION: Joi.string().default('0.0.1'),
  DOCKER_IMAGE: Joi.string().default(''),
  PORT: Joi.number().default(3000),
  
  APP_URL: Joi.string().default('http://localhost:3000'),
  FRONTEND_URL: Joi.string(),

  DB_CONNECTION: Joi.string().default('postgres'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_DATABASE: Joi.string().default('postgres'),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default(''),

  MAILER_EMAIL: Joi.string().default(''),
  MAILER_SECRET_KEY: Joi.string().default(''),
  MAILER_SERVICE: Joi.string().default(''),

  FIREBASE_AUTHORIZATION: Joi.string().default(''),
  FIREBASE_URL: Joi.string().default(''),

  HASH_SALT: Joi.number().default(10),
  JWT_AUTH: Joi.string().default('secret'),
  JWT_RECOVERY: Joi.string().default('secret'),
});

import Joi from 'joi';

const registerSchema = Joi.object({
	username: Joi.string().min(3).max(20).required().regex(/^[a-zA-Z0-9_]{3,20}$/),
	mail: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
	mail: Joi.string().email().required(),
	password: Joi.string().required(),
});

const messageSchema = Joi.object({
	message: Joi.string().required().max(2000),
});

export {
	registerSchema,
	loginSchema,
	messageSchema,
};
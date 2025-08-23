import rateLimit from 'express-rate-limit';

export const catratelimit = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: 'Trop de requêtes, réessayez plus tard.',
});
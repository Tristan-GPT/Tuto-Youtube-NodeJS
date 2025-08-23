import rateLimit from 'express-rate-limit';

export function ratelimit() {
	const limiter = rateLimit({
		windowMs: 10 * 1000,
		max: 15,
		message: 'Trop de requêtes, réessayez plus tard.',
	});

	return limiter;
}
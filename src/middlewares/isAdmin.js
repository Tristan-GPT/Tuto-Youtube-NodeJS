import { prisma } from '../index.js';

export async function isAdmin(req, res, next) {
	const admin = await prisma.admin.findUnique({
		where: {
			userId: req.user.id,
		},
	});

	if (!admin) return res.status(401).json({ error: 'No admin.' });

	next();
}
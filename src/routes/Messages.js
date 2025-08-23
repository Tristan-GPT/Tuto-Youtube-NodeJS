import { Router } from 'express';
import { prisma } from '../index.js';
import { isConnected } from '../middlewares/isConnected.js';
import { validate } from '../middlewares/validate.js';
import { messageSchema } from '../utils/schema.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = Router();

router.get('/list', isConnected, async (_req, res) => {

	try {

		const list = await prisma.message.findMany({
			orderBy: { id: 'desc' },
			take: 10,
		});
		res.status(200).json({ list: list.reverse() });

	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error during messages finding.' });
	}

});

router.post('/post', [isConnected, validate(messageSchema)], async (req, res) => {
	const { message } = req.body;

	if (!message) return res.status(401).json({ error: 'Missing fields.' });
	const user = req.user.username;
	const userTest = await prisma.user.findUnique({
		where: {
			mail: req.user.mail,
			username: user,
		},
	});
	console.log(userTest);
	if (!userTest) return res.status(401).json({ error: 'Unknown user.' });

	await prisma.message.create({
		data: {
			content: message,
			user: { connect: { id:userTest.id } },
		},
	});

	res.status(200).json({ message: 'success' });


});

router.post('/delete', [isConnected, isAdmin], async (req, res) => {
	console.log(req.body);
	const { id } = req.body;

	const message = await prisma.message.findUnique({
		where: {
			id,
		},
	});

	if (!message) {return res.status(404).json({ error: 'No message' });}
	else {
		await prisma.message.delete({
			where: {
				id,
			},
		});
		return res.status(200).json({ success: true });
	}

});

export default router;
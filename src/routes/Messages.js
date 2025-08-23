import { Router } from 'express';
import { db } from '../index.js';

const router = Router();

router.get('/list', async (_req, res) => {

	const [rows] = await db.promise().query('SELECT * FROM messages');
	const list = rows.slice(-10);
	res.status(200).json({ list: list });


});

router.post('/post', async (req, res) => {
	const { message } = req.body;

	const verifyUser = await fetch('http://localhost:5000/auth/verify', {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Authorization': `Bearer ${req.cookies.token}`,
			'Content-Type': 'application/json',
		},
	});

	if (verifyUser.ok) {
		if (!message) return res.status(401).json({ error: 'Missing fields.' });
		const response = await verifyUser.json();
		const user = response.username;
		const userTest = await db.promise().query('SELECT * FROM users WHERE username = ?', [user]);

		if (userTest[0].length === 0) return res.status(401).json({ error: 'Unknown user.' });

		db.promise().query('INSERT INTO messages (content, user) VALUES (?,?)', [message, user]);

		res.status(200).json({ message: 'success' });
	}


});

export default router;
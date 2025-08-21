import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../index.js';

const router = Router();

router.post('/signup', async (req, res) => {

	const mail = req.body.mail;
	const password = req.body.password;
	const username = req.body.username;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

	if (!mail || !password || !username) return res.status(400).json({ error: 'Missing fields' });

	if (!emailRegex.test(mail)) return res.status(400).json({ error: 'Invalid mail.' });
	if (!usernameRegex.test(username)) return res.status(400).json({ error: 'Invalid username' });

	const hashPassword = await bcrypt.hash(password, 12);

	const account = await db.promise().query('SELECT * FROM users WHERE mail = ?', [mail]);
	if (account[0].length !== 0) {return res.status(401).json({ error: 'already exists.' });}
	else {

		try {

			db.promise().query('INSERT INTO users (mail,password,username) VALUES (?,?,?)', [mail, hashPassword, username]);
			return res.status(200).json({ message: 'success.' });

		}
		catch (err) {
			if (err) return res.status(500).json({ message: 'DB Error' });
		}
	}

});

router.post('/login', async (req, res) => {

	const { mail, password } = req.body;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(mail)) return res.status(400).json({ error: 'Invalid mail.' });

	if (!mail || !password) return res.status(400).json({ error: 'Missing fields' });

	const result = await db.promise().query('SELECT * FROM users WHERE mail = ?', [mail]);
	if (result[0].length === 0) {return res.status(401).json({ error: 'No account' });}
	else {
		const hashedPassword = result[0][0].password;
		const same = await bcrypt.compare(password, hashedPassword);

		if (same) {
			return res.status(200).json({ message: 'success.' });
		}
		else {
			return res.status(401).json({ message: 'Invalid password.' });
		}

	}

});

export default router;
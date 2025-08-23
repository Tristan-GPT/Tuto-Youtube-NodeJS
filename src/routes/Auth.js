import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../index.js';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../../.env') });

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES = '7d';

function sendToken(res, payload) {
	const token = jwt.sign(payload, JWT_SECRET);
	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.PROD === 'true',
		sameSite: 'strict',
		maxAge: ms(JWT_EXPIRES),
	});
	return token;
}

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

			const token = sendToken(res, { mail, username });
			return res.status(200).json({ message: 'success.', token });

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
			const token = sendToken(res, { mail: result[0][0].mail, username: result[0][0].username });
			return res.status(200).json({ message: 'success.', token });
		}
		else {
			return res.status(401).json({ message: 'Invalid password.' });
		}

	}

});

router.post('/logout', async (req, res) => {

	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.PROD === 'true',
		sameSite: 'strict',
	});
	res.status(200).json({ message: 'success' });

});

router.delete('/delete', async (req, res) => {

	if (!req.cookies.token) return res.status(401).json({ error: 'Not connected' });

	const isValid = await fetch('http://localhost:5000/auth/verify', {
		headers: {
			'Authorization': `Bearer ${req.cookies.token}`,
		},
		method: 'GET',
	});

	const result = await isValid.json();

	if (result.valid) {
		db.query('DELETE FROM users WHERE mail = ?', [result.mail]);
		res.clearCookie('token', {
			httpOnly: true,
			secure: process.env.PROD === 'true',
			sameSite: 'strict',
		});
		res.status(200).json({ message: 'success.' });

	}
	else {
		return res.status(401).json({ error: 'Not connected' });
	}

});

router.get('/verify', async (req, res) => {
	const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
	if (!token) return res.status(200).json({ valid: false }) && console.log('Token missing');

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		res.status(200).json({ valid: true, username: decoded.username, mail: decoded.mail });
	}
	catch {
		res.status(200).json({ valid: false });
	}
});

export default router;
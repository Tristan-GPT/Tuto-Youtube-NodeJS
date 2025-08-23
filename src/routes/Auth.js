import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../index.js';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { isConnected } from '../middlewares/isConnected.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../utils/schema.js';

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

router.post('/signup', validate(registerSchema), async (req, res) => {

	const mail = req.body.mail;
	const password = req.body.password;
	const username = req.body.username;

	const hashPassword = await bcrypt.hash(password, 12);

	const account = await prisma.user.findUnique({
		where: {
			mail,
		},
	});

	const verifyUsername = await prisma.user.findUnique({
		where: {
			username,
		},
	});
	if (account || verifyUsername) {return res.status(401).json({ error: 'already exists.' });}

	else {

		try {

			await prisma.user.create({
				data: {
					username,
					password: hashPassword,
					mail,
				},
			});

			const token = sendToken(res, { mail, username });
			return res.status(200).json({ message: 'success.', token });

		}
		catch (err) {
			if (err) return res.status(500).json({ message: 'DB Error' });
		}
	}

});

router.post('/login', validate(loginSchema), async (req, res) => {

	const { mail, password } = req.body;

	const user = await prisma.user.findUnique({
		where: { mail },
	});
	if (!user) {return res.status(401).json({ error: 'No user.' });}
	else {
		const hashedPassword = user.password;
		const same = await bcrypt.compare(password, hashedPassword);

		if (same) {
			const token = sendToken(res, { mail: user.mail, username: user.username });
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

router.delete('/delete', isConnected, async (req, res) => {

	if (!req.cookies.token) return res.status(401).json({ error: 'Not connected' });

	const mail = req.user.mail;
	const user = await prisma.user.findUnique({
		where: {
			mail,
		},
	});
	if (!user) return res.status(401).json({ error: 'Unknown user.' });
	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.PROD === 'true',
		sameSite: 'strict',
	});
	res.status(200).json({ message: 'success.' });


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
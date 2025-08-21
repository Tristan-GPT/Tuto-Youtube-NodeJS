import { Router } from 'express';
import { db } from '../index.js';

const router = Router();

router.get('/exist', async (req, res) => {

	const mail = req.query.mail;

	const account = await db.promise().query('SELECT * FROM users WHERE mail = ?', [mail]).catch(e => {
		if (e) return res.status(500).json({ error: 'DB Error' });
	});

	if (account[0].length === 0) {
		return res.status(200).json({ exist: false });
	}
	else {
		return res.status(200).json({ exist: true });
	}

});

export default router;
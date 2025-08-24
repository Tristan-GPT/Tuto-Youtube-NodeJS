import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../../.env') });

export async function isConnected(req, res, next) {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ error: 'Not connected.' });

	const verifyUser = await fetch(process.env.PROD === 'true' ? 'https://api.cat.miralys.xyz/auth/verify' : 'http://localhost:5000/auth/verify', {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});
	if (verifyUser.ok) {
		const result = await verifyUser.json();
		req.user = result;
		if (!result.valid) return res.status(401).json({ error: 'Not connected.' });
		next();
	}
}
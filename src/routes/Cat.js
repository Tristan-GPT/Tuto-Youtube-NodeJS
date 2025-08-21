import { Router } from 'express';

const router = Router();

router.get('/catimage', (req, res) => {

	fetch(`https://api.thecatapi.com/v1/images/search?api_key=${process.env.API_KEY}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
	}).then((result) => {
		return result.json();
	}).then((data) => {

		const imageData = data[0];

		return res.status(200).json({ url: imageData.url });

	}).catch((e) => {
		if (e) return res.status(500).json({ error: e });
	});

});

export default router;
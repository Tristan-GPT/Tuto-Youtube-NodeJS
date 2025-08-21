import { Router } from 'express';

const router = Router();

router.post('/test/:name', (req, res) => {

	const reqBody = req.body.api_key;
	const reqQuery = parseInt(req.query.id);
	const reqParams = req.params.name;

	const array = [reqBody, reqQuery, reqParams];

	res.status(200).json(array);

});

export default router;
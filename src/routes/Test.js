import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

router.post('/test', (req, res) => {

	const reqBody = req.body.api_key;
	const reqQuery = parseInt(req.query.id);

	const array = [reqBody, reqQuery];
	logger.info('Test réussi.', { code: 500 });
	res.status(200).json(array);

});

export default router;
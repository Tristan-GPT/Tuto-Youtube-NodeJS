/* eslint-disable no-unused-vars */
export function ErrorHandler(err, _req, res, _next) {
	console.error(err.stack);
	res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur.' });
}
/* eslint-disable no-unused-vars */
const PROD = false;
async function getRemove() {

	const request = await fetch(PROD ? 'https://api.cat.miralys.xyz/auth/delete' : 'http://localhost:5000/auth/delete',
		{
			method: 'DELETE',
			credentials: 'include',

		},
	);

	if (request.ok) {
		alert('Compte supprimé avec succès');
		window.location.href = '/frontend/index.html';
	}
	else {
		alert('Une erreur est survenue');
	}

}
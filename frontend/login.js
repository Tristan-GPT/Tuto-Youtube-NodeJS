/* eslint-disable no-unused-vars */
async function getLogin() {
	const mail = document.getElementsByClassName('mail')[0].value;
	const password = document.getElementsByClassName('password')[0].value;

	const result = await fetch('http://localhost:5000/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ mail, password }),
	});

	if (result.ok) {

		alert('Vous êtes connecté.');
		window.location.href = '/frontend/index.html';

	}
	else {
		alert('Une erreur est survenue.');
		window.location.reload();
	}
}

async function getSignup() {

	const mail = document.getElementsByClassName('mail')[0].value;
	const password = document.getElementsByClassName('password')[0].value;
	const username = document.getElementsByClassName('username')[0].value;

	const result = await fetch('http://localhost:5000/auth/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: true,
		body: JSON.stringify({ mail, password, username }),
	});

	if (result.ok) {

		alert('Vous êtes connecté.');
		window.location.href = '/frontend/index.html';

	}
	else {
		alert('Une erreur est survenue.');
		window.location.reload();
	}

}
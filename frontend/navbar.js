/* eslint-disable no-unused-vars */
document.addEventListener('DOMContentLoaded', () => {

	const loginLink = document.querySelector('.navbar ul li a.login');
	fetch('http://localhost:5000/auth/verify', {
		method: 'GET',
		credentials: 'include',
	}).then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.valid) {
				loginLink.textContent = data.username;
				loginLink.href = '/frontend/account.html';
			}
			else {
				localStorage.removeItem('token');
				const logoutLink = document.querySelector('.navbar ul li a.logout');
				logoutLink.style = 'display: none;';
			}


		})
		.catch(err => {
			console.error(err);
			localStorage.removeItem('token');
		});


});


async function getLogout() {
	const result = await fetch('http://localhost:5000/auth/logout', { method: 'POST', credentials: 'include' });

	if (!result.ok) {
		console.log('Erreur sur la déconnexion');
		alert('Une erreur est survenue.');
		console.log(result.status);
	}
	else {
		alert('Déconnecté avec succès.');
		window.location.href = '/frontend/index.html';
	}
}
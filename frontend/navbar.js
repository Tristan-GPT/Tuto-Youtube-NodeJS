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
			}
		})
		.catch(err => {
			console.error(err);
			localStorage.removeItem('token');
		});


});
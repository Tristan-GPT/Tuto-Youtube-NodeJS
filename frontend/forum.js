/* eslint-disable no-unused-vars */
async function getMessages() {
	const result = await fetch('http://localhost:5000/messages/list', {
		credentials: 'include',
		method: 'GET',
	});

	const res = await result.json();
	const div = document.getElementsByClassName('messages-container')[0];
	div.innerHTML = '';
	for (let i = 0; i < res.list.length; i++) {
		const messageDiv = document.createElement('div');
		messageDiv.classList.add('message');

		messageDiv.textContent = `${res.list[i].user} - ${res.list[i].content}`;

		div.appendChild(messageDiv);
	}

}

async function postMessage() {

	const message = document.getElementsByClassName('message-container')[0].value;

	const posting = await fetch('http://localhost:5000/messages/post', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			message,
		}),
	});

	if (posting.ok) {
		getMessages();
	}
}

getMessages();
/* eslint-disable no-unused-vars */
const PROD = false;

async function getMessages() {
	const result = await fetch(PROD ? 'https://api.cat.miralys.xyz/messages/list' : 'http://localhost:5000/messages/list', {
		credentials: 'include',
		method: 'GET',
	});

	const res = await result.json();
	const div = document.getElementsByClassName('messages-container')[0];
	div.innerHTML = '';
	for (let i = 0; i < res.list.length; i++) {
		const messageDiv = document.createElement('div');
		messageDiv.classList.add('message');
		messageDiv.classList.add(res.list[i].id);
		const deleteButton = document.createElement('button');
		deleteButton.classList.add(res.list[i].id);
		deleteButton.textContent = 'Supprimer';
		deleteButton.addEventListener('click', () => {
			deleteMessage(res.list[i].id);
		});
		const messageText = document.createElement('span');
		messageText.textContent = `${res.list[i].username} - ${res.list[i].content}`;
		messageDiv.appendChild(deleteButton);
		messageDiv.appendChild(messageText);

		div.appendChild(messageDiv);
	}

}

async function postMessage() {

	const message = document.getElementsByClassName('message-container')[0].value;

	const posting = await fetch(PROD ? 'https://api.cat.miralys.xyz/messages/post' : 'http://localhost:5000/messages/post', {
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

async function deleteMessage(id) {
	await fetch(PROD ? 'https://api.cat.miralys.xyz/messages/delete' : 'http://localhost:5000/messages/delete', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: id }),
	});
	getMessages();
}

getMessages();
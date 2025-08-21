async function getImage() {

	const result = await fetch('http://localhost:5000/cat/catimage', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const res = await result.json();
	if (result.ok) {
		const img = document.getElementById('imgcat');
		img.src = res.url;
	}

}

getImage();
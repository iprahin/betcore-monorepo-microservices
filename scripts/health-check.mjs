const endpoints = ['http://127.0.0.1:3000/api/health/live', 'http://127.0.0.1:3001/health/live'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForEndpoint(url) {
	const attempts = 60;

	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		try {
			const response = await fetch(url);

			if (response.ok) {
				console.log(`OK: ${url}`);
				return;
			}

			console.log(`Waiting for ${url}. Status: ${response.status}`);
		} catch {
			console.log(`Waiting for ${url}. Attempt ${attempt}/${attempts}`);
		}

		await sleep(2000);
	}

	throw new Error(`Endpoint is not healthy: ${url}`);
}

for (const endpoint of endpoints) {
	await waitForEndpoint(endpoint);
}

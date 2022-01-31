const base = 'https://api.stats.govt.nz/opendata';
const resource = '/v1/Covid-19Indicators/Observations';
const query = `?$filter=ResourceID%20eq%20'CPCOV2'&$select=Period,Label1,Value&$orderby=Period,Label1`;

// http://localhost:3002/charts/data.json

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	const res = await fetch(`${base}${resource}${query}`, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			'Ocp-Apim-Subscription-Key': import.meta.env.VITE_STATS_API_KEY
		}
	});

	return {
		status: res.status,
		body: await res.json()
	};
}

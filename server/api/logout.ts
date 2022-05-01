export default defineEventHandler(async (event) => {
	const body = await useBody(event);
	const response = await fetch('http://localhost:8090/auth/logout', {
		body,
		method: 'POST',
	});
	const result = await response.json();
	return result;
});

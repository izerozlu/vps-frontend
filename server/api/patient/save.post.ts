export default defineEventHandler(async (event) => {
  const body = useBody(event);
  const response = await fetch('http://localhost:8090/patients', {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
  const result = await response.json();
  return { ...result, status: response.status === 200 ? 'success' : 'fail' };
});

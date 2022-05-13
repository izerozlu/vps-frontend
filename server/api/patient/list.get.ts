export default defineEventHandler(async (event) => {
  const response = await fetch('http://localhost:8090/patients');
  const result = await response.json();

  return { ...result, status: response.status === 200 ? 'success' : 'fail' };
});

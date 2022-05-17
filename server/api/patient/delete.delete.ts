export default defineEventHandler(async (event) => {
  const query = await useQuery(event);
  const response = await fetch(
    `http://localhost:8090/patients/${query.patientId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    }
  );

  const result = await response.json();
  console.log(result);
  return { data: result, status: response.status === 200 ? 'success' : 'fail' };
});

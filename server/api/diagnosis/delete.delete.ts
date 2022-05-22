import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const query = await useQuery(event);
  console.log(query);

  return await sendRequest(`/diagnosis/${query.diagnosisId}`, 'DELETE');
});

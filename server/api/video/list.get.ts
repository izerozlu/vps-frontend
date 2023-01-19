import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const query = await useQuery(event);
  return await sendRequest(event, `/videos/patient/${query.patientId}`);
});

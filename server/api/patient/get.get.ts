import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  return await sendRequest(event, `/patients/${query.patientId}`);
});

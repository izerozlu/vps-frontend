import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const query = await useQuery(event);
  return await sendRequest(event, `/videos/${query.videoId}`, 'PATCH', body);
});

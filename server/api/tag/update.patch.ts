import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const { id } = await useQuery(event);
  return await sendRequest(`/videos/tags/${id}`, 'PATCH', body);
});

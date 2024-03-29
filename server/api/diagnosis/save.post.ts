import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  return await sendRequest(event, '/diagnosis/', 'POST', body);
});

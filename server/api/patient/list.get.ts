import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  return await sendRequest(event, '/patients');
});

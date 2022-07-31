import EAuthentication from '@/enums/authentication';
import sendRequest from '~/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const response = await sendRequest(`/auth/logout`, 'POST', JSON.stringify(body));

  if (response.status === 'success') {
    setCookie(event, EAuthentication.IS_LOGGED_IN, null);
  }

  setCookie(event, EAuthentication.USERNAME, null);

  return response;
});

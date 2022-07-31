import EAuthentication from '@/enums/authentication';
import sendRequest from '~/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);

  const response = await sendRequest(`/auth/login`, 'POST', JSON.stringify(body));

  if (response.status === 'success') {
    setCookie(event, EAuthentication.IS_LOGGED_IN, 'true');
    setCookie(event, EAuthentication.USERNAME, body.username);
  }

  return response;
});

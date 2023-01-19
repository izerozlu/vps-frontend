import EAuthentication from '@/enums/authentication';
import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const authenticationKey = Buffer.from(`${body.username}:${body.password}`).toString('base64');
  const response = await sendRequest(event, '/auth/login', 'POST', body);

  if (response.status === 'success') {
    setCookie(event, EAuthentication.IS_LOGGED_IN, 'true');
    setCookie(event, EAuthentication.USERNAME, body.username);
    setCookie(event, EAuthentication.ROLE, body.username);
    setCookie(event, EAuthentication.AUTHENTICATION_KEY, authenticationKey);
  }

  return response;
});

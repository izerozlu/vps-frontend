import EAuthentication from '@/enums/authentication';
import sendRequest from '@/server/utils/send-request';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const response = await sendRequest(event, '/auth/logout', 'POST', body);

  if (response.status === 'success') {
    deleteCookie(event, EAuthentication.IS_LOGGED_IN);
  }

  deleteCookie(event, EAuthentication.USERNAME);
  deleteCookie(event, EAuthentication.ROLE);
  deleteCookie(event, EAuthentication.AUTHENTICATION_KEY);

  return response;
});

import EAuthentication from '@/enums/authentication';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const response = await fetch('http://localhost:8090/auth/logout', {
    body,
    method: 'POST',
  });
  const result = await response.json();
  setCookie(
    event,
    EAuthentication.IS_LOGGED_IN,
    JSON.stringify(response.status !== 200)
  );
  return { ...result, result: response.status === 200 ? 'success' : 'fail' };
});

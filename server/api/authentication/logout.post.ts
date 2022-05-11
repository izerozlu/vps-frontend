import EAuthentication from '@/enums/authentication';

export default defineEventHandler(async (event) => {
  const body = await useBody(event);

  const response = await fetch('http://localhost:8090/auth/logout', {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  if (response.status === 200) {
    setCookie(event, EAuthentication.IS_LOGGED_IN, null);
  }

  setCookie(event, EAuthentication.USERNAME, null);
  return { ...result, status: response.status === 200 ? 'success' : 'fail' };
});

import EAuthentication from '@/enums/authentication';
import { H3Event } from 'h3';

const sendRequest = async (
  event: H3Event,
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: any,
  headers: { [key: string]: string } = { 'Content-Type': 'application/json' }
) => {
  let result: any;
  let response: Response;
  // noinspection TypeScriptUnresolvedFunction
  const { baseUrl } = useRuntimeConfig();

  if (!headers.hasOwnProperty('Authorization')) {
    const authenticationKey = getCookie(event, EAuthentication.AUTHENTICATION_KEY);
    headers['Authorization'] = `Basic ${authenticationKey}`;
  }

  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers,
      method,
      body: JSON.stringify(body)
    });
    result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  return {
    data: result || null,
    status: response?.status === 200 ? 'success' : 'fail'
  };
};

export default sendRequest;

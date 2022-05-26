const sendRequest = async (
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: any,
  contentType: string = 'application/json'
) => {
  let result: any;
  let response: Response;

  try {
    response = await fetch(`http://localhost:8090${path}`, {
      headers: { 'Content-Type': contentType },
      method,
      body,
    });
    result = await response.json();
  } catch (error) {
    console.error(error);
  }

  return {
    data: result || null,
    status: response?.status === 200 ? 'success' : 'fail',
  };
};

export default sendRequest;

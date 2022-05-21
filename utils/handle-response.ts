import { useToast } from 'vue-toastification';
import IServerResponse from '@/interfaces/server-response';

const handleResponse = async (
  response: Promise<IServerResponse>,
  callbacks: {
    success: (response: IServerResponse) => void;
    error?: (responseData: any) => void;
  }
) => {
  const toast = useToast();

  try {
    const result = await response;
    if (result.status === 'success') {
      callbacks.success(result);
    } else {
      if (callbacks.error) {
        callbacks.error(result.data);
      }
    }
  } catch (error) {
    toast.error('Something went horribly wrong! Check console for details.', {
      timeout: 0,
    });
    console.error(error);
  }
};

export default handleResponse;

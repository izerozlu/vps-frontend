import { useToast } from 'vue-toastification';
import IServerResponse from '@/interfaces/server-response';
import { useI18n } from 'vue-i18n';

const handleResponse = async (
  response: Promise<IServerResponse>,
  callbacks: {
    success: (response: IServerResponse) => void;
    error?: (responseData: any) => void;
  }
) => {
  const toast = useToast();
  const { t } = useI18n();
  const result = await response;

  if (result.status === 'success') {
    callbacks.success(result);
  } else {
    if (callbacks.error) {
      callbacks.error(result.data);
    } else {
      toast.error(t('error-messages.unknown'), { timeout: 0 });
    }
  }
};

export default handleResponse;

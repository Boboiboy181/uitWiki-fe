import { AxiosError } from 'axios';
import { api } from '../axios.config';

const sendMessage = async (user_question: string, sessionId: string, timestamp: number) => {
  try {
    const response = await api.post('/api/v1/send_message', { user_question, sessionId, timestamp });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const statusText = error.response?.statusText || 'Unknown status';
      const message = error.response?.data?.message || 'No message';
      throw new Error(`API Error: ${status} - ${statusText}. Message: ${message}`);
    } else if (error instanceof Error) {
      throw new Error(`Unexpected Error: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export { sendMessage };

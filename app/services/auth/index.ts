import { AxiosError } from 'axios';
import { api } from '../axios.config';

const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
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

export { login };

import { AxiosError } from 'axios';
import { api } from '../axios.config';

const login = async (email: string, password: string) => {
  try {
    const response = await api.post('http://localhost:3005/auth/login', { email, password });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const statusText = error.response?.statusText || 'Unknown status';
      const message = error.response?.data?.message || 'No message';
      throw new Error(`API Error: ${status} - ${statusText}. Message: ${message}`);
    }
    if (error instanceof Error) {
      throw new Error(`Unexpected Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred.');
  }
};

const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const statusText = error.response?.statusText || 'Unknown status';
      const message = error.response?.data?.message || 'No message';
      throw new Error(`API Error: ${status} - ${statusText}. Message: ${message}`);
    }
    if (error instanceof Error) {
      throw new Error(`Unexpected Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred.');
  }
};

const redirectLogin = () => {
  window.location.href = '/login';
};

export { login, logout, redirectLogin };

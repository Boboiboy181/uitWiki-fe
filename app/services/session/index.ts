import { api } from '../axios.config';

const getNewSession = async () => {
  try {
    const response = await api.get('/create_session');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { getNewSession };

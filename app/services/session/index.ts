import { redirectLogin } from '../auth';
import { api, BASE_URL } from '../axios.config';

const getNewSession = async () => {
  try {
    const response = await api.get('/api/v1/create_session');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getSessionById = async (sessionId: string) => {
  try {
    const response = await api.get(`/api/v1/get_session?sessionId=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getSessions = async (size: number = 10, page: number = 0) => {
  try {
    const response = await api.get(`${BASE_URL.API}/api/v1/get_sessions?size=${size}&page=${page}`);

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      redirectLogin();
    }
    console.error(error);
  }
};

export { getNewSession, getSessionById, getSessions };

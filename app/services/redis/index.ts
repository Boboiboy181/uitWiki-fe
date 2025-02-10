import { RedisKey } from '~/types';
import { redirectLogin } from '../auth';
import { api } from '../axios.config';

const getAllCachedKeys = async () => {
  try {
    const response = await api.get(`/api/v1/chatbot/redis?`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')!).state.token}`,
      },
    });

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

const createCachedKey = async ({ question, response }: Pick<RedisKey, 'question' | 'response'>) => {
  try {
    const res = await api.post(
      `/api/v1/chatbot/redis?`,
      {
        question,
        response,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')!).state.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (res.status === 401) {
      throw new Error('Unauthorized');
    }

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.res?.status === 401) {
      redirectLogin();
    }
    console.error(error);
  }
};

const getCachedKeyById = async (id: string): Promise<RedisKey | undefined> => {
  try {
    const response = await api.get(`/api/v1/chatbot/redis/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')!).state.token}`,
      },
    });

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

const deleteCachedKeyById = async (id: string) => {
  try {
    const response = await api.delete(`/api/v1/chatbot/redis/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')!).state.token}`,
      },
    });

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

const updateCachedKey = async (id: string, data: Pick<RedisKey, 'question' | 'response'>) => {
  try {
    const response = await api.patch(`/api/v1/chatbot/redis/${id}`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')!).state.token}`,
      },
    });
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

export { createCachedKey, deleteCachedKeyById, getAllCachedKeys, getCachedKeyById, updateCachedKey };

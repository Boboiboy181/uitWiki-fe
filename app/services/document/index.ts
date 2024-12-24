import { redirectLogin } from '../auth';
import { api } from '../axios.config';

const getDocuments = async (size: number = 10, page: number = 0) => {
  try {
    const response = await api.get(`/api/v1/document?size=${size}&page=${page}`, {
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

const getDocumentById = async (id: string) => {
  try {
    const response = await api.get(`/api/v1/document/${id}`, {
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

const deleteDocumentById = async (id: string) => {
  try {
    const response = await api.delete(`/api/v1/document/${id}`, {
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

export { deleteDocumentById, getDocumentById, getDocuments };

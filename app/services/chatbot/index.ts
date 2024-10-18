import { api } from '../axios.config';

const sendMessage = async (user_question: string) => {
  try {
    const response = await api.post('/send_message', { user_question });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { sendMessage };

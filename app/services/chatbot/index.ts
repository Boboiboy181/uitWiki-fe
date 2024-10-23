import { api } from '../axios.config';

const sendMessage = async (user_question: string, sessionId: string, timestamp: number) => {
  try {
    const response = await api.post('/send_message', { user_question, sessionId, timestamp });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { sendMessage };

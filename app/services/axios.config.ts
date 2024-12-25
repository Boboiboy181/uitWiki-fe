import axios from 'axios';

const URL = 'http://localhost';

export const BASE_URL = {
  AUTH: `${URL}:3005`,
  API: `${URL}:3000`,
};

export const api = axios.create({
  withCredentials: true,
  baseURL: 'https://wikichatbot.uit.io.vn',
});

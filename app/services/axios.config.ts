import axios from 'axios';

export const api = axios.create({
  withCredentials: true,
  baseURL: 'https://wikichatbot.uit.io.vn',
});

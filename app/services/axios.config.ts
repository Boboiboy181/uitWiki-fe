import axios from 'axios';

const URL = `http://localhost:3005`;
// const URL = `https://wikichatbot.uit.io.vn`;

export const api = axios.create({
  withCredentials: true,
  baseURL: URL,
});

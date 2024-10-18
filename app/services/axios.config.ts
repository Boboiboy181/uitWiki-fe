import axios from 'axios';

const URL = {
  DEPLOY_URL: '',
  LOCALHOST: 'http://localhost:3000/api/v1',
};
const BASE_URL = URL.LOCALHOST;

export const api = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Credentials': true,
  },
});

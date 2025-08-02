import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // 오타: httplocalhost → http://localhost
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

export default api;
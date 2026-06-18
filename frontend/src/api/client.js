import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://shopeze-9mqv.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('shopezUser');

  if (storedUser) {
    const user = JSON.parse(storedUser);
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'Something went wrong';
};

export default api;

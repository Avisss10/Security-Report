import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403 ||
        (error.response.data && (
          error.response.data.message === 'jwt expired' ||
          error.response.data.message === 'Token tidak valid' ||
          error.response.data.message === 'Token tidak ditemukan'
        )))
    ) {
      toast.error('Sesi Anda telah habis, silakan login kembali.');
      localStorage.clear();
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } else if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Terjadi kesalahan, silakan coba lagi.');
    }
    return Promise.reject(error);
  }
);

export default instance;
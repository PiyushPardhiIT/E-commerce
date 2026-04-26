import axiosInstance from './axiosInstance';

export const registerApi = (data) =>
  axiosInstance.post('/api/auth/register', data);

export const loginApi = (data) =>
  axiosInstance.post('/api/auth/login', data);
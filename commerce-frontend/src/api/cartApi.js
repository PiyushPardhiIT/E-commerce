import axiosInstance from './axiosInstance';

export const getCartApi = () =>
  axiosInstance.get('/api/customer/cart');

export const addToCartApi = (data) =>
  axiosInstance.post('/api/customer/cart', data);

export const updateCartItemApi = (cartItemId, data) =>
  axiosInstance.put(`/api/customer/cart/${cartItemId}`, data);

export const removeFromCartApi = (cartItemId) =>
  axiosInstance.delete(`/api/customer/cart/${cartItemId}`);

export const clearCartApi = () =>
  axiosInstance.delete('/api/customer/cart');
import axiosInstance from './axiosInstance';

export const placeOrderApi = (data) =>
  axiosInstance.post('/api/customer/orders', data);

export const getMyOrdersApi = () =>
  axiosInstance.get('/api/customer/orders');

export const getOrderByIdApi = (id) =>
  axiosInstance.get(`/api/customer/orders/${id}`);

export const cancelOrderApi = (id) =>
  axiosInstance.put(`/api/customer/orders/${id}/cancel`);

export const getAllOrdersAdminApi = () =>
  axiosInstance.get('/api/admin/orders');

export const updateOrderStatusApi = (id, data) =>
  axiosInstance.put(`/api/seller/orders/${id}/status`, data);
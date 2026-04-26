import axiosInstance from './axiosInstance';

export const getAllProductsApi = () =>
  axiosInstance.get('/api/public/products');

export const getProductByIdApi = (id) =>
  axiosInstance.get(`/api/public/products/${id}`);

export const searchProductsApi = (params) =>
  axiosInstance.get('/api/public/products/search', { params });

export const getAllCategoriesApi = () =>
  axiosInstance.get('/api/public/categories');

// Seller
export const createProductApi = (data) =>
  axiosInstance.post('/api/seller/products', data);

export const updateProductApi = (id, data) =>
  axiosInstance.put(`/api/seller/products/${id}`, data);

export const deleteProductApi = (id) =>
  axiosInstance.delete(`/api/seller/products/${id}`);

export const getMyProductsApi = () =>
  axiosInstance.get('/api/seller/products/my');

// Admin
export const getAllProductsAdminApi = () =>
  axiosInstance.get('/api/admin/products');

export const createCategoryApi = (data) =>
  axiosInstance.post('/api/admin/categories', data);
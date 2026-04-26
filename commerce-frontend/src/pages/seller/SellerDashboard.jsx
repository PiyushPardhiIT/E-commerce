import { useEffect, useState } from 'react';
import {
  getMyProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getAllCategoriesApi,
} from '../../api/productApi';
import { updateOrderStatusApi, getMyOrdersApi } from '../../api/orderApi';
import { showSuccess, showError } from '../../utils/toast';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  imageUrl: '',
  categoryId: '',
};

const SellerDashboard = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ── Load data on mount ─────────────────────────────────────────────
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getMyProductsApi(),
        getAllCategoriesApi(),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch {
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      // Sellers see orders through admin endpoint
      // For now showing a placeholder
      setOrders([]);
    } catch {
      showError('Failed to load orders');
    }
  };

  useEffect(() => {
    if (tab === 'orders') loadOrders();
  }, [tab]);

  // ── Form handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: categories.find(
        (c) => c.name === product.categoryName
      )?.id || '',
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
  };

  // ── Submit create or update ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      categoryId: parseInt(formData.categoryId),
    };

    try {
      if (editingProduct) {
        // Update existing
        const res = await updateProductApi(editingProduct.id, payload);
        setProducts(products.map((p) =>
          p.id === editingProduct.id ? res.data : p
        ));
        showSuccess('Product updated successfully!');
      } else {
        // Create new
        const res = await createProductApi(payload);
        setProducts([...products, res.data]);
        showSuccess('Product created successfully!');
      }
      handleCloseForm();
    } catch (err) {
      showError(
        err.response?.data?.error || 'Failed to save product'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete product ─────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await deleteProductApi(id);
      setProducts(products.filter((p) => p.id !== id));
      showSuccess('Product deleted');
    } catch {
      showError('Failed to delete product');
    }
  };

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) return <Spinner message="Loading dashboard..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Seller Dashboard
        </h1>
        {tab === 'products' && (
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white
                       px-4 py-2 rounded-lg text-sm font-medium
                       transition-colors"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <p className="text-gray-500 text-sm">My Products</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <p className="text-gray-500 text-sm">Active Products</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {products.filter((p) => p.active).length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['products', 'orders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium
                        capitalize transition-colors ${
              tab === t
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Product Form Modal ───────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50
                        flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg
                          max-h-screen overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium
                                   text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="iPhone 15 Pro"
                  required
                  className="w-full border rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2
                             focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium
                                   text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2
                             focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium
                                     text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="79999"
                    required
                    min="0"
                    step="0.01"
                    className="w-full border rounded-lg px-3 py-2
                               focus:outline-none focus:ring-2
                               focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium
                                     text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="50"
                    required
                    min="0"
                    className="w-full border rounded-lg px-3 py-2
                               focus:outline-none focus:ring-2
                               focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium
                                   text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2
                             focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium
                                   text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2
                             bg-white focus:outline-none focus:ring-2
                             focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 border border-gray-300 text-gray-600
                             py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white
                             py-2.5 rounded-lg font-medium transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? 'Saving...'
                    : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Products Tab ─────────────────────────────────────────────── */}
      {tab === 'products' && (
        <>
          {products.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No products yet"
              message="Add your first product to start selling"
              buttonText="Add Product"
              buttonLink={null}
            />
          ) : (
            <div className="bg-white rounded-xl border shadow-sm
                            overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm
                                   font-medium text-gray-500">
                      Product
                    </th>
                    <th className="text-left px-6 py-3 text-sm
                                   font-medium text-gray-500">
                      Price
                    </th>
                    <th className="text-left px-6 py-3 text-sm
                                   font-medium text-gray-500">
                      Stock
                    </th>
                    <th className="text-left px-6 py-3 text-sm
                                   font-medium text-gray-500">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-sm
                                   font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-sm
                                   font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id}
                        className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Product image thumbnail */}
                          <div className="w-10 h-10 bg-gray-100 rounded-lg
                                          flex items-center justify-center
                                          flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover
                                           rounded-lg"
                              />
                            ) : (
                              <span className="text-lg">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400
                                          line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        ₹{product.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          product.stockQuantity === 0
                            ? 'text-red-500'
                            : product.stockQuantity < 10
                            ? 'text-yellow-500'
                            : 'text-green-600'
                        }`}>
                          {product.stockQuantity === 0
                            ? 'Out of stock'
                            : product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {product.categoryName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full
                                          font-medium ${
                          product.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.active ? 'Active' : 'Deleted'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="text-blue-500 hover:text-blue-700
                                       text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-700
                                       text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Orders Tab ───────────────────────────────────────────────── */}
      {tab === 'orders' && (
        <EmptyState
          icon="📋"
          title="Orders coming soon"
          message="Order management for sellers will be available soon"
        />
      )}
    </div>
  );
};

export default SellerDashboard;
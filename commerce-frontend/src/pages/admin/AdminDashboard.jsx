import { useEffect, useState } from 'react';
import { getAllProductsAdminApi, createCategoryApi } from '../../api/productApi';
import { getAllOrdersAdminApi, updateOrderStatusApi } from '../../api/orderApi';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllOrdersAdminApi(), getAllProductsAdminApi()])
      .then(([ordRes, prodRes]) => {
        setOrders(ordRes.data);
        setProducts(prodRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const res = await updateOrderStatusApi(orderId, { status });
      setOrders(orders.map((o) => o.id === orderId ? res.data : o));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategoryApi({ name: categoryName });
      alert(`Category "${categoryName}" created!`);
      setCategoryName('');
    } catch {
      alert('Failed to create category');
    }
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading...</div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {orders.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {products.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['orders', 'products', 'categories'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize
                        transition-colors ${
              tab === t
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Order</th>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    ₹{order.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full
                                      font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)}
                      className="text-sm border rounded-lg px-2 py-1 bg-white"
                    >
                      {['PENDING','CONFIRMED','PROCESSING',
                        'SHIPPED','DELIVERED','CANCELLED'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Stock</th>
                <th className="text-left px-6 py-3 text-sm font-medium
                               text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {product.categoryName}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    ₹{product.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {product.stockQuantity}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full
                                      font-medium ${
                      product.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories Tab */}
      {tab === 'categories' && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Add Category</h2>
          <form onSubmit={handleCreateCategory} className="flex gap-3">
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              required
              className="flex-1 border rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white
                         px-6 py-2 rounded-lg font-medium"
            >
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
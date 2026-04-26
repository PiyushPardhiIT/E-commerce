import { useEffect, useState } from 'react';
import { getMyOrdersApi, cancelOrderApi } from '../../api/orderApi';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrdersApi()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    try {
      const res = await cancelOrderApi(orderId);
      setOrders(orders.map((o) => o.id === orderId ? res.data : o));
    } catch (err) {
      alert('Cannot cancel this order');
    }
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-500">
      Loading orders...
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-20 text-gray-500">
      No orders yet
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id}
               className="bg-white rounded-xl border shadow-sm p-6">

            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-gray-800">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium
                                  ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                {(order.status === 'PENDING' ||
                  order.status === 'CONFIRMED') && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 mb-4">
              {order.items?.map((item) => (
                <div key={item.id}
                     className="flex justify-between text-sm text-gray-600">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>₹{item.subtotal?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Total + Address */}
            <div className="border-t pt-3 flex justify-between items-center">
              <p className="text-xs text-gray-400">{order.shippingAddress}</p>
              <p className="font-bold text-blue-600">
                ₹{order.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
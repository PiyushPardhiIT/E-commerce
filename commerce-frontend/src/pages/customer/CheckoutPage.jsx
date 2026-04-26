import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrderApi } from '../../api/orderApi';
import { showSuccess, showError } from '../../utils/toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await placeOrderApi(formData);
      showSuccess(`Order ${res.data.orderNumber} placed successfully!`);
      navigate('/customer/orders');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/customer/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Shipping Form */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
                className="w-full border rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  required
                  className="w-full border rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  required
                  className="w-full border rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="400001"
                  required
                  className="w-full border rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white
                         py-3 rounded-lg font-semibold transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Placing Order...' : `Place Order • ₹${totalAmount?.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border shadow-sm p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.cartItemId}
                   className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.subtotal?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue-600">
              ₹{totalAmount?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
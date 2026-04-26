import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../../app/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, loading } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (cartItemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ cartItemId, quantity }));
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading cart...</div>
  );

  if (items.length === 0) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
      <button
        onClick={() => navigate('/shop')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Cart ({totalItems} items)
        </h1>
        <button
          onClick={handleClear}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="bg-white rounded-xl border p-4 flex
                       items-center gap-4 shadow-sm"
          >
            {/* Product Image */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg
                            flex items-center justify-center flex-shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {item.productName}
              </h3>
              <p className="text-blue-600 font-medium">
                ₹{item.price?.toLocaleString()}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(
                  item.cartItemId, item.quantity - 1
                )}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                −
              </button>
              <span className="px-3 py-1 font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(
                  item.cartItemId, item.quantity + 1
                )}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <p className="font-bold text-gray-800 w-24 text-right">
              ₹{item.subtotal?.toLocaleString()}
            </p>

            {/* Remove */}
            <button
              onClick={() => handleRemove(item.cartItemId)}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-6 bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">
            ₹{totalAmount?.toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => navigate('/customer/checkout')}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white
                     py-3 rounded-lg font-semibold transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
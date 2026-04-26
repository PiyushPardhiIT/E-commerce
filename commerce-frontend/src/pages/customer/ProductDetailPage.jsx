import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../app/slices/productSlice';
import { addToCart } from '../../app/slices/cartSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({
      productId: selectedProduct.id,
      quantity,
    }));
    alert('Added to cart!');
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading...</div>
  );

  if (!selectedProduct) return (
    <div className="text-center py-20 text-gray-500">Product not found</div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-6 block"
      >
        ← Back to Shop
      </button>

      <div className="bg-white rounded-2xl shadow-sm border p-6
                      flex flex-col md:flex-row gap-8">

        {/* Image */}
        <div className="w-full md:w-1/2 h-72 bg-gray-100 rounded-xl
                        flex items-center justify-center">
          {selectedProduct.imageUrl ? (
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <p className="text-blue-600 text-sm font-medium">
            {selectedProduct.categoryName}
          </p>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">
            {selectedProduct.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sold by {selectedProduct.sellerName}
          </p>
          <p className="text-gray-600 mt-4">
            {selectedProduct.description}
          </p>

          <div className="mt-6">
            <span className="text-3xl font-bold text-gray-800">
              ₹{selectedProduct.price?.toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {selectedProduct.stockQuantity > 0
              ? `${selectedProduct.stockQuantity} in stock`
              : 'Out of stock'}
          </p>

          {/* Quantity */}
          {user?.role === 'CUSTOMER' && (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(
                    Math.min(selectedProduct.stockQuantity, quantity + 1)
                  )}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stockQuantity === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white
                           py-2.5 rounded-lg font-medium transition-colors
                           disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
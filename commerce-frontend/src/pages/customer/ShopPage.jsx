import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchProducts,
  fetchCategories,
  searchProducts,
} from '../../app/slices/productSlice';
import { addToCart } from '../../app/slices/cartSlice';
import { showSuccess, showError } from '../../utils/toast';

const ShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, categories, loading } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      dispatch(searchProducts({ name: searchTerm }));
    } else if (selectedCategory) {
      dispatch(searchProducts({ categoryId: selectedCategory }));
    } else {
      dispatch(fetchProducts());
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      dispatch(searchProducts({ categoryId }));
    } else {
      dispatch(fetchProducts());
    }
  };

const handleAddToCart = async (productId) => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }
  if (user?.role !== 'CUSTOMER') {
    showError('Only customers can add to cart');
    return;
  }
  try {
    await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    showSuccess('Added to cart!');
  } catch (err) {
    showError(err || 'Failed to add to cart');
  }
};
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Search + Filter Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg
                       hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-500">
          Loading products...
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                      xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100
                       hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Product Image */}
            <div
              className="h-48 bg-gray-100 flex items-center justify-center
                          cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-4xl">📦</span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">
                {product.categoryName}
              </p>
              <h3
                className="font-semibold text-gray-800 cursor-pointer
                            hover:text-blue-600 transition-colors line-clamp-2"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                by {product.sellerName}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-gray-800">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">
                  Stock: {product.stockQuantity}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={product.stockQuantity === 0}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700
                           text-white py-2 rounded-lg text-sm font-medium
                           transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed"
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../app/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            ShopEase
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/shop"
                  className="text-gray-600 hover:text-blue-600 transition-colors">
              Shop
            </Link>

            {/* Customer links */}
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <>
                {/* Cart with badge */}
                <Link to="/customer/cart"
                      className="relative text-gray-600 hover:text-blue-600">
                  🛒 Cart
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500
                                     text-white text-xs rounded-full
                                     w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link to="/customer/orders"
                      className="text-gray-600 hover:text-blue-600">
                  My Orders
                </Link>
              </>
            )}

            {/* Seller links */}
            {isAuthenticated && user?.role === 'SELLER' && (
              <Link to="/seller/dashboard"
                    className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
            )}

            {/* Admin links */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin/dashboard"
                    className="text-gray-600 hover:text-blue-600">
                Admin Panel
              </Link>
            )}

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden sm:block">
                  Hi, {user?.fullName?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white
                             text-sm px-4 py-1.5 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"
                      className="text-gray-600 hover:text-blue-600 text-sm">
                  Login
                </Link>
                <Link to="/register"
                      className="bg-blue-600 hover:bg-blue-700 text-white
                                 text-sm px-4 py-1.5 rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
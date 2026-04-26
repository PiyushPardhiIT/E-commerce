import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import ShopPage from './pages/customer/ShopPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            success: {
              style: {
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
              },
            },
            error: {
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
              },
            },
          }}
        />

        <Navbar />

        <Routes>

          {/* ── Default ───────────────────────────────────────────── */}
          <Route path="/" element={<Navigate to="/shop" replace />} />

          {/* ── Public Routes ─────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* ── Customer Routes ───────────────────────────────────── */}
          <Route
            path="/customer/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          {/* ── Seller Routes ─────────────────────────────────────── */}
          <Route
            path="/seller/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <SellerDashboard />
              </RoleBasedRoute>
            }
          />

          {/* ── Admin Routes ──────────────────────────────────────── */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />

          {/* ── 404 Catch All ─────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/shop" replace />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
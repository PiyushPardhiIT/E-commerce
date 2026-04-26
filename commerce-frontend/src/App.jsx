import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import ShopPage from './pages/customer/ShopPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Navigate to="/shop" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/shop" element={<ShopPage />} />

          {/* Customer routes */}
          <Route path="/customer/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="orders" element={<div>Orders Page</div>} />
                <Route path="cart" element={<div>Cart Page</div>} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Seller routes */}
          <Route path="/seller/*" element={
            <RoleBasedRoute allowedRoles={['SELLER', 'ADMIN']}>
              <Routes>
                <Route path="dashboard" element={<SellerDashboard />} />
              </Routes>
            </RoleBasedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/*" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Routes>
            </RoleBasedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
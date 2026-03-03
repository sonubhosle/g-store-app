import React, { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Wishlist from './Pages/Wishlist'
import Home from './Pages/Home'
import Footer from './components/Footer'
import ProductListing from './Pages/ProductListing'
import ProductDetail from './Pages/ProductDetail'
import CartPage from './Pages/CartPage'
import CheckoutPage from './Pages/CheckoutPage'
import OrdersPage from './Pages/OrdersPage'
import OrderDetailPage from './Pages/OrderDetailPage'
import OrderSuccessPage from './Pages/OrderSuccessPage'
import OrderTrackingPage from './Pages/OrderTrackingPage'
import ProfilePage from './Pages/ProfilePage'
import SearchResultsPage from './Pages/SearchResultsPage'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import ProtectedRoutes from './components/ProtectedRoutes'
import Layout from './admin/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { restoreAuth } from './states/Auth/Action'
import Dashboard from './admin/dashboard/Dashboard'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminUsers from './admin/AdminUsers'
import ForgotPassword from './Pages/Auth/ForgotPassword'
import ResetPassword from './Pages/Auth/ResetPassword'
const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (auth.jwt && !auth.user) {
      dispatch(restoreAuth());

    }
  }, [dispatch]);

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password/") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="*" element={<div className="py-24 text-center"><h2 className="text-4xl font-black mb-4">404</h2><p className="text-slate-500">Page not found</p></div>} />
        <Route path='/admin/*' element={
          <ProtectedRoutes>
            <Layout />
          </ProtectedRoutes>
        }

        >

          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="groceries" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
      {!hideLayout && <Footer />}
      <ToastContainer />
    </>
  )
}

export default App
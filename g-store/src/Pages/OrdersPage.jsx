import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderHistory } from '../states/Order/Action';
import {
  Package,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Calendar
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.order || state.orders || {});

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'CONFIRMED': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return <CheckCircle2 size={16} />;
      case 'SHIPPED': return <Truck size={16} />;
      case 'CANCELLED': return <XCircle size={16} />;
      case 'PENDING': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10  px-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">My Orders</h1>
          <p className="text-slate-600 mt-2 font-medium">Track and manage your order history</p>
        </div>
        <Link to="/products" className="hidden sm:flex items-center bg-emerald-100 border border-emerald-200 rounded-full px-4 py-2 gap-2 text-emerald-600 font-semibold hover:underline">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>

      {!orders || orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-16 text-center shadow-sm border border-slate-100"
        >
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Package size={48} className="text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">No orders yet</h2>
          <p className="text-slate-500 mb-10 max-w-xs mx-auto">
            Looks like you haven't placed any orders yet. Start shopping to fill this space!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
          >
            Start Shopping <ShoppingBag size={20} />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6 ">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="group bg-white rounded-3xl px-3 py-3 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden">
                    {order.orderItems?.[0]?.product?.image ? (
                      <img src={order.orderItems[0].product.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Package size={32} className="text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {order.orderItems?.length > 1
                        ? `${order.orderItems[0].product.title} + ${order.orderItems.length - 1} more`
                        : order.orderItems[0]?.product?.title || "Product details unavailable"
                      }
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.orderDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><ShoppingBag size={14} /> {order.totalItem} Items</span>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-4">
                  <p className="text-2xl font-semibold text-emerald-600">₹{order.totalDiscountPrice || 0}</p>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.orderStatus)}`}>
                    <StatusIcon status={order.orderStatus} />
                    {order.orderStatus}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
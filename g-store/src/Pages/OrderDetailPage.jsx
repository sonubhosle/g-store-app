import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder, deleteOrder } from '../states/Order/Action';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, loading } = useSelector((state) => state.order || state.orders || {});

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Orders
      </button>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(order.orderDate).toLocaleDateString()}</span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            <span className="flex items-center gap-1.5"><Package size={16} /> {order.totalItem} Items</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED' ? (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this order?")) {
                  dispatch(cancelOrder(order._id));
                }
              }}
              className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold hover:bg-rose-100 transition-all shadow-sm"
            >
              Cancel Order
            </button>
          ) : null}

          {order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED' ? (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this order from your list? It will be moved to history.")) {
                  dispatch(deleteOrder(order._id));
                  navigate('/orders');
                }
              }}
              className="px-6 py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-sm"
            >
              Delete Order
            </button>
          ) : null}

          <button
            onClick={() => navigate(`/order-tracking/${order._id}`)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={order.orderStatus === 'CANCELLED'}
          >
            Track Order
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-8">Order Items</h2>
            <div className="space-y-6">
              {order.orderItems?.map((item) => (
                <div key={item._id} className="flex items-center gap-6 group">
                  <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                    <img src={item.product?.image} alt={item.product?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">{item.product?.brand}</p>
                    <h4 className="font-bold text-slate-900 truncate">{item.product?.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-slate-900">₹{item.discountedPrice * item.quantity}</p>
                    <p className="text-xs text-slate-400">₹{item.discountedPrice} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-8">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recipient</p>
                    <p className="font-bold text-slate-800">{order.shippingAddress?.name} {order.shippingAddress?.surname}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                    <p className="font-bold text-slate-800">{order.shippingAddress?.mobile}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Delivery Address</p>
                  <p className="font-bold text-slate-800 leading-relaxed">
                    {order.shippingAddress?.streetAddress}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-8 flex items-center gap-3">
              <CreditCard className="text-emerald-600" /> Payment Summary
            </h2>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">₹{order.totalPrice}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Savings</span>
                <span className="text-emerald-600 font-bold">-₹{order.discount || 0}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Shipping</span>
                <span className="text-slate-900 font-bold">Free</span>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                <span className="text-slate-900 font-semibold text-lg">Total Paid</span>
                <span className="text-3xl font-semibold text-emerald-600">₹{order.totalDiscountPrice}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Status</p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 size={18} /> Paid via Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
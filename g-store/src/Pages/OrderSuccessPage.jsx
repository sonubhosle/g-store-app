import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById } from '../states/Order/Action';
import {
    CheckCircle,
    ShoppingBag,
    ArrowRight,
    Package,
    Truck,
    Calendar,
    CreditCard,
    MapPin,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, loading } = useSelector((state) => state.order || state.orders || {});

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderById(orderId));
        }
    }, [dispatch, orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
                >
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle size={56} className="text-emerald-500" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4">Order Placed Successfully!</h1>
                    <p className="text-slate-500 text-lg mb-10">
                        Thank you for your purchase. Your order <span className="text-emerald-600 font-bold">#{orderId}</span> has been confirmed and will be processed shortly.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                                <MapPin size={18} className="text-emerald-600" /> Shipping Address
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {order?.shippingAddress?.name} {order?.shippingAddress?.surname}<br />
                                {order?.shippingAddress?.streetAddress}<br />
                                {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zipCode}
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                                <CreditCard size={18} className="text-emerald-600" /> Payment Info
                            </h3>
                            <div className="space-y-2">
                                <p className="text-slate-600 text-sm flex justify-between">
                                    <span>Method:</span>
                                    <span className="font-bold text-slate-900">Razorpay Online</span>
                                </p>
                                <p className="text-slate-600 text-sm flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-bold text-emerald-600">₹{order?.totalPayablePrice}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate(`/orders/${order?._id}`)}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200"
                        >
                            View Order Details <ChevronRight size={20} />
                        </button>
                        <Link
                            to="/products"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100"
                        >
                            Continue Shopping <ShoppingBag size={20} />
                        </Link>
                    </div>
                </motion.div>

                {/* Tracking Info Preview */}
                <div className="mt-8 bg-emerald-600 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full -mr-24 -mt-24 opacity-20 blur-2xl" />
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                            <Truck size={28} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">Track your delivery</h3>
                            <p className="text-emerald-100 font-medium">Get real-time updates on your order status.</p>
                        </div>
                    </div>
                    <Link
                        to={`/order-tracking/${orderId}`}
                        className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2"
                    >
                        Track Order <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;

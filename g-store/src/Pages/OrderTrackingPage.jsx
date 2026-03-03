import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../states/Order/Action';
import {
    ArrowLeft,
    Truck,
    MapPin,
    CheckCircle2,
    Clock,
    Loader2,
    Package,
    Navigation,
    RefreshCcw,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTrackingPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, loading } = useSelector((state) => state.order || state.orders || {});
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        dispatch(getOrderById(id));
        const interval = setInterval(() => {
            dispatch(getOrderById(id));
            setLastUpdate(new Date().toLocaleTimeString());
        }, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [dispatch, id]);

    if (loading && !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    const steps = [
        { title: 'Order Confirmed', description: 'Your order has been received and verified.', icon: Package, status: 'CONFIRMED' },
        { title: 'Processing', description: 'We are hand-picking your fresh groceries.', icon: RefreshCcw, status: 'PROCESSING' },
        { title: 'In Transit', description: 'Your order is on the way to your location.', icon: Truck, status: 'SHIPPED' },
        { title: 'Delivered', description: 'Successfully delivered to your doorstep.', icon: CheckCircle2, status: 'DELIVERED' }
    ];

    const currentStatus = order?.orderStatus?.toUpperCase() || 'PENDING';
    const activeStepIndex = steps.findIndex(s => s.status === currentStatus);
    const progress = Math.max(0, activeStepIndex + 1);

    return (
        <div className="min-h-screen bg-slate-50  py-10 px-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-emerald-600 transition-colors"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-4xl font-semibold text-slate-900">Track Order</h1>
                    <p className="text-slate-500 mt-2 font-medium">Tracking ID: #{id?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                    <p className="text-lg font-semibold text-emerald-600">Today, 2:00 PM - 4:00 PM</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stepper Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[40px] p-8 sm:p-12 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-semibold text-slate-900">Live Status</h2>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                Last Update: {lastUpdate}
                            </div>
                        </div>

                        <div className="space-y-12 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {steps.map((step, i) => {
                                const isCompleted = i < progress;
                                const isActive = i === activeStepIndex;
                                return (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-8 relative"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${isCompleted ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-2 border-slate-100 text-slate-300'
                                            }`}>
                                            <step.icon size={24} className={isActive ? 'animate-bounce' : ''} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className={`font-semibold text-lg ${isActive ? 'text-emerald-600' : isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                                                    {step.title}
                                                </h3>
                                                {isActive && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase rounded-lg">Now</span>}
                                            </div>
                                            <p className={`text-sm leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500 rounded-full opacity-20 blur-3xl" />
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Navigation className="text-emerald-400" /> Delivery To
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} className="text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Address</p>
                                    <p className="font-bold text-sm leading-relaxed">
                                        {order?.shippingAddress?.streetAddress}, {order?.shippingAddress?.city}, {order?.shippingAddress?.zipCode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6">
                            <ShieldCheck className="text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Contactless Delivery Active</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Partner</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-semibold text-slate-400">
                                GS
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">G-Store Express</p>
                                <p className="text-xs text-slate-400 font-bold">Verified Partner</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;

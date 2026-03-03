import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../states/Order/Action';
import {
    Search,
    Eye,
    Trash2,
    ChevronDown,
    Loader2,
    Calendar,
    Clock,
    XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.order || state.orders || {});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const buttonRefs = useRef({});

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdownId) {
                // Check if click is outside any dropdown button and the dropdown menu
                const isClickInsideDropdown = event.target.closest('.status-dropdown-menu');
                const isClickOnButton = event.target.closest('.status-dropdown-button');

                if (!isClickInsideDropdown && !isClickOnButton) {
                    setOpenDropdownId(null);
                }
            }
        };

        const handleScroll = () => {
            if (openDropdownId) {
                // Update dropdown position on scroll
                const button = buttonRefs.current[openDropdownId];
                if (button) {
                    const rect = button.getBoundingClientRect();
                    setDropdownPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX + (rect.width / 2),
                    });
                }
            }
        };

        const handleResize = () => {
            if (openDropdownId) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [openDropdownId]);

    // Update position when dropdown opens
    useEffect(() => {
        if (openDropdownId) {
            const button = buttonRefs.current[openDropdownId];
            if (button) {
                const rect = button.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX + (rect.width / 2),
                });
            }
        }
    }, [openDropdownId]);

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !newStatus) return;

        setIsUpdating(true);
        try {
            await dispatch(updateOrderStatus(selectedOrder._id, newStatus));
            toast.success(`Order status updated to ${newStatus}`);
            setIsStatusModalOpen(false);
            setSelectedOrder(null);
            setNewStatus('');
        } catch (error) {
            toast.error(error.message || 'Failed to update order status');
        } finally {
            setIsUpdating(false);
        }
    };

    const openStatusModal = (order, status) => {
        setSelectedOrder(order);
        setNewStatus(status);
        setIsStatusModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Permanently delete this order?')) {
            dispatch(deleteOrder(id));
            toast.success('Order deleted');
        }
    };

    const toggleDropdown = (orderId, event) => {
        event.stopPropagation();
        event.preventDefault();

        // Store button reference
        if (!buttonRefs.current[orderId]) {
            buttonRefs.current[orderId] = event.currentTarget;
        }

        setOpenDropdownId(openDropdownId === orderId ? null : orderId);
    };

    const filteredOrders = orders?.filter(o => {
        const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'CONFIRMED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'PLACED': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (loading && !orders) {
        return (
            <div className="h-[600px] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Order Management</h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitor and process all customer orders.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <Calendar size={18} /> Select Date
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col lg:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['ALL', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-5 py-3 rounded-2xl font-bold text-xs transition-all border ${statusFilter === status
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                                    : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-4 pl-4">Order Details</th>
                                <th className="pb-4">Items</th>
                                <th className="pb-4">Total</th>
                                <th className="pb-4 text-center">Status</th>
                                <th className="pb-4 text-center">Change Status</th>
                                <th className="pb-4 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {filteredOrders?.map((order) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-6 pl-4">
                                            <div>
                                                <p className="font-black text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                                                    <Clock size={10} /> {new Date(order.orderDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className="text-sm font-bold text-slate-600">{order.totalItem} products</span>
                                        </td>
                                        <td className="py-6 font-black text-emerald-600">₹{order.totalPrice || 0}</td>
                                        <td className="py-6">
                                            <div className="flex justify-center">
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${getStatusStyle(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={(e) => toggleDropdown(order._id, e)}
                                                    className={`status-dropdown-button px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${openDropdownId === order._id
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    Change <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdownId === order._id ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right pr-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => handleDelete(order._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dropdown Portal */}
            {openDropdownId && createPortal(
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                        position: 'absolute',
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        transform: 'translateX(-50%) translateY(8px)',
                        zIndex: 99999,
                    }}
                    className="status-dropdown-menu bg-white w-35 shadow-2xl rounded-xl border border-slate-100 py-1 overflow-hidden"
                >
                    {['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => {
                        const order = orders?.find(o => o._id === openDropdownId);
                        return (
                            <button
                                key={s}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (order) {
                                        openStatusModal(order, s);
                                        setOpenDropdownId(null);
                                    }
                                }}
                                className="w-full px-4 py-2.5 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                                {s}
                            </button>
                        );
                    })}
                </motion.div>,
                document.body
            )}

            {/* Status Update Confirmation Modal */}
            <AnimatePresence>
                {isStatusModalOpen && (
                    <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-slate-900">Update Status</h2>
                                <button
                                    onClick={() => setIsStatusModalOpen(false)}
                                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                                    disabled={isUpdating}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <p className="text-slate-500 font-medium">Are you sure you want to change the status of order <span className="font-black text-slate-900">#{selectedOrder?._id.slice(-8).toUpperCase()}</span> to:</p>
                                    <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-black border ${getStatusStyle(newStatus)}`}>
                                        {newStatus}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsStatusModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all"
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleStatusUpdate}
                                        className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Accept Changes"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
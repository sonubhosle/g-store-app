import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findUserCart, updateCartItemQuantity, removeCartItem } from '../states/Cart/Action';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBasket,
  ChevronLeft,
  Loader2,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(findUserCart());
  }, [dispatch]);

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemQuantity(cartItemId, newQuantity));
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItem(cartItemId));
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-12 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShoppingBasket size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">Your cart is empty</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Let's find some fresh groceries!
          </p>
          <Link
            to="/products"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-100"
          >
            Start Shopping <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="px-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-semibold text-slate-900">Cart <span className="text-emerald-600">({items.length})</span></h1>
              <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                <ChevronLeft size={18} /> Continue Shopping
              </Link>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6"
                  >
                    {/* Image */}
                    <div className="w-28 h-28 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                            {item.product?.brand}
                          </p>
                          <h3 className="text-lg font-bold text-slate-900 truncate">
                            {item.product?.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-slate-900">₹{item.discountedPrice}</p>
                          {item.price > item.discountedPrice && (
                            <p className="text-sm text-slate-400 line-through">₹{item.price}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500 active:scale-90"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500 active:scale-90"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 sticky top-28">
              <h2 className="text-2xl font-semibold text-slate-900 mb-8 flex items-center gap-3">
                <ShoppingBag className="text-emerald-600" /> Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{cart?.totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Discount</span>
                  <span className="text-emerald-600 font-bold">-₹{cart?.discount || 0}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Delivery</span>
                  <span className="text-slate-900 font-bold">Free</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                    <p className="text-xs text-slate-400 italic">including VAT</p>
                  </div>
                  <span className="text-3xl font-semibold text-emerald-600">₹{cart?.totalPayable}</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="relative mb-8 group">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold placeholder:font-medium"
                />
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-emerald-600 font-semibold text-xs rounded-xl shadow-sm hover:bg-emerald-50 transition-colors border border-emerald-100">
                  APPLY
                </button>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-95 group mb-6"
              >
                Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={16} /> Secure Checkout Guaranteed
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
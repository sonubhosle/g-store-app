import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { findUserCart, removeCartItem, updateCartItemQuantity } from '../states/Cart/Action';

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cart, items, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && isOpen) {
      dispatch(findUserCart());
    }
  }, [dispatch, user, isOpen]);

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateCartItemQuantity(cartItemId, newQuantity));
    }
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItem(cartItemId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none">Your Cart</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                    {cart?.totalItem || 0} Items Reserved
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900 active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {!items || items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6"
                  >
                    <ShoppingBag size={48} className="text-slate-200" />
                  </motion.div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Empty Sanctuary</h3>
                  <p className="text-slate-500 font-medium mb-8">
                    Your cart is awaiting its first premium selection. Let's fill it with quality.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:shadow-lg hover:shadow-slate-100 transition-all group relative"
                  >
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-2">
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-8">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                        {item.product?.title}
                      </h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {item.product?.category}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-black text-slate-900">
                          ₹{item.discountedPrice}
                        </span>

                        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || loading}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-emerald-600 transition-all disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            disabled={loading}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-emerald-600 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 p-1 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items && items.length > 0 && (
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span>₹{cart?.totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-emerald-600 uppercase tracking-wider">
                    <span>Savings</span>
                    <span>-₹{cart?.discount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black text-slate-900">Total Payable</span>
                    <span className="text-2xl font-black text-emerald-600">₹{cart?.totalPayable}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full py-4 text-center bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Review Basket
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 group/btn"
                  >
                    Initialize Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          <style dangerouslySetInnerHTML={{
            __html: `
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}} />
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

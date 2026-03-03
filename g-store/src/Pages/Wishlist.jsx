import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft, Trash2, ShoppingBasket, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { getWishlist, removeItemFromWishlist } from '../states/Wishlist/Action';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromWishlist(id));
  };

  const wishlistItems = wishlist?.wishlistItems || [];

  if (loading && !wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-12 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Heart size={48} className="text-rose-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Your wishlist is empty</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Save your favorite fresh items here to keep track of them and buy them later!
          </p>
          <Link
            to="/products"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-100"
          >
            Explore Products <ArrowLeft size={20} className="rotate-180" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900">My Wishlist</h1>
            <p className="text-slate-500 mt-2 font-medium">You have {wishlistItems.length} items saved</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
          >
            <ChevronLeft size={18} /> Continue Shopping
          </Link>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.product?._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-full">
                  <ProductCard product={item.product} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {wishlistItems.length > 0 && (
          <div className="mt-16 p-10 bg-emerald-600 rounded-[3rem] shadow-2xl shadow-emerald-200 overflow-hidden relative">
            {/* decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full -ml-20 -mb-20 opacity-30 blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                  <ShoppingBag size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Ready to fill your basket?</h3>
                  <p className="text-emerald-100 font-medium">Add all your favorites to your cart and get them delivered today.</p>
                </div>
              </div>
              <Link
                to="/cart"
                className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center gap-3"
              >
                Go to Shopping Cart <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

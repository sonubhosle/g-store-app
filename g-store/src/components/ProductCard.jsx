import React from 'react'
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../states/Cart/Action'
import { addItemToWishlist, removeItemFromWishlist, getWishlist } from '../states/Wishlist/Action'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion';
import { Heart, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProductCard = ({ product }) => {

  const dispatch = useDispatch()
  const { wishlist } = useSelector(state => state.wishlist || {});
  const { _id, title, price, image, discountedPrice, brand, discount, category, numRatings, numReviews, stock } = product;

  const isInWishlist = wishlist?.wishlistItems?.some(item => item.product?._id === _id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItemToCart(_id));
    toast.success('Added to Cart');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeItemFromWishlist(_id));
    } else {
      dispatch(addItemToWishlist(_id));
    }
  };

  const isOutOfStock = (stock || 0) <= 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[32px] p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full relative"
    >
      <Link to={`/product/${product._id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-lg z-10">
            {discount}% OFF
          </div>
        )}

        {/* stock badge */}
        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md z-10 border ${isOutOfStock ? 'bg-red-500 text-white border-red-400' : 'bg-white/90 backdrop-blur-md text-emerald-600 border-emerald-100'}`}>
          {isOutOfStock ? 'Out of Stock' : stock < 10 ? `Only ${stock} Left` : 'In Stock'}
        </div>

        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-xl transition-all duration-300 z-10 shadow-sm ${isInWishlist
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500'
            }`}
        >
          <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-700">{numRatings || 0}</span>
          <span className="text-[10px] text-slate-400">({numReviews || 0})</span>
        </div>

        <Link to={`/product/${product._id}`} className="font-bold text-slate-800 line-clamp-1 hover:text-emerald-600 transition-colors mb-1">
          {title}
        </Link>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{category}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900">₹{discountedPrice}</span>
            {price > discountedPrice && (
              <span className="text-xs text-slate-400 line-through">₹{price}</span>
            )}
          </div>

          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm group/btn"
            >
              <Plus size={20} className="group-hover/btn:scale-125 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
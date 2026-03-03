import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, getRelatedProducts } from '../states/Products/Action';
import { addItemToCart } from '../states/Cart/Action';
import { addItemToWishlist, removeItemFromWishlist } from '../states/Wishlist/Action';
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Loader2,
  Zap
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewsSection from './ProductDetail/ReviewsSection';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { product, relatedProducts, loading } = useSelector((state) => state.products);
  const { wishlist } = useSelector((state) => state.wishlist || {});

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getRelatedProducts(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const isInWishlist = wishlist?.wishlistItems?.some(item => item.product?._id === id);

  const handleAddToCart = () => {
    dispatch(addItemToCart(id));
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    dispatch(addItemToCart(id));
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeItemFromWishlist(id));
    } else {
      dispatch(addItemToWishlist(id));
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const isOutOfStock = (product.stock || 0) <= 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-emerald-600 cursor-pointer" onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-[32px] shadow-sm border border-slate-100">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-100 rounded-3xl overflow-hidden group border border-slate-200">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-emerald-600 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                  -{product.discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-4xl font-black text-slate-900 mt-4 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-700">{product.numRatings || 0}</span>
                  <span className="text-slate-400 text-xs">({product.numReviews || 0} Reviews)</span>
                </div>

                {/* Stock Status */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isOutOfStock ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                  {isOutOfStock ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black text-emerald-600">₹{product.discountedPrice}</span>
                {product.price > product.discountedPrice && (
                  <span className="text-xl text-slate-400 line-through font-medium">₹{product.price}</span>
                )}
              </div>
              <p className="text-slate-500 text-sm italic">inclusive of all taxes</p>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8 line-clamp-3">
              {product.description}
            </p>

            {/* Quantity and Actions */}
            {!isOutOfStock && (
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white rounded-xl transition-all text-slate-600 active:scale-90"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-xl text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="p-3 hover:bg-white rounded-xl transition-all text-slate-600 active:scale-90"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-emerald-200 text-sm sm:text-base"
                    >
                      <ShoppingBag size={20} /> Add to Cart
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-4 rounded-2xl transition-all border ${isInWishlist
                        ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200'
                        : 'bg-slate-100 text-slate-600 border-transparent hover:border-rose-100 hover:bg-rose-50 hover:text-rose-500'
                        }`}
                    >
                      <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 text-sm sm:text-base"
                  >
                    <Zap size={18} className="text-yellow-400" /> Buy Now — Go to Checkout
                  </button>
                </div>
              </div>
            )}

            {/* Features Info */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <Truck size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-x border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Safe Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  <RotateCcw size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">7 Days Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs / Detailed Info */}
        <div className="mt-12 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <div className="flex gap-8 border-b border-slate-100 mb-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
                <ul className="mt-6 space-y-3">
                  {['100% Organic Sourced', 'Freshness Guaranteed', 'Sustainable Packaging', 'Direct from Farms'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {[
                  { label: 'Brand', value: product.brand },
                  { label: 'Category', value: product.category },
                  { label: 'SKU', value: product.productSku },
                  { label: 'Weight', value: '1kg' },
                  { label: 'Shelf Life', value: '7 Days' },
                  { label: 'Storage', value: 'Refrigerated' }
                ].map((spec, i) => (
                  <div key={i} className="flex border-b border-slate-50 py-3">
                    <span className="w-1/3 text-slate-400 font-medium">{spec.label}</span>
                    <span className="text-slate-900 font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-500">
                <ReviewsSection productId={id} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

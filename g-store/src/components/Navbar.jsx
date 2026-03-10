
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBasket,
  Search,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShoppingBag,
  Package,
} from 'lucide-react';
import { toast } from 'react-toastify'

import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../Data/mockData';
import { useDispatch, useSelector } from 'react-redux';
import { findUserCart } from '../states/Cart/Action';
import { logoutUser } from '../states/Auth/Action';
import { getWishlist } from '../states/Wishlist/Action';
import { getAllProducts, getSuggestions } from '../states/Products/Action';
// Helper: wrap matching substring with <mark>
const HighlightMatch = ({ text, query }) => {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-emerald-100 text-emerald-800 rounded px-0.5 not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
};

const Navbar = () => {
  const dispatch = useDispatch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)
  const { wishlist } = useSelector((state) => state.wishlist || {})
  const { suggestions: products } = useSelector((state) => state.products)
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(findUserCart())
    dispatch(getWishlist())
    // Load products globally so search suggestions always work
    dispatch(getSuggestions())
  }, [dispatch])

  // Close suggestions on click-outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    toast.success('Logged out successfully', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
    });
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length > 1 && products) {
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <nav className="px-12 ">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-13 h-13 bg-linear-to-tr from-emerald-600 to-teal-400 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <ShoppingBasket className="text-white" size={24} />
              </div>
              <span className="">
                <p className='text-3xl font-black tracking-tight text-slate-900'>Plant<span className="text-emerald-600">ify</span></p>
                <p className='text-slate-600 text-sm flex items-center gap-2 mt-1'><div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-200"></div> Grow - Green</p>
              </span>
            </Link>

            {/* Desktop Search */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search fresh groceries..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                  className="w-full bg-slate-100 border border-slate-200 focus:outline-none focus:bg-white focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-400 rounded-3xl py-2.5 pl-12 pr-4 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
                    </p>
                    {suggestions.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => {
                          navigate(`/product/${item._id}`);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left group"
                      >
                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                          <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            <HighlightMatch text={item.title} query={searchQuery} />
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase">{item.brand}</span>
                            <span className="text-xs text-slate-400">{item.category}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-emerald-600">₹{item.discountedPrice}</p>
                          {item.price > item.discountedPrice && (
                            <p className="text-[10px] text-slate-400 line-through">₹{item.price}</p>
                          )}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full px-4 py-3 bg-slate-50 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-slate-100 flex items-center gap-2"
                    >
                      <Search size={14} />
                      See all results for &ldquo;{searchQuery}&rdquo;
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-4">
              <Link to="/wishlist" className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative">
                <Heart size={24} />
                {user && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {wishlist?.wishlistItems?.length || 0}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative"
              >
                <ShoppingBag size={24} />

                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {cart?.totalItem}
                </span>

              </button>

              <div className="relative">
                {user ? (
                  <>
                    {/* Logged In Button */}
                    <button
                      onMouseEnter={() => setIsProfileOpen(true)}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="hidden sm:flex items-center gap-2 px-2 py-1 pr-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                    >
                      <div className="w-10 h-10 bg-white overflow-hidden rounded-xl flex items-center justify-center shadow-sm">
                        {user?.photo ? (
                          <img
                            src={user.photo}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon size={18} className="text-slate-500" />
                        )}
                      </div>

                      <div className="leading-tight text-left">
                        <span className="text-xs font-semibold text-slate-500">
                          Welcome
                        </span>
                        <p className="text-sm font-bold text-slate-800">
                          {user?.name} {user?.surname}
                        </p>
                      </div>

                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          onMouseLeave={() => setIsProfileOpen(false)}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden py-3 z-50"
                        >
                          {/* User Info */}
                          <div className="px-6 py-4 border-b border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                              {user?.name} {user?.surname}
                            </p>
                            <p className="font-bold text-slate-900 truncate">
                              {user?.email}
                            </p>
                          </div>

                          {/* Menu Links */}
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <UserIcon size={18} />
                            <span className="font-bold text-sm">My Profile</span>
                          </Link>

                          <Link
                            to="/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <Package size={18} />
                            <span className="font-bold text-sm">My Orders</span>
                          </Link>

                          <Link
                            to="/cart"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between px-6 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <ShoppingBag size={18} />
                              <span className="font-bold text-sm">Shopping Cart</span>
                            </div>
                            {cart?.totalItem > 0 && (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {cart.totalItem}
                              </span>
                            )}
                          </Link>

                          <Link
                            to="/wishlist"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <Heart size={18} />
                            <span className="font-bold text-sm">Wishlist</span>
                          </Link>

                          <hr className="my-2 border-slate-100" />

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-6 py-3 text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <LogOut size={18} />
                            <span className="font-bold text-sm">Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  /* Not Logged In */
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
                  >
                    <UserIcon size={18} />
                    Sign In
                  </Link>
                )}
              </div>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Categories Bar (Desktop) */}
        <div className="hidden md:block bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 h-12 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="text-sm font-medium text-slate-500 hover:text-emerald-600 whitespace-nowrap transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </header >

      {/* Mobile Menu Overlay */}
      < AnimatePresence >
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 md:hidden bg-white pt-20"
          >
            <div className="p-4 space-y-6 overflow-y-auto max-h-screen">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search groceries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </form>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                      <span className="text-emerald-600 font-bold text-sm">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-2">
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl font-bold text-slate-700">
                  <Package size={20} /> My Orders
                </Link>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl font-bold text-slate-700">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={20} /> My Cart
                  </div>
                  {cart?.totalItem > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {cart.totalItem}
                    </span>
                  )}
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 bg-emerald-600 text-white rounded-2xl font-bold justify-center"
                >
                  <UserIcon size={20} />
                  Login / Signup
                </Link>
              </div>
            </div>
          </motion.div>
        )
        }
      </AnimatePresence >

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, updatePaymentInformation } from '../states/Order/Action';
import { findUserCart } from '../states/Cart/Action';
import { getUserAddresses } from '../states/Auth/Action';
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  ChevronLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Phone,
  User,
  Mail,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, items } = useSelector((state) => state.cart);
  const { order, loading: orderLoading } = useSelector((state) => state.order || state.orders || {});
  const { addresses } = useSelector((state) => state.auth);

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    mobile: '',
    streetAddress: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  });

  useEffect(() => {
    dispatch(findUserCart());
    dispatch(getUserAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (order?._id) {
      dispatch(updatePaymentInformation({ orderId: order._id }));
    }
  }, [order, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (selectedAddressId) setSelectedAddressId(null);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id);
    setFormData({
      name: address.name,
      surname: address.surname,
      email: address.email,
      mobile: address.mobile,
      streetAddress: address.streetAddress || address.landmark, // fallback if needed
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.streetAddress || !formData.landmark || !formData.city || !formData.pincode || !formData.mobile || !formData.country) {
      toast.error("Please fill in all shipping details");
      return;
    }

    const orderData = {
      shippingAddress: formData,
    };

    dispatch(createOrder(orderData));
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 text-center">
        <p>Your cart is empty. Redirecting...</p>
        {setTimeout(() => navigate('/products'), 2000)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 sm:p-12 shadow-sm border border-slate-100"
            >
              <h1 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <MapPin className="text-emerald-600" size={32} /> Shipping Details
              </h1>

              {addresses?.length > 0 && (
                <div className="mb-10">
                  <p className="text-sm font-bold text-slate-500 mb-4 ml-1">Select from Saved Addresses</p>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {addresses.map((addr) => (
                      <motion.div
                        key={addr._id}
                        whileHover={{ y: -4 }}
                        onClick={() => handleAddressSelect(addr)}
                        className={`flex-shrink-0 w-64 p-5 rounded-3xl border-2 transition-all cursor-pointer ${selectedAddressId === addr._id
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100'
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-black text-slate-900">{addr.name} {addr.surname}</p>
                          {selectedAddressId === addr._id && (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                              <CheckCircle2 size={12} />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {addr.streetAddress || addr.landmark}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">{addr.mobile}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateOrder} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="text" name="surname" required value={formData.surname} onChange={handleChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="email" name="email" required value={formData.email} onChange={handleChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="tel" name="mobile" required value={formData.mobile} onChange={handleChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Street Address</label>
                    <div className="relative group">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="text" name="streetAddress" required value={formData.streetAddress} onChange={handleChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        placeholder="123 Fresh Lane"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Landmark</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="text" name="landmark" required value={formData.landmark} onChange={handleChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        placeholder="Near Central Park"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">City</label>
                    <input
                      type="text" name="city" required value={formData.city} onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">State</label>
                    <input
                      type="text" name="state" required value={formData.state} onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Pincode</label>
                    <input
                      type="text" name="pincode" required value={formData.pincode} onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
                    <input
                      type="text" name="country" required value={formData.country} onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                      placeholder="India"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-800 text-sm font-bold border border-emerald-100">
                    <Truck size={20} className="text-emerald-600" />
                    Free expression delivery on all orders above ₹500!
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4">
            <div className="space-y-8 sticky top-28">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <ShoppingBag className="text-emerald-600" /> Order Summary
                </h2>

                <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-8 no-scrollbar">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                        <img src={item.product?.image} alt={item.product?.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate text-sm">{item.product?.title}</h4>
                        <p className="text-xs text-slate-500">{item.quantity} x ₹{item.discountedPrice}</p>
                      </div>
                      <span className="font-black text-slate-900">₹{item.discountedPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex justify-between text-slate-500 font-medium text-sm">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-bold">₹{cart?.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium text-sm">
                    <span>Savings</span>
                    <span className="text-emerald-600 font-bold">-₹{cart?.discount || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium text-sm">
                    <span>Shipping</span>
                    <span className="text-slate-900 font-bold">Free</span>
                  </div>
                  <div className="pt-4 flex justify-between items-end">
                    <span className="text-slate-900 font-black text-xl">Total</span>
                    <span className="text-3xl font-black text-emerald-600">₹{cart?.totalPayable}</span>
                  </div>
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={orderLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-200 mt-10 active:scale-95 group"
                >
                  {orderLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={20} />
                      PLACE ORDER NOW
                    </>
                  )}
                </button>

                <div className="mt-8 flex items-center justify-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  Secure payment processed via Razorpay
                </div>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full -mr-16 -mt-16 opacity-20 blur-2xl" />
                <div className="flex items-center gap-4 mb-2">
                  <CheckCircle2 className="text-emerald-400" />
                  <span className="font-bold">Guaranteed Delivery</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Your groceries will be hand-picked and delivered to your doorstep with maximum care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

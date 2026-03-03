import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Package,
  Heart,
  Settings,
  Bell,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser, getUserProfile, updateUserProfile, forgotPassword } from '../states/Auth/Action';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    mobile: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        mobile: user.mobile || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      await dispatch(updateUserProfile(formData));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: 'My Account', icon: User, color: 'text-blue-500 bg-blue-50' },
    { id: 'settings', label: 'Security & Password', icon: ShieldCheck, color: 'text-purple-500 bg-purple-50' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 overflow-hidden relative">
              {/* header decoration */}
              <div className="absolute top-0 left-0 w-full h-32 bg-slate-900 z-0" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-xl relative overflow-hidden">
                    {user.photo ? (
                      <img src={user.photo} alt="Profile" className="w-full h-full rounded-[2rem] object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white text-4xl font-black shadow-inner">
                        {user.name?.[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 p-3 bg-white hover:bg-slate-50 rounded-2xl text-slate-600 shadow-xl border border-slate-100 transition-all active:scale-90 cursor-pointer">
                    <Camera size={18} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('photo', file);
                          try {
                            await dispatch(updateUserProfile(formData));
                            toast.success("Profile photo updated!");
                          } catch (err) {
                            toast.error("Failed to upload photo");
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{user.name} {user.surname}</h2>
                <p className="text-slate-400 font-bold text-sm tracking-wide lowercase mt-1">{user.email}</p>

                <div className="w-full grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-slate-50 rounded-3xl p-4 text-center border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                    <p className="text-xl font-black text-slate-900">12</p>
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-4 text-center border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Points</p>
                    <p className="text-xl font-black text-emerald-600">450</p>
                  </div>
                </div>

                <div className="w-full space-y-2 mt-10">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => item.link ? navigate(item.link) : setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl border border-transparent group-hover:bg-white transition-all ${activeTab === item.id ? 'bg-white border-emerald-100' : 'bg-white'
                          }`}>
                          <item.icon size={20} className={item.color.split(' ')[0]} />
                        </div>
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      <ChevronRight size={18} className={activeTab === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all mt-4 font-bold"
                  >
                    <div className="p-2 rounded-xl bg-white group-hover:bg-white transition-all border border-transparent">
                      <LogOut size={20} />
                    </div>
                    <span className="text-sm">Log Out Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[40px] p-8 sm:p-12 shadow-sm border border-slate-100"
            >
              {activeTab === 'profile' && (
                <>
                  <div className="flex items-center justify-between mb-10">
                    <h1 className="text-3xl font-black text-slate-900">Personal Details</h1>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                        >
                          <X size={20} />
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          className="p-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">First Name</label>
                        {isEditing ? (
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                          />
                        ) : (
                          <div className="px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-50">{user.name}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Last Name</label>
                        {isEditing ? (
                          <input
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                          />
                        ) : (
                          <div className="px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-50">{user.surname}</div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <div className="px-5 py-4 bg-slate-100 rounded-2xl font-bold text-slate-400 border border-slate-50 flex items-center justify-between cursor-not-allowed">
                        <span>{user.email}</span>
                        <ShieldCheck size={18} className="text-emerald-500 opacity-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                        {isEditing ? (
                          <input
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            placeholder="+1 234 567 890"
                          />
                        ) : (
                          <div className="px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-50">{user.mobile || 'Not added'}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Member Since</label>
                        <div className="px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-50">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000 -mr-32 -mt-32 opacity-20 blur-3xl" />
                    <h3 className="text-xl font-black mb-4">G-Store Premium Member</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                      Unlock exclusive farm-fresh deals and priority delivery on every order.
                    </p>
                    <button className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40">
                      View Benefits
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-10">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Security Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your password and account security.</p>
                  </div>

                  <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">Forgot Password?</h3>
                        <p className="text-xs text-slate-500 font-bold">Request a reset link to your email</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        If you've forgotten your password or want to change it, click the button below. We'll send a secure link to <span className="font-bold text-slate-900">{user.email}</span>.
                      </p>
                      <button
                        onClick={async () => {
                          try {
                            await dispatch(forgotPassword(user.email));
                            toast.success("Password reset link sent to your email!");
                          } catch (err) {
                            toast.error("Failed to send reset link");
                          }
                        }}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                      >
                        Send Reset Link
                      </button>
                    </div>
                  </div>

                  <div className="p-8 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-center">
                    <Settings className="text-slate-200 mb-4" size={48} />
                    <h4 className="font-black text-slate-400">Two-Factor Authentication</h4>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Coming Soon</p>
                  </div>
                </div>
              )}

              {['notifications'].includes(activeTab) && (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                  <p className="text-slate-400 font-bold mb-4 italic">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} features coming soon...</p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Return to Profile
                  </button>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
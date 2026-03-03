import { useState, useEffect } from 'react';
import { Users, Menu, X, LayoutDashboard, LogOut, ClipboardList, Leaf, Package, UserRound, ChevronRight, Sparkles } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, logoutUser } from '../states/Auth/Action';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt && !user) dispatch(getUserProfile());
  }, [dispatch, user]);

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

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', color: 'from-violet-400 to-purple-400' },
    { icon: Leaf, label: 'Grocery', path: '/admin/groceries', color: 'from-emerald-400 to-teal-400' },
    { icon: ClipboardList, label: 'Orders', path: '/admin/orders', color: 'from-amber-400 to-orange-400' },
    { icon: Users, label: 'Users', path: '/admin/users', color: 'from-blue-400 to-cyan-400' },
  ];

  if (loading && !user) {
    return (
      <aside className="fixed lg:relative top-0 left-0 h-screen w-70 bg-white z-40 flex items-center justify-center shadow-[20px_0_50px_rgba(0,0,0,0.02)] border-r border-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400 font-bold">Loading dashboard...</span>
        </div>
      </aside>
    );
  }

  if (!user) {
    return (
      <aside className="fixed lg:relative top-0 left-0 h-screen w-70 bg-white z-40 flex items-center justify-center shadow-[20px_0_50px_rgba(0,0,0,0.02)] border-r border-slate-100">
        <div className="text-center px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <X className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-slate-500 font-bold mb-4">Unable to load profile</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition-all duration-300 shadow-lg shadow-emerald-100"
          >
            Go to Login
          </button>
        </div>
      </aside>
    );
  }

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-5.5 z-50 p-3 bg-emerald-500 backdrop-blur-2xl  rounded-2xl shadow-2xl hover:bg-slate-800/90 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Toggle menu" >
        {isMobileOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
      </button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity animate-fadeIn"
          onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
          fixed lg:relative top-0 left-0 h-screen 
          bg-white
          z-40 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.02)] border-r border-slate-100
          transition-all duration-500 ease-out
          ${isOpen ? 'w-74' : 'w-24'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/[0.02] via-transparent to-violet-500/[0.02] pointer-events-none" />

        {/* Header */}
        <div className={`relative flex items-center px-6 py-6 border-b border-slate-50 shrink-0 transition-all duration-500 ${isOpen ? "justify-between px-5" : "justify-center"
          }`} >

          <div className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            {/* Logo Icon */}
            <div className="relative group">
              <div className="relative w-11 h-11 bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                <Sparkles size={22} className="fill-white/20" />
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <p className='text-xl font-black text-slate-900 tracking-tight'>G-Admin</p>
              <div className='flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-emerald-600'>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                Super Admin
              </div>
            </div>
          </div>

          {/* Toggle button */}
          <button onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-2xl transition-all duration-300 ${isOpen
              ? 'bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-100'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 shadow-sm'
              }`}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <Menu size={20} className={`transition-transform duration-500 ${!isOpen ? 'rotate-180' : ''}`} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="relative flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            const isHovered = hoveredItem === index;

            return (
              <Link
                key={index}
                to={item.path}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group relative flex items-center gap-3.5 px-3 py-3 rounded-2xl
                  transition-all duration-300 cursor-pointer
                `}
              >
                {/* Active shadow background */}
                {isActive && (
                  <motion.div
                    layoutId="activeBackground"
                    className="absolute inset-0 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon container */}
                <div className={`
                  relative shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center
                  transition-all duration-300
                  ${isActive ? 'bg-linear-to-br ' + item.color + ' text-white shadow-lg shadow-current/20' : 'bg-slate-50 text-slate-400'}
                  ${isHovered && !isActive ? 'bg-slate-100 text-slate-600 scale-105' : ''}
                `}>
                  <Icon
                    size={20}
                    className="transition-transform duration-300 group-active:scale-90"
                  />
                </div>

                {/* Label */}
                <span
                  className={`
                    font-black text-[14px] tracking-tight whitespace-nowrap transition-all duration-300
                    ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}
                    ${isOpen ? 'opacity-100 w-auto translate-x-0' : 'opacity-0 w-0 -translate-x-4 overflow-hidden'}
                  `}
                >
                  {item.label}
                </span>

                {/* Tooltip (collapsed mode) */}
                {!isOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap pointer-events-none">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout footer */}
        <div className="relative p-6 border-t border-slate-50 shrink-0">
          <button
            onClick={handleLogout}
            className={`
              group w-full flex items-center gap-4 transition-all duration-300
              ${isOpen ? 'px-4 py-3 bg-rose-50 hover:bg-rose-100 rounded-2xl' : 'justify-center'}
            `}
          >
            <div className={`
              flex items-center justify-center rounded-xl transition-all duration-300
              ${isOpen ? 'w-auto' : 'w-11 h-11 bg-rose-50 hover:bg-rose-100'}
            `}>
              <LogOut size={20} className="text-rose-600 group-hover:scale-110 transition-transform" />
            </div>

            {isOpen && (
              <span className="font-black text-sm text-rose-600 tracking-tight">Sign Out</span>
            )}

            {!isOpen && (
              <div className="absolute left-full ml-4 px-4 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap pointer-events-none">
                Sign Out
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-rose-600 rotate-45" />
              </div>
            )}
          </button>
        </div>
      </aside>


    </>
  );
}
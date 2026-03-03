import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../states/Order/Action';
import { getAllProducts } from '../../states/Products/Action';
import { getAllUsers } from '../../states/Auth/Action';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading } = useSelector((state) => state.order || state.orders || {});
  const { products, loading: productsLoading } = useSelector((state) => state.products || {});
  const { users, loading: authLoading } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAllProducts({}));
    dispatch(getAllUsers());
  }, [dispatch]);

  const totalRevenue = orders?.reduce((acc, curr) =>
    acc + (curr.orderStatus === 'DELIVERED' ? curr.totalPrice : 0), 0) || 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
      trend: '+12.5%',
      isPositive: true
    },
    {
      title: 'Total Orders',
      value: orders?.length || 0,
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50',
      trend: '+8.2%',
      isPositive: true
    },
    {
      title: 'Total Customers',
      value: users?.length || 0,
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
      trend: '+15.4%',
      isPositive: true
    },
    {
      title: 'Active Products',
      value: products?.length || 0,
      icon: Package,
      color: 'text-amber-600 bg-amber-50',
      trend: '+4.1%',
      isPositive: true
    }
  ];

  if (ordersLoading || productsLoading || authLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2 font-medium">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 group hover:border-emerald-100 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                <stat.icon size={24} />
              </div>
              <button className="text-slate-300 hover:text-slate-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                  {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1">
        {/* Recent Orders Table */}
        <div className=" bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Transactions</h2>
              <p className="text-slate-400 text-sm font-bold mt-1">Monitor your latest sales and status.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-6 pl-2">Order ID</th>
                  <th className="pb-6">Customer</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6">Amount</th>
                  <th className="pb-6 text-right pr-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {orders?.slice(0, 5).map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-6 pl-2">
                        <span className="font-black text-slate-900">#{order._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black shadow-inner border border-emerald-100 uppercase">
                            {order.shippingAddress?.name?.[0]}
                            {order.shippingAddress?.surname?.[0]}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{order.shippingAddress?.name} {order.shippingAddress?.surname}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{order.shippingAddress?.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border ${order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          order.orderStatus === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                          {order.orderStatus}
                        </div>
                      </td>
                      <td className="py-6 font-black text-slate-900">₹{(order.totalPayablePrice || 0).toLocaleString()}</td>
                      <td className="py-6 text-right pr-2 text-slate-400 font-bold text-sm">
                        {new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Recent Products Grid */}
      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Arrivals</h2>
            <p className="text-slate-400 text-sm font-bold mt-1">Latest products added to your store.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all uppercase tracking-widest">
            Manage Inventory
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.slice(0, 4).map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-slate-50/50 rounded-3xl p-5 border border-transparent hover:border-emerald-100 hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-xl hover:shadow-emerald-100/20"
            >
              <div className="aspect-square rounded-2xl bg-white overflow-hidden mb-5 border border-slate-50 group-hover:border-emerald-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-4"
                />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{product.brand}</p>
              <h4 className="font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{product.title}</h4>
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-900 tracking-tight">₹{(product.price || 0).toLocaleString()}</p>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.quantity} In Stock</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
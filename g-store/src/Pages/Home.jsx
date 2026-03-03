
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  Apple,
  LeafyGreen,
  Milk,
  Croissant,
  Coffee,
  Cookie,
  Beef,
  Fish,
  Snowflake,
  Home as HomeIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_PRODUCTS, CATEGORIES } from '../Data/mockData';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import Products from './Products';

const iconMap = {
  Apple, LeafyGreen, Milk, Croissant, Coffee, Cookie, Beef, Fish, Snowflake, Home: HomeIcon
};

const Home = () => {
  const trendingProducts = ALL_PRODUCTS.slice(0, 8);
  const bestSellers = ALL_PRODUCTS.slice(15, 23);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
 
     <Hero/>
      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Popular Categories</h2>
            <p className="text-slate-500 mt-2">Explore our wide range of fresh items</p>
          </div>
          <Link to="/products" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
            View All <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const IconComp = iconMap[cat.icon] || Apple;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={`/products?category=${cat.id}`}
                  className="group flex flex-col items-center text-center space-y-3"
                >
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                    <IconComp size={32} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-slate-100/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Trending Now</h2>
              <p className="text-slate-500 mt-2">Most loved products by our community</p>
            </div>
            <Link to="/products" className="text-emerald-600 font-bold hover:underline">
              Browse More
            </Link>
          </div>

        <Products/>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-br from-indigo-600 to-blue-500 rounded-[2.5rem] p-10 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Weekend Special</span>
              <h3 className="text-4xl font-black mt-4">Up to 40% OFF <br />on Dairy & Bakery</h3>
              <p className="mt-4 text-blue-100">Stock up your favorites this weekend!</p>
              <button className="mt-8 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                Shop Deals
              </button>
            </div>
            <Milk className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64 rotate-12" />
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-br from-emerald-500 to-teal-400 rounded-[2.5rem] p-10 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Organic Only</span>
              <h3 className="text-4xl font-black mt-4">Fresh Veggies <br />Direct from Farm</h3>
              <p className="mt-4 text-emerald-50 text-opacity-80">100% Pesticide-free guaranteed</p>
              <button className="mt-8 px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                Explore Farm
              </button>
            </div>
            <LeafyGreen className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64 rotate-12" />
          </motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Best Sellers</h2>
            <p className="text-slate-500 mt-2">The essentials everyone is buying</p>
          </div>
          <Link to="/products" className="text-emerald-600 font-bold hover:underline">
            View Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;

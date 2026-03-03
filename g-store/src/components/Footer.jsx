
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBasket, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <ShoppingBasket className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Quick<span className="text-emerald-500">art</span>
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            Fresh groceries delivered to your doorstep within 30 minutes. We source directly from farms to ensure the best quality and prices.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
              <a 
                key={idx} 
                href="#" 
                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {['About Us', 'Contact', 'Track Order', 'FAQ', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-emerald-500 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Customer Support</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-emerald-500" />
              <span>1-800-QUICKART</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-emerald-500" />
              <span>support@quickart.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-emerald-500" />
              <span>123 Fresh Way, Food City, FC 45678</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Stay Fresh</h4>
          <p className="text-slate-400 mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Your email address"
              className="w-full bg-slate-800 border-none rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Mail size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© 2024 Quickart. All rights reserved.</p>
        <div className="flex items-center gap-1">
          Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> for Healthy Living
        </div>
      </div>
    </footer>
  );
};

export default Footer;

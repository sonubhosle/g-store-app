import { motion } from 'framer-motion'
import { ArrowRight, Truck } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
        <section className="relative h-150 overflow-hidden">
           <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1920&q=80"
               className="w-full h-full object-cover"
               alt="Hero Background"
             />
             <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
           </div>
   
           <div className="relative  px-12 py-15 flex flex-col justify-center">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="max-w-2xl space-y-6"
             >
               <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 font-bold text-sm tracking-wider uppercase">
                 <Truck size={16} /> Fast Delivery in 30 Minutes
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                 Fresh Groceries <br />
                 <span className="text-emerald-400">Directly</span> to You
               </h1>
               <p className="text-xl text-slate-200 leading-relaxed max-w-lg">
                 Experience the best quality organic products sourced from local farms. No lines, no wait, just fresh food.
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                 <Link to="/products" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-2">
                   Shop Now <ArrowRight size={20} />
                 </Link>
                 <Link to="/products?filter=offers" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                   View Offers
                 </Link>
               </div>
             </motion.div>
           </div>
         </section>
  )
}

export default Hero
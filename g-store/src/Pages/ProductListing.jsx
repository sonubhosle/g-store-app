import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../states/Products/Action';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Loader2, Filter, SlidersHorizontal } from 'lucide-react';

const ProductListing = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    dispatch(getAllProducts(params));
  }, [dispatch, category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 capitalize">
              {category ? category : 'All Products'}
            </h1>
            <p className="text-slate-500 mt-1">Found {products?.length || 0} items for you</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
              <Filter size={18} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-emerald-500 transition-colors shadow-sm">
              <SlidersHorizontal size={18} /> Sort
            </button>
          </div>
        </div>

        {/* Grid */}
        {products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 font-bold text-3xl">?</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
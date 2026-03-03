import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../states/Products/Action';
import ProductCard from '../components/ProductCard';
import {
    Search,
    Filter,
    SlidersHorizontal,
    ShoppingBag,
    Loader2,
    ChevronRight,
    Frown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        dispatch(getAllProducts({}));
    }, [dispatch]);

    useEffect(() => {
        if (products) {
            let filtered = products;

            if (query) {
                filtered = filtered.filter(p =>
                    p.title?.toLowerCase().includes(query.toLowerCase()) ||
                    p.description?.toLowerCase().includes(query.toLowerCase()) ||
                    p.brand?.toLowerCase().includes(query.toLowerCase())
                );
            }

            if (category) {
                filtered = filtered.filter(p => p.category === category);
            }

            setFilteredProducts(filtered);
        }
    }, [products, query, category]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                            <Link to="/" className="hover:text-emerald-600">Home</Link>
                            <ChevronRight size={12} />
                            <span className="text-slate-900">Search Results</span>
                        </nav>
                        <h1 className="text-4xl font-black text-slate-900">
                            Results for <span className="text-emerald-600">"{query || category}"</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Found {filteredProducts.length} premium products</p>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-slate-100"
                    >
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <Frown size={48} className="text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">No results found</h2>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                            We couldn't find anything matching your search. Try checking for typos or use different keywords.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                        >
                            Browse All Products <ShoppingBag size={20} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;

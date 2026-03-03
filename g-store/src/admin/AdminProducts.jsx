import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, deleteProduct, createProduct, updateProduct } from '../states/Products/Action';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Filter,
    Loader2,
    Package,
    Circle,
    X,
    Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products || {});
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        category: '',
        price: '',
        discountedPrice: '',
        description: '',
        tag: '',
        images: [],
        stock: 50
    });

    useEffect(() => {
        dispatch(getAllProducts({}));
    }, [dispatch]);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditMode(true);
            setCurrentProduct(product);
            setFormData({
                title: product.title,
                brand: product.brand,
                category: product.category,
                price: product.price,
                discountedPrice: product.discountedPrice,
                description: product.description,
                tag: product.tag || '',
                images: [],
                stock: product.stock || 50
            });
        } else {
            setEditMode(false);
            setCurrentProduct(null);
            setFormData({
                title: '',
                brand: '',
                category: '',
                price: '',
                discountedPrice: '',
                description: '',
                tag: '',
                images: [],
                stock: 50
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                dispatch(updateProduct(currentProduct._id, formData));
                toast.success("Product updated successfully");
            } else {
                dispatch(createProduct(formData));
                toast.success("Product created successfully");
            }
            handleCloseModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
            toast.success('Product deleted successfully');
        }
    };

    const filteredProducts = products?.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && !products) {
        return (
            <div className="h-[600px] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Manage Inventory</h1>
                    <p className="text-slate-500 mt-2 font-medium">Add, update or remove products from your store.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                >
                    <Plus size={20} /> Add New Product
                </button>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name or brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100">
                        <Filter size={18} /> Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-4 pl-4">Product Info</th>
                                <th className="pb-4">Category</th>
                                <th className="pb-4">Stock Status</th>
                                <th className="pb-4">Price</th>
                                <th className="pb-4 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {filteredProducts?.map((product) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-5 pl-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                                    <img src={product.image} alt="" className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 line-clamp-1">{product.title}</p>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{product.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{product.category}</span>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-2 font-bold text-sm">
                                                <Circle size={8} className={product.stock > 0 ? 'fill-emerald-500 text-emerald-500' : 'fill-rose-500 text-rose-500'} />
                                                <span className={product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900">₹{(product.discountedPrice || 0).toLocaleString()}</span>
                                                {(product.price > product.discountedPrice) && (
                                                    <span className="text-[10px] text-slate-400 line-through font-bold">₹{(product.price || 0).toLocaleString()}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 text-right pr-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                                                    <ExternalLink size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {(!filteredProducts || filteredProducts.length === 0) && (
                        <div className="py-20 text-center">
                            <Package size={48} className="mx-auto text-slate-100 mb-4" />
                            <p className="text-slate-400 font-bold">No products found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
                    >
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-2xl font-black text-slate-900">{editMode ? "Refine Product" : "New Collection"}</h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brand</label>
                                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Stock Quantity</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Regular Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sale Price (₹)</label>
                                    <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold resize-none h-32" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Media</label>
                                    <div className="border-2 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-emerald-500/40 transition-all group cursor-pointer relative bg-slate-50/50">
                                        <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="text-emerald-500" />
                                        </div>
                                        <p className="text-sm text-slate-500 font-bold">{formData.images.length > 0 ? `${formData.images.length} file(s) selected` : "Drag and drop product images here"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 flex gap-4">
                                <button type="button" onClick={handleCloseModal} className="flex-1 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all">Discard</button>
                                <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
                                    {editMode ? "Update Product" : "Launch Product"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;

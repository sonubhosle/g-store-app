import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser } from '../states/Auth/Action';
import {
    Users,
    Search,
    Shield,
    Trash2,
    UserPlus,
    Filter,
    Loader2,
    Mail,
    ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.auth || {});

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteUser(id));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to delete user');
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(u =>
        u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u?.surname?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    if (loading && (!users || users.length === 0)) {
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
                    <h1 className="text-3xl font-black text-slate-900">User Management</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage permissions and monitor user activity.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
                    <UserPlus size={20} /> Invite New Admin
                </button>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Find users by name, email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100">
                        <Filter size={18} /> Role: All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold">No users found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4 pl-4">Customer Profile</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Role</th>
                                    <th className="pb-4 text-center">Joined Date</th>
                                    <th className="pb-4 text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence>
                                    {filteredUsers?.map((user) => (
                                        <motion.tr
                                            key={user?._id || Math.random()}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="py-6 pl-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shadow-inner border border-emerald-100 overflow-hidden">
                                                        {user?.photo ? (
                                                            <img src={user.photo} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{user?.name?.[0]?.toUpperCase()}{user?.surname?.[0]?.toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{user?.name || ''} {user?.surname || ''}</p>
                                                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                                                            <Mail size={10} /> {user?.email || ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                    Verified
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black border ${user?.role === 'ADMIN'
                                                    ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {user?.role === 'ADMIN' ? <Shield size={10} /> : <Users size={10} />}
                                                    {user?.role || 'USER'}
                                                </div>
                                            </td>
                                            <td className="py-6 text-center text-slate-500 font-bold text-sm">
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-6 text-right pr-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                                        <ShieldCheck size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user?._id)}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
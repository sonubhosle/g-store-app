import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { updateReview, deleteReview } from '../../states/Review/Action';
import StarRating from './StarRating';
import { toast } from 'react-toastify';

const ReviewCard = ({ review }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { submitting } = useSelector((state) => state.reviews);

    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(review.description);
    const [editRating, setEditRating] = useState(review.rating || 0);

    const isOwner = user && review.user?._id === user._id;

    const handleSave = async () => {
        if (!editText.trim()) return toast.error('Review text cannot be empty');
        try {
            await dispatch(updateReview(review._id, editText, editRating || undefined));
            toast.success('Review updated!');
            setEditing(false);
        } catch {
            toast.error('Failed to update review');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await dispatch(deleteReview(review._id));
            toast.success('Review deleted');
        } catch {
            toast.error('Failed to delete review');
        }
    };

    const initials = `${review.user?.name?.[0] || '?'}${review.user?.surname?.[0] || ''}`.toUpperCase();

    return (
        <div className="flex gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group">
            {/* Avatar */}
            <div className="flex-shrink-0">
                {review.user?.photo ? (
                    <img
                        src={review.user.photo}
                        alt={review.user.name}
                        className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {initials}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                        <p className="font-bold text-slate-900 text-sm">
                            {review.user?.name} {review.user?.surname}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </p>
                    </div>
                    {/* Edit / Delete buttons — only for owner */}
                    {isOwner && !editing && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditing(true)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                title="Edit"
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={submitting}
                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="Delete"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Star rating (read-only display or edit mode) */}
                {editing ? (
                    <div className="mb-3">
                        <StarRating value={editRating} onChange={setEditRating} size={18} />
                    </div>
                ) : (
                    review.rating && (
                        <div className="mb-2">
                            <StarRating value={review.rating} readOnly size={16} />
                        </div>
                    )
                )}

                {/* Text */}
                {editing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={submitting}
                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all"
                            >
                                <Check size={14} /> Save
                            </button>
                            <button
                                onClick={() => { setEditing(false); setEditText(review.description); setEditRating(review.rating || 0); }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
                            >
                                <X size={14} /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-700 leading-relaxed">{review.description}</p>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;

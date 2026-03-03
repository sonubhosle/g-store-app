import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Loader2 } from 'lucide-react';
import { createReview } from '../../states/Review/Action';
import StarRating from './StarRating';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, alreadyReviewed }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector((state) => state.reviews);
    const { user } = useSelector((state) => state.auth);

    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');

    if (!user) {
        return (
            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100">
                <p className="text-slate-500 font-medium text-sm">
                    Please <a href="/login" className="text-emerald-600 font-bold hover:underline">sign in</a> to write a review.
                </p>
            </div>
        );
    }

    if (alreadyReviewed) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 text-sm text-emerald-700 font-semibold text-center">
                ✓ You have already reviewed this product
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) return toast.error('Please select a star rating');
        if (!description.trim()) return toast.error('Please write a review');
        try {
            await dispatch(createReview(productId, rating, description));
            toast.success('Review posted!');
            setRating(0);
            setDescription('');
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to submit review');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Write a Review</h3>

            {/* Star Picker */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Rating</p>
                <StarRating value={rating} onChange={setRating} size={24} />
            </div>

            {/* Text area */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Review</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this product..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none transition-all placeholder:text-slate-400"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-100"
            >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;

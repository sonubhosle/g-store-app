import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../../states/Review/Action';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import { Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewsSection = ({ productId }) => {
    const dispatch = useDispatch();
    const { reviews, loading } = useSelector((state) => state.reviews);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (productId) dispatch(fetchReviews(productId));
    }, [dispatch, productId]);

    const alreadyReviewed = useMemo(
        () => user && reviews.some((r) => r.user?._id === user._id),
        [reviews, user]
    );

    // Rating summary stats
    const avgRating = useMemo(() => {
        const rated = reviews.filter((r) => r.rating);
        if (!rated.length) return 0;
        return (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(1);
    }, [reviews]);

    const starCounts = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => { if (r.rating) counts[r.rating] = (counts[r.rating] || 0) + 1; });
        return counts;
    }, [reviews]);

    const ratedCount = reviews.filter((r) => r.rating).length;

    return (
        <div className="space-y-8">
            {/* Summary header */}
            {reviews.length > 0 && (
                <div className="flex flex-col md:flex-row gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    {/* Avg score */}
                    <div className="flex flex-col items-center justify-center min-w-[120px]">
                        <p className="text-6xl font-black text-slate-900">{avgRating}</p>
                        <StarRating value={Math.round(avgRating)} readOnly size={18} />
                        <p className="text-xs text-slate-400 font-medium mt-1">
                            {ratedCount} rating{ratedCount !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Bar chart */}
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = starCounts[star] || 0;
                            const pct = ratedCount ? Math.round((count / ratedCount) * 100) : 0;
                            return (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="text-slate-500 font-medium w-10 text-right">{star} ★</span>
                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-slate-400 text-xs font-medium w-8">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Write review form */}
            <ReviewForm productId={productId} alreadyReviewed={alreadyReviewed} />

            {/* Review list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                    <MessageSquare size={48} className="opacity-20" />
                    <p className="font-bold">No reviews yet — be the first!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                        {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                    </p>
                    <AnimatePresence>
                        {reviews.map((review, i) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <ReviewCard review={review} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ReviewsSection;

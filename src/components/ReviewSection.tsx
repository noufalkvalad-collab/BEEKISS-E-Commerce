"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquare, Trash2, Edit2, Loader2, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ReviewSection({ productSlug, onStatsUpdate }: { productSlug: string, onStatsUpdate?: (stats: any) => void }) {
    const { data: session, status } = useSession();
    const [reviews, setReviews] = useState<any[]>([]);
    const [isEligible, setIsEligible] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [stats, setStats] = useState({ average: 0, count: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Form inputs
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${productSlug}/reviews`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
                setStats(data.stats);
                setIsEligible(data.userState.isEligible);
                setHasReviewed(data.userState.hasReviewed);
                if (onStatsUpdate) onStatsUpdate(data.stats);
            }
        } catch (error) {
            console.error("Failed fetching reviews", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productSlug, status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim().length < 2) {
            toast.error("Please write a slightly longer review.");
            return;
        }

        setIsSubmitting(true);
        try {
            const endpoint = editingReviewId
                ? `/api/products/${productSlug}/reviews/${editingReviewId}`
                : `/api/products/${productSlug}/reviews`;

            const method = editingReviewId ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(editingReviewId ? "Review updated!" : "Review submitted successfully!");
                setComment("");
                setRating(5);
                setEditingReviewId(null);
                fetchReviews(); // Re-fetch to normalize stats & logic
            } else {
                toast.error(data.error || "Failed to submit review.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: string) => {
        toast("Are you sure you want to delete this review?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        const res = await fetch(`/api/products/${productSlug}/reviews/${id}`, {
                            method: "DELETE"
                        });
                        const data = await res.json();
                        if (data.success) {
                            toast.success("Review permanently removed.");
                            if (session?.user?.email === reviews.find(r => r._id === id)?.userEmail) {
                                setHasReviewed(false); // Clear the block if they delete their own
                            }
                            fetchReviews();
                        } else {
                            toast.error(data.error || "Deletion failed.");
                        }
                    } catch (er) {
                        toast.error("Server error during deletion.");
                    }
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => { }
            }
        });
    };

    const handleEditPrompt = (rev: any) => {
        setEditingReviewId(rev._id);
        setRating(rev.rating);
        setComment(rev.comment);
        window.scrollBy({ top: 300, behavior: 'smooth' }); // nudge down conceptually
    };

    const cancelEdit = () => {
        setEditingReviewId(null);
        setRating(5);
        setComment("");
    };

    if (isLoading) {
        return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-honey-gold" /></div>;
    }

    return (
        <section id="reviews-section" className="py-16 border-t border-gray-100 mt-12 scroll-mt-32">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Left Col: Summary & Write Trigger */}
                    <div className="w-full md:w-1/3">
                        <h2 className="text-3xl font-serif font-bold text-forest-green mb-6">Customer Reviews</h2>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-6xl font-serif font-bold text-gray-900 leading-none">{stats.count > 0 ? stats.average.toFixed(1) : "0.0"}</span>
                            <div className="pb-1">
                                <div className="flex text-honey-gold mb-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={`w-5 h-5 ${star <= Math.round(stats.average || 0) && stats.count > 0 ? "fill-current" : "text-gray-200"}`} />
                                    ))}
                                </div>
                                <span className="text-gray-500 font-medium">{stats.count === 0 ? "No reviews yet" : `Based on ${stats.count} reviews`}</span>
                            </div>
                        </div>

                        {status === "unauthenticated" ? (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                                <MessageSquare className="w-8 h-8 text-honey-gold mx-auto mb-3" />
                                <h4 className="font-bold text-gray-900 mb-2">Have you tried this?</h4>
                                <p className="text-sm text-gray-500 mb-4">Log in to leave your thoughts on our artisan honey.</p>
                                <Link href={`/login?callbackUrl=/products/${productSlug}`} className="block w-full text-center border-2 border-forest-green text-forest-green py-2 rounded-lg font-medium hover:bg-forest-green hover:text-white transition-colors">
                                    Log In to Review
                                </Link>
                            </div>
                        ) : !isEligible ? (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                                <PlayCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <h4 className="font-bold text-gray-900 mb-2">Verified Purchases Only</h4>
                                <p className="text-sm text-gray-500">You can only review products that have been successfully delivered to you.</p>
                            </div>
                        ) : hasReviewed && !editingReviewId ? (
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                                <h4 className="font-bold text-green-800 mb-2">Thanks for reviewing!</h4>
                                <p className="text-sm text-green-600">Your feedback helps artisan beekeepers thrive.</p>
                            </div>
                        ) : (
                            /* Review Submission Form */
                            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-honey-gold/30 shadow-sm">
                                <h3 className="font-serif font-bold text-lg text-forest-green mb-4 border-b border-gray-100 pb-2">
                                    {editingReviewId ? "Edit Your Review" : "Write a Review"}
                                </h3>

                                <div className="mb-4 flex flex-col items-center">
                                    <span className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wider">Tap to Rate</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? "fill-honey-gold text-honey-gold hover:scale-110" : "text-gray-200 hover:text-honey-gold"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Detail your experience with the taste, texture, and delivery..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-honey-gold min-h-[120px] mb-4"
                                    required
                                    minLength={2}
                                />

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-forest-green text-white py-2.5 rounded-lg font-medium hover:bg-forest-green/90 transition flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingReviewId ? "Update Review" : "Post Review")}
                                    </button>
                                    {editingReviewId && (
                                        <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right Col: Feed */}
                    <div className="w-full md:w-2/3">
                        {reviews.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Be the first to review</h3>
                                <p className="text-gray-500">There are no customer ratings for this product yet. All metrics shown are placeholder baselines.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((rev) => (
                                    <div key={rev._id} className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-honey-gold/10 rounded-full flex items-center justify-center text-forest-green font-bold font-serif uppercase">
                                                    {rev.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 leading-tight flex items-center gap-2">
                                                        {rev.userName}
                                                        {(rev.userEmail === session?.user?.email) && <span className="bg-honey-gold text-white text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                                                    </h4>
                                                    <div className="flex text-honey-gold mt-1">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <Star key={star} className={`w-3.5 h-3.5 ${star <= rev.rating ? "fill-current" : "text-gray-200"}`} />
                                                        ))}
                                                        <span className="text-xs text-gray-400 ml-2">
                                                            {new Date(rev.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contextual Actions (Author or Admin) */}
                                            {status === "authenticated" && (
                                                <div className="flex items-center gap-2">
                                                    {(rev.userEmail === session?.user?.email) && (
                                                        <button onClick={() => handleEditPrompt(rev)} className="text-gray-400 hover:text-honey-gold p-1" title="Edit Review">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(rev.userEmail === session?.user?.email || (session?.user as any)?.role === "admin") && (
                                                        <button onClick={() => handleDelete(rev._id)} className="text-gray-400 hover:text-red-500 p-1" title="Delete Review">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-700 font-light leading-relaxed pl-14">
                                            {rev.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}

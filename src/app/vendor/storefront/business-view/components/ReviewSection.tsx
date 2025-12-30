"use client";

import React, { useState, ChangeEvent, useMemo } from "react";
import Icon, { type LucideIconName } from "@/components/AppIcon";
import Image from "@/components/ui/alt/AppImageAlt";
import Button from "@/components/ui/alt/ButtonAlt";

// --- TYPES ---
interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  helpfulCount: number;
  businessReply?: {
    date: string;
    message: string;
  };
}

interface BusinessRating {
  average: number;
  total?: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
  businessRating: BusinessRating;
  onWriteReview: () => void;
}

type SortByType = "newest" | "oldest" | "highest" | "lowest";
type FilterRatingType = "all" | "5" | "4" | "3" | "2" | "1";

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews: initialReviews,
  businessRating,
  onWriteReview,
}) => {
  const [sortBy, setSortBy] = useState<SortByType>("newest");
  const [filterRating, setFilterRating] = useState<FilterRatingType>("all");

  // --- LOCALSTORAGE DATA SYNC ---
  // We use the passed-in props as the source, which in your StorefrontView 
  // is already being synced with LocalStorage.
  const displayReviews = useMemo(() => {
    let filtered = [...initialReviews];
    
    if (filterRating !== "all") {
      filtered = filtered.filter(r => r.rating === parseInt(filterRating));
    }

    return filtered.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });
  }, [initialReviews, filterRating, sortBy]);

  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    initialReviews.forEach((r) => dist[r.rating]++);
    return dist;
  }, [initialReviews]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- RATING OVERVIEW CARD --- */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Average Score */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] min-w-[160px]">
            <span className="text-5xl font-black text-slate-900">
              {businessRating.average || "0.0"}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={16}
                  className={i < Math.floor(businessRating.average) ? "text-orange-500 fill-orange-500" : "text-slate-200"}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {initialReviews.length} Reviews
            </p>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 w-full space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = initialReviews.length > 0 ? (count / initialReviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-600 w-4">{rating}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center">
          <Button
            variant="primary"
            onClick={onWriteReview}
            className="rounded-2xl px-8"
          >
            <Icon name="Edit3" size={18} className="mr-2" />
            Share Your Experience
          </Button>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">
          Customer Feedback
        </h3>
        
        <div className="flex items-center gap-3">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value as FilterRatingType)}
            className="text-xs font-bold bg-white border-none rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">All Ratings</option>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortByType)}
            className="text-xs font-bold bg-white border-none rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>
      </div>

      {/* --- REVIEWS LIST --- */}
      <div className="space-y-4">
        {displayReviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Icon name="MessageSquare" size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No reviews yet</h3>
            <p className="text-sm text-slate-400">Be the first to rate this business!</p>
          </div>
        ) : (
          displayReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                    <Image
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">
                      {review.user.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={10}
                            className={i < review.rating ? "text-orange-500 fill-orange-500" : "text-slate-200"}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <Icon name="MoreHorizontal" size={18} className="text-slate-400" />
                </button>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-4 px-1">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {review.images.map((img, i) => (
                    <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <Image src={img} alt="Review" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Footer / Reply */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">
                  <Icon name="ThumbsUp" size={14} />
                  Helpful ({review.helpfulCount})
                </button>
                
                {review.businessReply && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    <Icon name="CheckCircle2" size={12} />
                    Owner Replied
                  </div>
                )}
              </div>

              {review.businessReply && (
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Store Response</span>
                    <span className="text-[10px] font-bold text-slate-400">• {formatDate(review.businessReply.date)}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 italic">
                    "{review.businessReply.message}"
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
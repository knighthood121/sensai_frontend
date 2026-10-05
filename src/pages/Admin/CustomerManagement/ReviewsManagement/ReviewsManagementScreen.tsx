import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  X,
  Trash2,
  Eye,
  ThumbsUp,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Button from '../../../../components/common/Button';

interface ReviewsManagementScreenProps {
  reviews: any[];
  pagination: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
  page: number;
  setPage: (p: number) => void;
  ratingFilter: number | '';
  setRatingFilter: (r: number | '') => void;
  verifiedFilter: boolean | '';
  setVerifiedFilter: (v: boolean | '') => void;
  isApprovedFilter: boolean | '';
  setIsApprovedFilter: (a: boolean | '') => void;
  selectedReview: any;
  setSelectedReview: (r: any) => void;
  handleDeleteReview: (id: number) => Promise<void>;
  isDeleting: boolean;
}

export default function ReviewsManagementScreen({
  reviews,
  pagination,
  isLoading,
  isError,
  error,
  page,
  setPage,
  ratingFilter,
  setRatingFilter,
  verifiedFilter,
  setVerifiedFilter,
  isApprovedFilter,
  setIsApprovedFilter,
  selectedReview,
  setSelectedReview,
  handleDeleteReview,
  isDeleting,
}: ReviewsManagementScreenProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Header and Back Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/customers')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Reviews & Feedback</h1>
            <p className="text-sm text-gray-500">Monitor and moderate product reviews, ratings, and customer comments.</p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border rounded-2xl p-5 mb-6 shadow-sm flex flex-wrap gap-4 items-center justify-between" style={{ borderColor: COLORS.border }}>
        <div className="flex flex-wrap items-center gap-4">
          {/* Rating filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="rating" className="text-xs font-bold text-gray-450 uppercase tracking-wider">Rating:</label>
            <select
              id="rating"
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value === '' ? '' : Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-1.5 border border-gray-200 bg-white rounded-xl text-xs font-bold outline-none cursor-pointer"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Verified purchase filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="verified" className="text-xs font-bold text-gray-450 uppercase tracking-wider">Purchase:</label>
            <select
              id="verified"
              value={verifiedFilter === '' ? '' : String(verifiedFilter)}
              onChange={(e) => {
                setVerifiedFilter(e.target.value === '' ? '' : e.target.value === 'true');
                setPage(1);
              }}
              className="px-3 py-1.5 border border-gray-200 bg-white rounded-xl text-xs font-bold outline-none cursor-pointer"
            >
              <option value="">All Purchases</option>
              <option value="true">Verified Purchases Only</option>
              <option value="false">Standard Reviews Only</option>
            </select>
          </div>

          {/* Approval status filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="approved" className="text-xs font-bold text-gray-450 uppercase tracking-wider">Approval:</label>
            <select
              id="approved"
              value={isApprovedFilter === '' ? '' : String(isApprovedFilter)}
              onChange={(e) => {
                setIsApprovedFilter(e.target.value === '' ? '' : e.target.value === 'true');
                setPage(1);
              }}
              className="px-3 py-1.5 border border-gray-200 bg-white rounded-xl text-xs font-bold outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="true">Approved / Live</option>
              <option value="false">Pending / Hidden</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          Total: {pagination?.total || 0} reviews
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border shadow-sm p-20 flex flex-col items-center justify-center" style={{ borderColor: COLORS.border }}>
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading reviews list...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-1">Failed to Load Reviews</h3>
          <p className="text-red-700 text-sm mb-6">{error?.data?.message || 'An unexpected error occurred while contacting review services.'}</p>
          <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Review comment</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-center">Purchase Type</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {reviews.length > 0 ? (
                  reviews.map((rev: any) => (
                    <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-gray-900 truncate max-w-[150px]" title={rev.product?.name}>
                          {rev.product?.name || 'Deleted Product'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold">{formatDate(rev.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex text-amber-400 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < rev.rating ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth={2}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-gray-600 truncate leading-relaxed" title={rev.comment || undefined}>
                          {rev.comment || <em className="text-gray-400">No review text comment.</em>}
                        </p>
                        {rev.images && rev.images.length > 0 && (
                          <span className="text-[9px] font-bold text-pink-500 bg-pink-50 border border-pink-100/50 px-2 py-0.5 rounded mt-1 inline-block">
                            +{rev.images.length} Photos
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {rev.user?.name || 'Anonymous User'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {rev.verified ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/40">
                            <ShieldCheck size={10} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-gray-500 font-bold bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200/50">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {rev.isApproved ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/40">
                            <CheckCircle2 size={10} /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100/40">
                            <XCircle size={10} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedReview(rev)}
                          className="p-1.5 text-gray-400 hover:text-pink-500 hover:bg-gray-50 border border-transparent rounded-lg transition-colors cursor-pointer inline-block"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-gray-50 border border-transparent rounded-lg transition-colors cursor-pointer inline-block"
                          title="Delete / Reject"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="font-bold text-sm text-gray-800">No reviews found matching filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination panel */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-150">
              <span className="text-xs text-gray-500 font-semibold">
                Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(page + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Review Detail Modal Overlay --- */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedReview(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl z-10 border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight" style={{ fontFamily: FONTS.heading }}>
                  Review Details
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  ID: #{selectedReview.id} &bull; {formatDate(selectedReview.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1.5 hover:bg-gray-50 rounded-full border border-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Product Reference */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center gap-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">PRODUCT</span>
                  <p className="font-bold text-sm text-gray-900 leading-snug">{selectedReview.product?.name || 'Deleted Product'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">RATING</span>
                  <div className="flex text-amber-400 gap-0.5 mt-0.5 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < selectedReview.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">CUSTOMER NAME</span>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedReview.user?.name || 'Anonymous User'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">VERIFIED BUYER</span>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {selectedReview.verified ? (
                      <span className="text-emerald-600 inline-flex items-center gap-0.5">
                        <CheckCircle2 size={12} /> Yes (Delivered Order)
                      </span>
                    ) : (
                      <span className="text-gray-500">No (Standard Review)</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">REVIEW COMMENT</span>
                <blockquote className="bg-[#FCFBFA] border-l-2 border-pink-500 rounded-r-xl p-4 text-xs font-medium text-gray-700 italic leading-relaxed">
                  "{selectedReview.comment || 'No text comment left.'}"
                </blockquote>
              </div>

              {/* Uploaded Images */}
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">ATTACHED PHOTOS ({selectedReview.images.length})</span>
                  <div className="flex gap-2.5 flex-wrap">
                    {selectedReview.images.map((img: string, idx: number) => (
                      <div key={idx} className="w-20 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                        <img src={img} alt="Customer upload" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful Counters */}
              <div className="flex items-center justify-between border-t pt-4 border-gray-100">
                <span className="text-xs font-bold text-gray-400 inline-flex items-center gap-1">
                  <ThumbsUp size={12} /> Helpful Clicks: {selectedReview.helpful}
                </span>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Reject / Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

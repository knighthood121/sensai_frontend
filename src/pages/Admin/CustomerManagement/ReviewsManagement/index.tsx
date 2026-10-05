import { useState } from 'react';
import ReviewsManagementScreen from './ReviewsManagementScreen';
import {
  useGetAdminReviewsQuery,
  useAdminDeleteReviewMutation,
} from '../../../../service/adminReviewApi';
import { useToast } from '../../../../components/common/Toast';
import type { ReviewData } from '../../../../types/Review.type';

export default function ReviewsManagement() {
  const { showToast } = useToast();

  // Pagination state
  const [page, setPage] = useState(1);

  // Filter states
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | ''>('');
  const [isApprovedFilter, setIsApprovedFilter] = useState<boolean | ''>('');

  // Selected review for details modal
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  // Queries
  const {
    data: reviewsResponse,
    isLoading,
    isError,
    error,
  } = useGetAdminReviewsQuery({
    page,
    limit: 10,
    rating: ratingFilter !== '' ? ratingFilter : undefined,
    verified: verifiedFilter !== '' ? verifiedFilter : undefined,
    isApproved: isApprovedFilter !== '' ? isApprovedFilter : undefined,
  });

  const reviews = reviewsResponse?.data || [];
  const pagination = reviewsResponse?.pagination;

  // Mutations
  const [deleteReview, { isLoading: isDeleting }] = useAdminDeleteReviewMutation();

  // Delete review handler
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to permanently delete/reject this review? This action cannot be undone.')) return;
    try {
      await deleteReview(reviewId).unwrap();
      showToast('Review permanently deleted successfully!');
      if (selectedReview?.id === reviewId) {
        setSelectedReview(null);
      }
    } catch (err) {
      showToast('Failed to delete review.', 'error');
    }
  };

  return (
    <ReviewsManagementScreen
      reviews={reviews}
      pagination={pagination}
      isLoading={isLoading}
      isError={isError}
      error={error}
      page={page}
      setPage={setPage}
      ratingFilter={ratingFilter}
      setRatingFilter={setRatingFilter}
      verifiedFilter={verifiedFilter}
      setVerifiedFilter={setVerifiedFilter}
      isApprovedFilter={isApprovedFilter}
      setIsApprovedFilter={setIsApprovedFilter}
      selectedReview={selectedReview}
      setSelectedReview={setSelectedReview}
      handleDeleteReview={handleDeleteReview}
      isDeleting={isDeleting}
    />
  );
}
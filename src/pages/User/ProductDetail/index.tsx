import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { useGetProductDetailsQuery } from '../../../service/productsApi';
import { useGetWishlistQuery, useToggleWishlistMutation } from '../../../service/wishlistApi';
import { useAddToCartMutation } from '../../../service/cartApi';
import {
  useGetProductReviewsQuery,
  useGetMyReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
} from '../../../service/reviewApi';
import { useToast } from '../../../components/common/Toast';
import ProductDetailScreen from './ProductDetailScreen';
import { addGuestCartItem, getGuestCart } from '../../../utils/guestCart';
import { selectedProductVariant } from '../../../utils/productSelection';
import { getCartUnitPrice, getCatalogImage, getVariantStock } from '../../../utils/catalogProduct';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  return <ProductDetailContent key={id} />;
}

function ProductDetailContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Pagination for reviews
  const [reviewsPage, setReviewsPage] = useState(1);

  // Fetch product catalog details
  const {
    data: detailResponse,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductDetailsQuery(Number(id), { skip: !id });

  const detailData = detailResponse?.data;
  const product = detailData?.product;

  // Fetch product reviews (public)
  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
  } = useGetProductReviewsQuery(
    {
      productId: Number(id),
      filters: { page: reviewsPage, limit: 5 },
    },
    { skip: !id }
  );

  // Fetch customer's own review if logged in
  const {
    data: myReviewResponse,
    refetch: refetchMyReview,
  } = useGetMyReviewQuery(Number(id), {
    skip: !id || !isAuthenticated,
  });

  // Fetch wishlist
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const wishlistItems = wishlistData?.data || [];

  // Mutations
  const [toggleWishlist] = useToggleWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [markHelpful] = useMarkReviewHelpfulMutation();

  // Selected image, size, color states
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review modal state
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImageInput, setReviewImageInput] = useState(''); // comma-separated image URLs

  const variants = useMemo(() => detailData?.variants || product?.variants || [], [detailData, product]);
  const availableSizes = useMemo(() => Array.from(new Set(variants.map((variant) => variant.size))), [variants]);
  const availableColors = useMemo(() => Array.from(new Set(variants.filter((variant) => variant.size === selectedSize).map((variant) => variant.color))), [variants, selectedSize]);

  useEffect(() => {
    if (variants.length > 0 && !selectedSize && !selectedColor) {
      setSelectedSize(variants[0].size);
      setSelectedColor(variants[0].color);
    }
  }, [variants, selectedSize, selectedColor]);

  const selectSize = (size: string) => {
    const option = variants.find((variant) => variant.size === size && variant.color === selectedColor)
      || variants.find((variant) => variant.size === size);
    setSelectedSize(size);
    setSelectedColor(option?.color || '');
    setQuantity(1);
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  // Wishlist handler
  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to manage your wishlist.' } });
      return;
    }
    try {
      const res = await toggleWishlist(product.id).unwrap();
      if (res.data.action === 'added') {
        showToast('Added to wishlist!');
      } else {
        showToast('Removed from wishlist!');
      }
    } catch (err) {
      showToast('Failed to update wishlist.', 'error');
    }
  };

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product) return;

    const variant = selectedProductVariant(variants, selectedSize, selectedColor);

    if (!variant?.id) {
      showToast('Product variants are unavailable.', 'error');
      return;
    }

    const availableStock = getVariantStock(variant);
    const existingQuantity = isAuthenticated ? 0 : getGuestCart().find((item) => item.productId === product.id && item.variantId === variant.id)?.quantity ?? 0;
    if (!Number.isSafeInteger(quantity) || quantity < 1 || availableStock === null || quantity + existingQuantity > availableStock) {
      showToast('The requested quantity is not available in stock.', 'error');
      return;
    }

    const sellingPrice = getCartUnitPrice(product, variant);
    if (sellingPrice === null) {
      showToast('Pricing is unavailable. Please request a quote.', 'error');
      return;
    }

    if (!isAuthenticated) {
      // Guest user: save to localStorage cart
      addGuestCartItem({
        productId: product.id,
        variantId: variant.id,
        quantity,
        productName: product.name,
        slug: product.slug,
        image: getCatalogImage({ images: detailData?.images || product.images }),
        price: Number(product.basePrice),
        discountPrice: product.discountPrice == null ? null : Number(product.discountPrice),
        sellingPrice,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        stock: availableStock,
        itemTotal: sellingPrice * quantity,
      });
      showToast('Added to cart! Sign in to save your cart.');
      return;
    }

    try {
      const response = await addToCart({ productId: product.id, variantId: variant.id, quantity }).unwrap();
      if (!response.success) throw new Error('Cart update failed');
      showToast('Added to cart!');
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Failed to add item to cart.';
      showToast(errMsg, 'error');
    }
  };

  // Buy now handler
  const handleBuyNow = () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to checkout.' } });
      return;
    }

    const variant = selectedProductVariant(variants, selectedSize, selectedColor);

    if (!variant?.id) {
      showToast('Product variants are unavailable.', 'error');
      return;
    }

    const availableStock = getVariantStock(variant);
    if (!Number.isSafeInteger(quantity) || quantity < 1 || availableStock === null || quantity > availableStock) {
      showToast('The requested quantity is not available in stock.', 'error');
      return;
    }

    const sellingPrice = getCartUnitPrice(product, variant);
    if (sellingPrice === null) {
      showToast('Pricing is unavailable. Please request a quote.', 'error');
      return;
    }

    const checkoutItem = {
      id: product.id,
      productId: product.id,
      variantId: variant.id,
      quantity,
      productName: product.name,
      slug: product.slug,
      image: getCatalogImage({ images: detailData?.images || product.images }),
      sellingPrice,
      price: Number(product.basePrice),
      discountPrice: product.discountPrice == null ? null : Number(product.discountPrice),
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      stock: availableStock,
      itemTotal: sellingPrice * quantity,
    };

    sessionStorage.setItem('tempCheckoutItem', JSON.stringify(checkoutItem));
    showToast('Order initiated! Redirecting to checkout...');
    navigate('/checkout');
  };

  // Open write review modal
  const handleOpenWriteReview = () => {
    setReviewRating(5);
    setReviewComment('');
    setReviewImageInput('');
    setIsEditingReview(false);
    setIsReviewDialogOpen(true);
  };

  // Open edit review modal
  const handleOpenEditReview = () => {
    const myReview = myReviewResponse?.data;
    if (!myReview) return;
    setReviewRating(myReview.rating);
    setReviewComment(myReview.comment || '');
    setReviewImageInput(myReview.images ? myReview.images.join(', ') : '');
    setIsEditingReview(true);
    setIsReviewDialogOpen(true);
  };

  // Submit Review (Create or Update)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const imgArray = reviewImageInput
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    try {
      if (isEditingReview) {
        const myReview = myReviewResponse?.data;
        if (!myReview) return;
        await updateReview({
          id: myReview.id,
          data: {
            rating: reviewRating,
            comment: reviewComment,
            images: imgArray,
          },
        }).unwrap();
        showToast('Review updated successfully!');
      } else {
        await createReview({
          productId: Number(id),
          rating: reviewRating,
          comment: reviewComment,
          images: imgArray,
        }).unwrap();
        showToast('Review submitted successfully!');
      }
      setIsReviewDialogOpen(false);
      refetchMyReview();
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.data?.message || 'Failed to submit review. Note: You must have a delivered order for this product to write a review.';
      showToast(errMsg, 'error');
    }
  };

  // Delete review handler
  const handleReviewDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await deleteReview(reviewId).unwrap();
      showToast('Review deleted successfully.');
      refetchMyReview();
    } catch (err) {
      showToast('Failed to delete review.', 'error');
    }
  };

  // Mark review as helpful handler
  const handleMarkHelpful = async (reviewId: number) => {
    try {
      await markHelpful(reviewId).unwrap();
      showToast('Review marked as helpful!');
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Failed to mark review as helpful.';
      showToast(errMsg, 'error');
    }
  };

  return (
    <ProductDetailScreen
      isProductLoading={isProductLoading}
      isProductError={isProductError}
      product={product}
      variants={variants}
      images={detailData?.images || product?.images || []}
      relatedProducts={detailData?.relatedProducts || []}
      videos={product?.videos || []}
      wishlistItems={wishlistItems}
      selectedImageIdx={selectedImageIdx}
      setSelectedImageIdx={setSelectedImageIdx}
      selectedSize={selectedSize}
      setSelectedSize={selectSize}
      selectedColor={selectedColor}
      setSelectedColor={selectColor}
      quantity={quantity}
      setQuantity={setQuantity}
      availableSizes={availableSizes}
      availableColors={availableColors}
      handleWishlistToggle={handleWishlistToggle}
      handleAddToCart={handleAddToCart}
      handleBuyNow={handleBuyNow}
      isAuthenticated={isAuthenticated}
      reviewsResponse={reviewsResponse}
      isReviewsLoading={isReviewsLoading}
      myReview={myReviewResponse?.data}
      reviewsPage={reviewsPage}
      setReviewsPage={setReviewsPage}
      isReviewDialogOpen={isReviewDialogOpen}
      setIsReviewDialogOpen={setIsReviewDialogOpen}
      isEditingReview={isEditingReview}
      reviewRating={reviewRating}
      setReviewRating={setReviewRating}
      reviewComment={reviewComment}
      setReviewComment={setReviewComment}
      reviewImageInput={reviewImageInput}
      setReviewImageInput={setReviewImageInput}
      handleOpenWriteReview={handleOpenWriteReview}
      handleOpenEditReview={handleOpenEditReview}
      handleReviewSubmit={handleReviewSubmit}
      handleReviewDelete={handleReviewDelete}
      handleMarkHelpful={handleMarkHelpful}
      isSubmittingReview={isSubmittingReview || isUpdatingReview}
    />
  );
}

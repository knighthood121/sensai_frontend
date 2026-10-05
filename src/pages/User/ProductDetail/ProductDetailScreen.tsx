/* eslint-disable @typescript-eslint/no-explicit-any -- product and review records come from API response envelopes */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck, ChevronLeft, ChevronRight, Edit, Loader2,
  PackageCheck, Share2, Star, ThumbsUp, Trash2, Truck, X,
} from 'lucide-react';
import { FONTS } from '../../../constant/style';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

interface ProductDetailScreenProps {
  isProductLoading: boolean;
  isProductError: boolean;
  product: any;
  images: any[];
  relatedProducts: any[];
  videos: any[];
  wishlistItems: any[];
  selectedImageIdx: number;
  setSelectedImageIdx: (idx: number) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  availableSizes: string[];
  availableColors: string[];
  handleWishlistToggle: () => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  isAuthenticated: boolean;
  reviewsResponse: any;
  isReviewsLoading: boolean;
  myReview: any;
  reviewsPage: number;
  setReviewsPage: (page: number) => void;
  isReviewDialogOpen: boolean;
  setIsReviewDialogOpen: (open: boolean) => void;
  isEditingReview: boolean;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewComment: string;
  setReviewComment: (comment: string) => void;
  reviewImageInput: string;
  setReviewImageInput: (input: string) => void;
  handleOpenWriteReview: () => void;
  handleOpenEditReview: () => void;
  handleReviewSubmit: (event: React.FormEvent) => Promise<void>;
  handleReviewDelete: (id: number) => Promise<void>;
  handleMarkHelpful: (id: number) => Promise<void>;
  isSubmittingReview: boolean;
}

const money = (value: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value);

function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return <span className="inline-flex text-violet-600">{[1, 2, 3, 4, 5].map(star => <Star key={star} size={size} fill={star <= Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={1.7} />)}</span>;
}

export default function ProductDetailScreen(props: ProductDetailScreenProps) {
  const {
    isProductLoading, isProductError, product, images, videos, relatedProducts,
    selectedImageIdx, setSelectedImageIdx, selectedSize, setSelectedSize,
    selectedColor, setSelectedColor, quantity, setQuantity, availableSizes,
    availableColors, handleAddToCart, handleBuyNow, isAuthenticated,
    reviewsResponse, isReviewsLoading, myReview, reviewsPage, setReviewsPage,
    isReviewDialogOpen, setIsReviewDialogOpen, isEditingReview, reviewRating,
    setReviewRating, reviewComment, setReviewComment, reviewImageInput,
    setReviewImageInput, handleOpenWriteReview, handleOpenEditReview,
    handleReviewSubmit, handleReviewDelete, handleMarkHelpful, isSubmittingReview,
  } = props;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isProductLoading) {
    return <div className="min-h-screen bg-white" style={{ fontFamily: FONTS.main }}><Navbar /><div className="grid min-h-[50vh] place-items-center"><Loader2 className="animate-spin text-violet-600" size={38} /></div><Footer /></div>;
  }

  if (isProductError || !product) {
    return <div className="min-h-screen bg-white" style={{ fontFamily: FONTS.main }}><Navbar /><div className="grid min-h-[55vh] place-items-center text-center"><div><h1 className="text-3xl font-medium">Product not found</h1><button onClick={() => navigate('/')} className="mt-5 bg-violet-700 px-8 py-3 text-sm text-white">Back to shop</button></div></div><Footer /></div>;
  }

  const basePrice = Number(product.basePrice || 0);
  const sellingPrice = Number(product.discountPrice ?? product.basePrice ?? 0);
  const rating = Number(product.averageRating || 0);
  const selectedVariant = (product.variants || []).find(
    (variant: any) =>
      (!selectedSize || variant.size === selectedSize) &&
      (!selectedColor || variant.color === selectedColor),
  ) || product.variants?.[0];
  const stockCount = Math.max(
    0,
    Number(
      selectedVariant
        ? Number(selectedVariant.stock || 0) - Number(selectedVariant.reservedStock || 0)
        : product.availableStock ?? product.totalStock ?? 0,
    ),
  );
  const reviews = reviewsResponse?.data || [];
  const distribution = reviewsResponse?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const pagination = reviewsResponse?.pagination;
  const totalReviews = pagination?.total || product.reviewCount || 0;
  const currentImage = images[selectedImageIdx]?.imageUrl || product.images?.[0]?.imageUrl || '/images/mechanical-hero.png';
  const specifications = [
    ['Material', product.material],
    ['Finish', product.finish],
    ['Dimensions', product.dimensions],
    ['Pack', `${product.packQuantity || 1} ${product.unitOfMeasure || 'piece'}`],
  ].filter(([, value]) => value);

  const formatDate = (value: string) => new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return <div className="min-h-screen bg-white text-[#242424]" style={{ fontFamily: FONTS.main }}>
    <Navbar />
    <div className="relative flex h-[58px] items-center justify-center bg-[#121212] px-12 text-center text-xs tracking-[.05em] text-white sm:text-base">
      <ChevronLeft className="absolute left-[10%] text-gray-500" size={18} />
      Cash on Delivery is available on orders above ₹450 and below ₹800
      <ChevronRight className="absolute right-[10%] text-gray-500" size={18} />
    </div>

    <main className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:py-16">
      <section className="grid items-start gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 xl:gap-24">
        <div>
          <div className="aspect-square overflow-hidden bg-[#f5f5f5]">
            <img src={currentImage} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {images.slice(0, 5).map((image, index) => <button key={image.id || image.imageUrl} onClick={() => setSelectedImageIdx(index)} className={`aspect-square overflow-hidden border ${selectedImageIdx === index ? 'border-violet-700' : 'border-gray-200'}`}><img src={image.imageUrl} alt="" className="h-full w-full object-cover" /></button>)}
          </div>}
          {videos.length > 0 && <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {videos.map((video) => <div key={video.id || video.videoUrl} className="overflow-hidden border border-gray-200 bg-black"><video src={video.videoUrl} poster={video.thumbnailUrl || undefined} controls preload="metadata" className="aspect-video w-full object-contain" /></div>)}
          </div>}
        </div>

        <div className="lg:sticky lg:top-44">
          <h1 className="max-w-2xl text-4xl font-normal leading-[1.15] tracking-[-.035em] sm:text-5xl">{product.name}</h1>
          <div className="mt-5 flex items-center gap-2"><Stars rating={rating} size={18} /><span className="text-sm text-gray-500">{totalReviews} reviews, average rating {rating.toFixed(1)}</span></div>
          <p className="mt-5 text-xl">{money(sellingPrice)}</p>
          {basePrice > sellingPrice && <p className="mt-1 text-sm text-gray-400 line-through">{money(basePrice)}</p>}
          <p className="mt-3 text-xs text-gray-500 underline underline-offset-4">Shipping calculated at checkout.</p>
          <p className="mt-5 text-sm font-semibold">Taxes calculated at checkout</p>
          <div className={stockCount > 0 ? 'mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800' : 'mt-5 inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700'}>
            <span className={stockCount > 0 ? 'h-3 w-3 rounded-full bg-amber-400' : 'h-3 w-3 rounded-full bg-red-500'} />
            {stockCount > 0 ? `${stockCount} ${stockCount === 1 ? 'Piece' : 'Pieces'} in stock` : 'Out of stock'}
          </div>

          {availableSizes.length > 1 && <div className="mt-6"><p className="mb-2 text-xs text-gray-500">Size / Specification</p><div className="flex flex-wrap gap-2">{availableSizes.map(size => <button key={size} onClick={() => setSelectedSize(size)} className={`border px-4 py-2 text-xs ${selectedSize === size ? 'border-violet-700 text-violet-700' : 'border-gray-300'}`}>{size}</button>)}</div></div>}
          {availableColors.length > 1 && <div className="mt-4"><p className="mb-2 text-xs text-gray-500">Finish</p><div className="flex flex-wrap gap-2">{availableColors.map(color => <button key={color} onClick={() => setSelectedColor(color)} className={`border px-4 py-2 text-xs ${selectedColor === color ? 'border-violet-700 text-violet-700' : 'border-gray-300'}`}>{color}</button>)}</div></div>}

          <div className="mt-6">
            <p className="mb-2 text-xs text-gray-500">Quantity</p>
            <div className="flex h-12 w-36 items-center justify-between border border-gray-400"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-full px-5 text-lg">−</button><span className="text-sm">{quantity}</span><button disabled={stockCount === 0 || quantity >= stockCount} onClick={() => setQuantity(Math.min(stockCount, quantity + 1))} className="h-full px-5 text-lg disabled:cursor-not-allowed disabled:text-gray-300">+</button></div>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-6 text-gray-600">
            <p>Call / WhatsApp our Customer Support and Founders at <a href="tel:+918867622930" className="font-bold underline">+91 8867622930</a></p>
            <p>For <b>bulk rates WhatsApp</b> us at <a href="https://wa.me/918220974081" className="font-bold underline">+91 8220974081</a></p>
          </div>

          <div className="mt-6 grid gap-3">
            <button disabled={stockCount === 0} onClick={handleAddToCart} className="h-14 border border-gray-900 bg-white text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400">{stockCount > 0 ? 'Add to cart' : 'Out of stock'}</button>
            <button disabled={stockCount === 0} onClick={handleBuyNow} className="h-14 bg-violet-700 text-sm text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-gray-300">Buy It Now</button>
          </div>

          <div className="mt-4 border-2 border-violet-600 p-5 text-center">
            <p className="text-sm"><b>Free shipping</b> is only <b>Rs. 799.00</b> away!</p>
            <div className="relative mt-5 h-2 rounded-full bg-gray-300"><div className="h-full w-[24%] rounded-full bg-gray-400" /><div className="absolute inset-x-0 -top-2 flex justify-between"><span className="grid h-6 w-6 place-items-center rounded-full border bg-white"><Truck size={13} /></span>{[1, 2, 3].map(item => <span key={item} className="grid h-6 w-6 place-items-center rounded-full border bg-white"><PackageCheck size={13} /></span>)}</div></div>
          </div>

          <div className="mt-8 space-y-5 text-sm leading-7 text-gray-600">
            <p>{product.description}</p>
            {specifications.length > 0 && <dl className="space-y-2">{specifications.map(([label, value]) => <div key={String(label)} className="grid grid-cols-[120px_1fr] gap-3"><dt className="font-semibold text-gray-800">{label}</dt><dd>{value}</dd></div>)}</dl>}
            
            <button onClick={() => navigator.share?.({ title: product.name, url: window.location.href })} className="flex items-center gap-2 text-gray-700"><Share2 size={15} /> Share</button>
          </div>
        </div>
      </section>

      <section className="mt-24 border-t border-gray-100 pt-12">
        <h2 className="text-center text-2xl font-normal">Customer Reviews</h2>
        <div className="mt-10 grid gap-8 border-b border-gray-100 pb-10 md:grid-cols-[1fr_1.2fr_1fr] md:items-center">
          <div className="text-center md:border-r md:border-gray-100">
            <div className="flex items-center justify-center gap-2"><Stars rating={rating} size={20} /><a href="#reviews" className="text-sm text-violet-600 underline">{rating.toFixed(1)} out of 5</a></div>
            <p className="mt-2 text-sm text-gray-500">Based on {totalReviews} reviews <BadgeCheck className="inline text-emerald-500" size={15} /></p>
          </div>
          <div className="space-y-1.5 px-4">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = Number(distribution[stars] || 0);
              const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
              return <div key={stars} className="grid grid-cols-[90px_1fr_25px] items-center gap-3 text-xs"><Stars rating={stars} size={11} /><span className="h-3 bg-gray-100"><span className="block h-full bg-violet-600" style={{ width: `${percent}%` }} /></span><span className="text-gray-500">{count}</span></div>;
            })}
          </div>
          <div className="text-center md:border-l md:border-gray-100">
            {isAuthenticated && !myReview ? <button onClick={handleOpenWriteReview} className="w-full max-w-xs bg-violet-700 px-8 py-3 text-sm font-semibold text-white">Write a review</button> : !isAuthenticated ? <button onClick={() => navigate('/login')} className="w-full max-w-xs bg-violet-700 px-8 py-3 text-sm font-semibold text-white">Sign in to review</button> : <button onClick={handleOpenEditReview} className="w-full max-w-xs border border-violet-700 px-8 py-3 text-sm font-semibold text-violet-700">Edit your review</button>}
          </div>
        </div>

        <div id="reviews" className="mt-6">
          <div className="border-b border-gray-100 py-4 text-xs font-medium text-violet-700">Most Recent⌄</div>
          {myReview && <ReviewRow review={myReview} own formatDate={formatDate} onHelpful={handleMarkHelpful} onEdit={handleOpenEditReview} onDelete={handleReviewDelete} />}
          {isReviewsLoading ? <div className="grid py-20 place-items-center"><Loader2 className="animate-spin text-violet-700" /></div> : reviews.filter((review: any) => review.id !== myReview?.id).map((review: any) => <ReviewRow key={review.id} review={review} formatDate={formatDate} onHelpful={handleMarkHelpful} />)}
          {!isReviewsLoading && reviews.length === 0 && !myReview && <p className="py-16 text-center text-sm text-gray-500">No reviews yet. Be the first to review this product.</p>}
          {pagination?.totalPages > 1 && <div className="flex items-center justify-center gap-4 py-8 text-sm"><button disabled={reviewsPage === 1} onClick={() => setReviewsPage(Math.max(1, reviewsPage - 1))}>Previous</button><span>{reviewsPage} / {pagination.totalPages}</span><button disabled={reviewsPage === pagination.totalPages} onClick={() => setReviewsPage(Math.min(pagination.totalPages, reviewsPage + 1))}>Next</button></div>}
        </div>
      </section>

      {relatedProducts.length > 0 && <section className="mt-24">
        <h2 className="text-3xl font-normal">You may also like</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {relatedProducts.slice(0, 4).map((item: any) => {
            const price = Number(item.discountPrice ?? item.basePrice ?? 0);
            const image = item.images?.[0]?.imageUrl || '/images/mechanical-hero.png';
            return <button key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="text-left">
              <div className="aspect-square overflow-hidden bg-gray-100"><img src={image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div>
              <h3 className="mt-4 text-sm leading-5">{item.name}</h3>
              <p className="mt-2 text-sm">{money(price)}</p>
            </button>;
          })}
        </div>
      </section>}
    </main>

    <Footer />

    {isReviewDialogOpen && <div className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4">
      <button className="absolute inset-0" onClick={() => setIsReviewDialogOpen(false)} aria-label="Close review dialog" />
      <div className="relative z-10 w-full max-w-lg bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4"><h3 className="text-xl font-medium">{isEditingReview ? 'Edit Your Review' : 'Write a Product Review'}</h3><button onClick={() => setIsReviewDialogOpen(false)}><X size={20} /></button></div>
        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-5">
          <div><label className="mb-2 block text-xs uppercase tracking-wider text-gray-500">Rating</label><div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => <button type="button" key={star} onClick={() => setReviewRating(star)} className={star <= reviewRating ? 'text-violet-600' : 'text-gray-300'}><Star size={28} fill="currentColor" /></button>)}</div></div>
          <div><label className="mb-2 block text-xs uppercase tracking-wider text-gray-500">Review</label><textarea required rows={5} value={reviewComment} onChange={event => setReviewComment(event.target.value)} placeholder="Share your experience with this product..." className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-violet-600" /></div>
          <div><label className="mb-2 block text-xs uppercase tracking-wider text-gray-500">Photo URLs</label><input value={reviewImageInput} onChange={event => setReviewImageInput(event.target.value)} placeholder="Comma-separated image URLs (optional)" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-violet-600" /></div>
          <div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={() => setIsReviewDialogOpen(false)} className="border px-5 py-2.5 text-sm">Cancel</button><button type="submit" disabled={isSubmittingReview} className="bg-violet-700 px-6 py-2.5 text-sm text-white">{isSubmittingReview ? 'Saving...' : 'Submit review'}</button></div>
        </form>
      </div>
    </div>}
  </div>;
}

function ReviewRow({ review, own = false, formatDate, onHelpful, onEdit, onDelete }: { review: any; own?: boolean; formatDate: (value: string) => string; onHelpful: (id: number) => Promise<void>; onEdit?: () => void; onDelete?: (id: number) => Promise<void> }) {
  return <article className="border-b border-gray-100 py-9">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Stars rating={review.rating} size={16} />
        <div className="mt-3 flex items-center gap-2 text-sm text-violet-600"><span className="grid h-7 w-7 place-items-center border border-violet-300">♙</span><b>{review.user?.name || (own ? 'Your review' : 'Verified customer')}</b>{review.verified && <span className="bg-violet-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Verified</span>}</div>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400"><span>{formatDate(review.createdAt)}</span>{own && onEdit && <button onClick={onEdit}><Edit size={14} /></button>}{own && onDelete && <button onClick={() => void onDelete(review.id)}><Trash2 size={14} /></button>}</div>
    </div>
    <h4 className="mt-5 text-sm font-bold">{review.title || (review.rating >= 4 ? 'Excellent' : 'Customer review')}</h4>
    <p className="mt-3 max-w-5xl text-sm leading-6 text-gray-600">{review.comment || 'No written comment provided.'}</p>
    {review.images?.length > 0 && <div className="mt-4 flex gap-2">{review.images.map((image: string) => <img key={image} src={image} alt="" className="h-20 w-20 object-cover" />)}</div>}
    <button onClick={() => void onHelpful(review.id)} className="mt-4 flex items-center gap-2 text-xs text-gray-400"><ThumbsUp size={13} /> Helpful ({review.helpful || 0})</button>
  </article>;
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS, FONTS } from '../../../constant/style';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/common/Button';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../../service/wishlistApi';
import { useAddToCartMutation } from '../../../service/cartApi';
import { useLazyGetProductDetailsQuery } from '../../../service/productsApi';
import { useToast } from '../../../components/common/Toast';
import { useAppSelector } from '../../../app/hooks';
import {
  ChevronRight,
  Heart,
  Trash2,
  ShoppingCart,
} from 'lucide-react';

export default function WishlistScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to view your wishlist.' } });
    }
  }, [isAuthenticated, navigate]);

  const { data: wishlistData, isLoading } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const [triggerGetProductDetails] = useLazyGetProductDetailsQuery();

  const items = wishlistData?.data || [];

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId).unwrap();
      showToast('Removed from wishlist!');
    } catch (err) {
      showToast('Failed to remove item.', 'error');
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      const productRes = await triggerGetProductDetails(item.productId).unwrap();
      // Ensure we have a valid variant
      const variantId = productRes.data?.variants?.[0]?.id;
      if (!variantId) {
        showToast('No variants available for this product.', 'error');
        return;
      }

      await addToCart({
        productId: item.productId,
        variantId,
        quantity: 1
      }).unwrap();
      showToast('Added to cart!');
    } catch (err) {
      console.error(err);
      showToast('Failed to add to cart.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFC]" style={{ fontFamily: FONTS.main }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] relative overflow-hidden" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Decorative background blobs */}
      <div className="absolute top-[-8%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/8 to-purple-200/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/8 to-emerald-100/8 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-12 sm:py-16 relative z-10">

        {/* Breadcrumb Navigation & Title */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-pink-500 transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600">My Wishlist</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: FONTS.heading }}>
            My <span style={{ color: COLORS.primary }}>Wishlist</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-sm sm:text-base max-w-xl">
            Items you've saved to buy later.
          </p>

          {items.length > 0 && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mt-4">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 border-2 border-dashed border-gray-200 rounded-[32px] px-6 bg-white shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">Your wishlist is empty</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm leading-relaxed">
              Explore our collection and tap the heart icon on items you love to save them here.
            </p>
            <Button onClick={() => navigate('/')} size="lg" className="px-10 py-4 font-black uppercase tracking-wider text-xs rounded-full">
              Explore Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
            {items.map((item, index) => {
              const basePrice = Number(item.price ?? 35);
              const discountPrice = item.discountPrice ? Number(item.discountPrice) : null;
              const rating = Number(item.averageRating || 4.5);
              const imageUrl = item.image || '/images/product_white_tee.png';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white rounded-[28px] border border-gray-100/80 p-4 transition-all duration-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Wrapper */}
                    <div className="aspect-[4/5] rounded-[22px] overflow-hidden mb-5 border border-gray-100 bg-gray-50 relative">
                      <img
                        src={imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      />

                      {/* Floating Trash Icon */}
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="absolute top-4 right-4 w-9 h-9 bg-white/90 border border-gray-100 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-300 cursor-pointer text-gray-500 scale-100 hover:scale-105 active:scale-95"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 px-1 text-left">
                      <h4
                        className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.productName}
                      </h4>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill={i < Math.floor(rating) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={i < Math.floor(rating) ? "" : "text-gray-200"}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                        <span className="text-[10px] text-gray-400 font-extrabold ml-1.5">{rating.toFixed(1)}</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 pt-1">
                        {discountPrice !== null ? (
                          <>
                            <span className="text-lg font-black text-pink-600">₹{discountPrice}</span>
                            <span className="text-xs text-gray-450 line-through font-semibold">₹{basePrice}</span>
                          </>
                        ) : (
                          <span className="text-lg font-black text-gray-900">₹{basePrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 px-1">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      className="rounded-2xl font-black uppercase tracking-wider text-[10px] bg-pink-500 hover:bg-pink-400 border border-pink-400/50 py-3 transition-all duration-300 shadow-[0_4px_12px_rgba(236,72,153,0.2)] hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] active:scale-[0.98] cursor-pointer !bg-pink-500 text-white flex items-center justify-center gap-2"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

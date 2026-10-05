import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { useListProductsQuery, useLazyGetProductDetailsQuery } from '../../../service/productsApi';
import { useGetHomeQuery } from '../../../service/homeApi';
import { useGetWishlistQuery, useToggleWishlistMutation } from '../../../service/wishlistApi';
import { useAddToCartMutation, useGetCartQuery } from '../../../service/cartApi';
import { useToast } from '../../../components/common/Toast';
import LandingPageScreen from './LandingPageScreen';
import { addGuestCartItem } from '../../../utils/guestCart';

export interface LandingPageScreenProps {
  isAuthenticated: boolean;
  user: any;
  carouselIndex: number;
  setCarouselIndex: (index: number | ((prev: number) => number)) => void;
  quickViewProduct: any;
  setQuickViewProduct: (product: any) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  recentlyViewedIds: number[];
  dbProducts: any[];
  wishlistItems: any[];
  cartCount: number;
  isInWishlist: (productId: number) => boolean;
  handleWishlistToggle: (e: React.MouseEvent, productId: number) => Promise<void>;
  handleAddToCart: (e: React.MouseEvent | React.FormEvent, product: any, chosenSize?: string) => Promise<void>;
  handleBuyNow: (e: React.MouseEvent | React.FormEvent, product: any, chosenSize?: string) => void;
  handleOpenQuickView: (e: React.MouseEvent, product: any) => void;
  displayProducts: any[];
  recommendedProducts: any[];
  recentlyViewedProducts: any[];
  onLoginClick: () => void;
  banners?: any[];
  categories?: any[];
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Redux Auth state
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Carousel slider state
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Quick View Product State
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  // Recently Viewed product IDs
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);

  // Fetch home page data
  const { data: homeData } = useGetHomeQuery();
  const dbBanners = homeData?.data?.banners || [];
  const dbCategories = homeData?.data?.categories || [];
  const homeTrending = homeData?.data?.trendingProducts || [];
  const homeFeatured = homeData?.data?.featuredProducts || [];

  const slidesCount = 2;

  // Autoplay Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slidesCount]);

  // Lock body scroll when Quick View is open
  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [quickViewProduct]);

  // Fetch product listings
  const { data: productsData } = useListProductsQuery({ limit: 12 });
  const dbProducts = productsData?.data || [];

  // Fetch user wishlist
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const wishlistItems = wishlistData?.data || [];

  // Fetch user cart
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const cartCount = cartData?.data?.totalItems || 0;

  const [toggleWishlist] = useToggleWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const [triggerGetProductDetails] = useLazyGetProductDetailsQuery();

  // Load Recently Viewed list from localStorage
  useEffect(() => {
    if (user?.id) {
      const key = `recently_viewed_${user.id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        setRecentlyViewedIds(JSON.parse(stored));
      }
    } else {
      setRecentlyViewedIds([]);
    }
  }, [user]);

  const addToRecentlyViewed = (productId: number) => {
    if (!user?.id) return;
    const key = `recently_viewed_${user.id}`;
    const stored = localStorage.getItem(key);
    const list: number[] = stored ? JSON.parse(stored) : [];
    const filtered = list.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, 6); // Keep last 6 products
    localStorage.setItem(key, JSON.stringify(updated));
    setRecentlyViewedIds(updated);
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to manage your wishlist.' } });
      return;
    }
    try {
      const res = await toggleWishlist(productId).unwrap();
      if (res.data.action === 'added') {
        showToast('Added to wishlist!');
      } else {
        showToast('Removed from wishlist!');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update wishlist.', 'error');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent | React.FormEvent, product: any, chosenSize?: string) => {
    e.stopPropagation();
    e.preventDefault();

    // Find variant corresponding to size, or default first
    let variants = product.variants || [];
    if (variants.length === 0) {
      try {
        const detailRes = await triggerGetProductDetails(product.id).unwrap();
        variants = detailRes.data?.variants || [];
      } catch (err) {
        console.error('Failed to lazy load product variants:', err);
      }
    }
    const size = chosenSize || 'M';
    const variant = variants.find((v: any) => v.size === size) || variants[0];

    if (!variant?.id) {
      showToast('Product variants are unavailable.', 'error');
      return;
    }

    if (!isAuthenticated) {
      // Guest: save to localStorage
      const sellingPrice = Number(variant.price ?? product.discountPrice ?? product.basePrice ?? 35);
      addGuestCartItem({
        productId: product.id,
        variantId: variant.id,
        quantity: 1,
        productName: product.name,
        slug: product.slug || '',
        image: product.images?.[0]?.imageUrl || product.image || null,
        price: Number(product.basePrice ?? sellingPrice),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        sellingPrice,
        size: variant.size || size,
        color: variant.color || 'Default',
        sku: variant.sku || `${product.sku || 'sku'}-${size}`,
        stock: variant.stock || 10,
        itemTotal: sellingPrice,
      });
      showToast('Added to cart! Sign in to save your cart.');
      if (quickViewProduct) setQuickViewProduct(null);
      return;
    }

    try {
      await addToCart({ productId: product.id, variantId: variant.id, quantity: 1 }).unwrap();
      showToast('Added to cart!');
      if (quickViewProduct) setQuickViewProduct(null);
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.data?.message || 'Failed to add item to cart.';
      showToast(errMsg, 'error');
    }
  };

  const handleBuyNow = async (e: React.MouseEvent | React.FormEvent, product: any, chosenSize?: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to checkout.' } });
      return;
    }

    let variants = product.variants || [];
    if (variants.length === 0) {
      try {
        const detailRes = await triggerGetProductDetails(product.id).unwrap();
        variants = detailRes.data?.variants || [];
      } catch (err) {
        console.error('Failed to lazy load product variants:', err);
      }
    }
    const size = chosenSize || 'M';
    const variant = variants.find((v: any) => v.size === size) || variants[0];

    if (!variant?.id) {
      showToast('Product variants are unavailable.', 'error');
      return;
    }

    const checkoutItem = {
      id: product.id,
      productId: product.id,
      variantId: variant.id,
      quantity: 1,
      productName: product.name,
      slug: product.slug,
      image: product.images?.[0]?.imageUrl || product.image || null,
      sellingPrice: Number(product.discountPrice ?? product.basePrice ?? product.price ?? 35),
      price: Number(product.basePrice ?? product.price ?? 35),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
      size: variant.size || 'M',
      color: variant.color || 'Default',
      sku: variant.sku || `${product.sku || 'sku'}-M`,
      stock: variant.stock || 10,
      itemTotal: Number(product.discountPrice ?? product.basePrice ?? product.price ?? 35),
    };

    sessionStorage.setItem('tempCheckoutItem', JSON.stringify(checkoutItem));
    showToast('Order initiated! Redirecting to checkout...');
    if (quickViewProduct) setQuickViewProduct(null);
    navigate('/checkout');
  };

  const handleOpenQuickView = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setSelectedSize(product.variants?.[0]?.size || 'M');
    addToRecentlyViewed(product.id);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const displayProducts = homeTrending.length > 0 ? homeTrending : dbProducts;

  // Derive Recommended & Recently Viewed products list
  const recommendedProducts = homeFeatured.length > 0
    ? homeFeatured.slice(0, 4)
    : displayProducts.slice().reverse().slice(0, 4);

  const recentlyViewedProducts = displayProducts.filter((p) => recentlyViewedIds.includes(p.id));

  return (
    <LandingPageScreen
      isAuthenticated={isAuthenticated}
      user={user}
      carouselIndex={carouselIndex}
      setCarouselIndex={setCarouselIndex}
      quickViewProduct={quickViewProduct}
      setQuickViewProduct={setQuickViewProduct}
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      recentlyViewedIds={recentlyViewedIds}
      dbProducts={dbProducts}
      wishlistItems={wishlistItems}
      cartCount={cartCount}
      isInWishlist={isInWishlist}
      handleWishlistToggle={handleWishlistToggle}
      handleAddToCart={handleAddToCart}
      handleBuyNow={handleBuyNow}
      handleOpenQuickView={handleOpenQuickView}
      displayProducts={displayProducts}
      recommendedProducts={recommendedProducts}
      recentlyViewedProducts={recentlyViewedProducts}
      onLoginClick={handleLoginClick}
      banners={dbBanners}
      categories={dbCategories}
    />
  );
}

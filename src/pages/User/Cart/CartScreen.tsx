import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../constant/style';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/common/Button';
import type { CartScreenProps } from './index';
import {
  ChevronRight,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Lock,
  Info
} from 'lucide-react';

export default function CartScreen({
  isLoading,
  items,
  subtotal,
  shipping,
  total,
  isUpdating,
  handleQuantityChange,
  handleRemove,
  // onBack,
  onStartShopping,
  onCheckout,
  isGuest,
}: CartScreenProps) {
  const navigate = useNavigate();

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
            <span className="text-gray-600">Shopping Cart</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: FONTS.heading }}>
            Shopping <span style={{ color: COLORS.primary }}>Cart</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-sm sm:text-base max-w-xl">
            Review your items, adjust quantities, and proceed to checkout.
          </p>

          {items.length > 0 && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mt-4">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          )}

          {/* Guest sign-in banner */}
          {isGuest && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800">Sign in to save your cart</p>
                  <p className="text-xs text-gray-400 font-medium">Your items are stored locally. Log in to checkout &amp; keep them safe.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/login', { state: { message: 'Sign in to save your cart and proceed to checkout.' } })}
                className="shrink-0 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl text-white shadow-sm active:scale-95 transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
              >
                Sign In
              </button>
            </motion.div>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 border-2 border-dashed border-gray-200 rounded-[32px] px-6 bg-white shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">Your cart is empty</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm leading-relaxed">
              Looks like you haven't added anything to your cart yet. Let's find some premium quality essentials.
            </p>
            <Button onClick={onStartShopping} size="lg" className="px-10 py-4 font-black uppercase tracking-wider text-xs rounded-full">
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">

            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => {
                const itemPrice = Number(item.sellingPrice ?? item.discountPrice ?? item.price ?? 35);
                const imageUrl = item.image || '/images/product_white_tee.png';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 rounded-[28px] border border-gray-100/80 gap-6 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-400"
                  >
                    {/* Item Image and Meta */}
                    <div className="flex items-center gap-6 flex-1 w-full">
                      <div className="w-24 h-28 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 group relative cursor-pointer">
                        <img
                          src={imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1 hover:text-pink-600 transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                          {item.productName}
                        </h4>

                        {/* Attribute pills */}
                        <div className="flex flex-wrap gap-2">
                          {item.size && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-gray-50 border border-gray-100/60 px-2.5 py-1 rounded-md text-gray-500">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-gray-50 border border-gray-100/60 px-2.5 py-1 rounded-md text-gray-500">
                              Color: {item.color}
                            </span>
                          )}
                        </div>

                        <p className="text-pink-600 font-black text-lg pt-1">₹{itemPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-10 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                      {/* Quantity Buttons */}
                      <div className="flex items-center border border-gray-100/80 rounded-2xl p-1 bg-gray-50/40">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-xl bg-white hover:text-pink-500 border border-transparent hover:border-gray-100 active:scale-95 shadow-sm transition-all flex items-center justify-center font-black text-gray-500 cursor-pointer disabled:opacity-50"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-black text-sm text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-xl bg-white hover:text-pink-500 border border-transparent hover:border-gray-100 active:scale-95 shadow-sm transition-all flex items-center justify-center font-black text-gray-500 cursor-pointer disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex items-center gap-6">
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">Subtotal</p>
                          <p className="font-black text-gray-900 text-lg">₹{(itemPrice * item.quantity).toFixed(2)}</p>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="w-10 h-10 border border-gray-100/80 hover:border-rose-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 bg-white border border-gray-100/80 rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 space-y-6">
              <h3 className="text-2xl font-black tracking-tight text-gray-900" style={{ fontFamily: FONTS.heading }}>Order Summary</h3>

              <div className="space-y-4 text-sm font-semibold">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-bold">
                    {shipping === 0 ? <span className="text-emerald-600 uppercase font-black">Free</span> : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-[11px] text-pink-500 font-bold leading-normal bg-pink-50/60 border border-pink-100/60 p-3 rounded-2xl flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Add ₹{(100 - subtotal).toFixed(2)} more to unlock FREE shipping!</span>
                  </div>
                )}

                <div className="h-[1px] bg-gray-100 my-4" />

                <div className="flex justify-between items-baseline text-base font-black text-gray-900">
                  <span>Order Total</span>
                  <span className="text-2xl text-pink-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onCheckout}
                className="rounded-2xl font-black uppercase tracking-wider text-xs bg-pink-500 hover:bg-pink-400 border border-pink-400/50 py-4 shadow-[0_4px_12px_rgba(236,72,153,0.2)] hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all duration-300 active:scale-[0.98] cursor-pointer !bg-pink-500 text-white w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

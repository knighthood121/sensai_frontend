import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../../../constant/style';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import confetti from 'canvas-confetti';
import { useToast } from '../../../components/common/Toast';
import {
  Check,
  MapPin,
  CreditCard,
  Truck,
  Mail,
  MessageSquare,
  Phone,
  Copy,
  Tag,
  X,
  Percent,
  Ticket,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Loader2,
  Lock,
} from 'lucide-react';
import type { CheckoutScreenProps } from './index';

export default function CheckoutScreen({
  isLoading,
  name,
  setName,
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  city,
  setCity,
  stateName,
  setStateName,
  postalCode,
  setPostalCode,
  phone,
  setPhone,
  paymentMethod,
  setPaymentMethod,
  checkoutItems,
  subtotal,
  shipping,
  tax,
  total,
  availableCoupons,
  appliedCoupon,
  discountAmount,
  couponCode,
  setCouponCode,
  couponError,
  setCouponError,
  showCoupons,
  setShowCoupons,
  orderPlaced,
  placedOrderDetails,
  isValidating,
  handleApplyCoupon,
  handleRemoveCoupon,
  handlePlaceOrder,
  user,

  onContinueShopping,
  onTrackOrder,
  savedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  isProcessing,
}: CheckoutScreenProps) {
  const navigate = useNavigate();

  // Trigger confetti celebration on successful checkout
  useEffect(() => {
    if (orderPlaced && placedOrderDetails) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [orderPlaced, placedOrderDetails]);

  const { showToast } = useToast();

  // If loading and order is not yet placed
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

  // Order Success Screen
  if (orderPlaced && placedOrderDetails) {
    const formatDateRange = (orderDateStr: string) => {
      if (!orderDateStr) return 'July 28 – July 30';
      try {
        const orderDate = new Date(orderDateStr);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

        const startDate = new Date(orderDate);
        startDate.setDate(orderDate.getDate() + 3);

        const endDate = new Date(orderDate);
        endDate.setDate(orderDate.getDate() + 5);

        return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', options)}`;
      } catch (e) {
        return 'July 28 – July 30';
      }
    };

    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFC] relative overflow-hidden" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
        {/* Floating decorative blurred gradient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-300/10 to-purple-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-300/10 to-emerald-200/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <Navbar />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 text-center flex flex-col items-center justify-center relative z-10">

          {/* Success Hero Section */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mb-6 shadow-[0_12px_40px_rgba(16,185,129,0.25)] border border-emerald-300/20"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-gray-900"
            style={{ fontFamily: FONTS.heading }}
          >
            Order Confirmed 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-500 font-medium text-base md:text-lg max-w-xl mx-auto mb-6 leading-relaxed"
          >
            Thank you for your purchase. We've received your order and are preparing it for shipment.
          </motion.p>

          {/* Stylish Badge for Order number */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(placedOrderDetails.orderId);
                showToast('Order ID copied to clipboard!', 'success');
              }}
              className="bg-white/80 hover:bg-white border border-gray-200/60 rounded-full px-5 py-2.5 inline-flex items-center gap-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-pink-300 hover:shadow-md cursor-pointer group active:scale-95"
            >
              <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Order</span>
              <span className="text-gray-900 font-black text-sm">{placedOrderDetails.orderId}</span>
              <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </button>
          </motion.div>

          {/* Horizontal Progress Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-3xl mx-auto mb-16 px-4"
          >
            <div className="relative flex items-center justify-between w-full">
              {/* Background Line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full -z-10" />

              {/* Active Animated Progress Line */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "25%" }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full -z-10"
              />

              {/* Timeline Steps */}
              {[
                { label: "Order Confirmed", desc: "Completed", isCompleted: true, isActive: false },
                { label: "Processing", desc: "Active", isCompleted: false, isActive: true },
                { label: "Shipped", desc: "Upcoming", isCompleted: false, isActive: false },
                { label: "Out for Delivery", desc: "Upcoming", isCompleted: false, isActive: false },
                { label: "Delivered", desc: "Upcoming", isCompleted: false, isActive: false },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 relative">
                  {/* Circle indicator */}
                  {step.isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-4 border-emerald-100 flex items-center justify-center text-white shadow-md transition-all duration-300">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : step.isActive ? (
                    <div className="relative">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-ping" />
                      <div className="relative w-8 h-8 rounded-full bg-white border-4 border-teal-400 flex items-center justify-center shadow-md transition-all duration-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center text-gray-300 shadow-sm transition-all duration-300" />
                  )}

                  {/* Label */}
                  <span className={`mt-3 text-[10px] md:text-xs font-black uppercase tracking-wider text-center max-w-[80px] md:max-w-[120px] transition-colors duration-300 ${step.isCompleted || step.isActive ? "text-gray-900" : "text-gray-400"
                    }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Two-Column Responsive Details and Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-5xl mx-auto mb-16">

            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-6">

              {/* Email confirmation alert */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="bg-emerald-50/60 border border-emerald-100/60 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-medium backdrop-blur-sm shadow-sm text-left"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <p className="leading-tight">
                  A confirmation email has been sent to <span className="font-bold text-emerald-950">{user?.email || 'mokshita@email.com'}</span>
                </p>
              </motion.div>

              {/* Main Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white rounded-[24px] border border-black/[0.03] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-500 space-y-6 text-left"
              >
                <h3 className="text-xl font-bold tracking-tight text-gray-900 border-b pb-4 border-gray-100 flex items-center gap-2" style={{ fontFamily: FONTS.heading }}>
                  Delivery & Payment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Delivery address */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      <span>Delivery Address</span>
                    </div>
                    <div className="pl-6 text-sm text-gray-600">
                      <p className="font-black text-gray-900">{placedOrderDetails.address.name}</p>
                      <p className="font-semibold leading-relaxed mt-1">
                        {placedOrderDetails.address.addressLine1}
                        {placedOrderDetails.address.addressLine2 && `, ${placedOrderDetails.address.addressLine2}`}
                      </p>
                      <p className="font-semibold">{placedOrderDetails.address.city}, {placedOrderDetails.address.state} - {placedOrderDetails.address.postalCode}</p>
                      {placedOrderDetails.address.phone && <p className="font-semibold text-xs text-gray-400 mt-2">📞 {placedOrderDetails.address.phone}</p>}
                    </div>
                  </div>

                  {/* Payment details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400">
                        <CreditCard className="w-4 h-4 text-pink-500" />
                        <span>Payment Method</span>
                      </div>
                      <div className="pl-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600 border border-pink-100 uppercase tracking-wider">
                          {placedOrderDetails.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Estimated delivery */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400">
                        <Truck className="w-4 h-4 text-pink-500" />
                        <span>Arriving by</span>
                      </div>
                      <div className="pl-6 text-sm font-bold text-gray-900">
                        {formatDateRange(placedOrderDetails.date)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Paid block */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400">
                    <span>Total Paid</span>
                  </div>
                  <span className="text-2xl font-black text-pink-600">₹{placedOrderDetails.total.toFixed(2)}</span>
                </div>
              </motion.div>

              {/* Customer Support section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="space-y-4 text-left"
              >
                <h4 className="text-sm font-black uppercase tracking-wider text-gray-400 pl-1">Need Help?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <MessageSquare className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />,
                      title: "Live Chat",
                      desc: "Talk to our team live",
                      action: () => showToast("Starting Live Chat support...", "success")
                    },
                    {
                      icon: <Mail className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />,
                      title: "Email Support",
                      desc: "support@sansei.com",
                      action: () => { window.location.href = "mailto:support@sansei.com"; }
                    },
                    {
                      icon: <Phone className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />,
                      title: "Call Support",
                      desc: "+1 (800) 123-4567",
                      action: () => { window.location.href = "tel:+18001234567"; }
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={item.action}
                      className="bg-white hover:bg-gray-50/50 border border-gray-100 hover:border-pink-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-start cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                        {item.icon}
                      </div>
                      <h5 className="font-extrabold text-sm text-gray-900 mb-0.5">{item.title}</h5>
                      <p className="text-xs text-gray-400 font-semibold">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Order Items Summary */}
            <div className="lg:col-span-5 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white rounded-[24px] border border-black/[0.03] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-500 flex flex-col h-full"
              >
                <h3 className="text-xl font-bold tracking-tight text-gray-900 border-b pb-4 border-gray-100 flex items-center justify-between" style={{ fontFamily: FONTS.heading }}>
                  <span>Order Summary</span>
                  <span className="text-xs font-black bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full uppercase">
                    {placedOrderDetails.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} Items
                  </span>
                </h3>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto max-h-[380px] space-y-4 pr-1 my-6">
                  {placedOrderDetails.items.map((item: any, idx: number) => {
                    const imageUrl = item.image || '/images/product_white_tee.png';
                    return (
                      <div key={idx} className="flex gap-4 items-center py-2 border-b border-gray-50 last:border-0">
                        <div className="w-14 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 relative shadow-sm">
                          <img src={imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-black text-gray-900 text-sm truncate leading-snug">{item.productName}</h5>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full uppercase">
                              Size: {item.size}
                            </span>
                            {item.color && (
                              <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full uppercase">
                                Color: {item.color}
                              </span>
                            )}
                            <span className="text-[10px] text-pink-600 font-extrabold bg-pink-50/50 border border-pink-100 px-2 py-0.5 rounded-full uppercase">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-black text-gray-900 text-sm shrink-0 pl-2">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing break-down */}
                <div className="border-t border-gray-100 pt-6 space-y-3.5 text-sm font-semibold">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{placedOrderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="text-gray-900 font-bold">
                      {placedOrderDetails.shipping === 0 ? (
                        <span className="text-emerald-600 uppercase font-black">Free</span>
                      ) : (
                        `₹${placedOrderDetails.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {placedOrderDetails.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Coupon ({placedOrderDetails.couponCode})
                      </span>
                      <span className="font-bold">-₹{placedOrderDetails.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {placedOrderDetails.tax > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Tax</span>
                      <span className="text-gray-900 font-bold">₹{placedOrderDetails.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-150 my-4" />
                  <div className="flex justify-between items-baseline text-base font-black text-gray-900">
                    <span>Total Paid</span>
                    <span className="text-2xl text-pink-600">₹{placedOrderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mx-auto"
          >
            <button
              type="button"
              onClick={onTrackOrder}
              className="flex-1 rounded-full px-8 py-4 font-black uppercase tracking-wider text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-[0_8px_24px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_30px_rgba(236,72,153,0.4)] transition-all duration-300 transform active:scale-95 hover:scale-[1.02] cursor-pointer"
            >
              Track Order
            </button>
            <button
              type="button"
              onClick={onContinueShopping}
              className="flex-1 rounded-full px-8 py-4 font-black uppercase tracking-wider text-xs border border-gray-250 text-gray-700 hover:text-gray-900 hover:border-gray-900 bg-white hover:bg-gray-50 transition-all duration-300 transform active:scale-95 hover:scale-[1.02] cursor-pointer"
            >
              Continue Shopping
            </button>
          </motion.div>

        </main>

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
            <button type="button" onClick={() => navigate('/')} className="hover:text-pink-500 transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3" />
            <button type="button" onClick={() => navigate('/cart')} className="hover:text-pink-500 transition-colors cursor-pointer">Cart</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600">Checkout</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: FONTS.heading }}>
            Secure <span style={{ color: COLORS.primary }}>Checkout</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-sm sm:text-base max-w-xl">
            Please enter your shipping address and choose your preferred payment method.
          </p>
        </div>

        {checkoutItems.length === 0 ? (
          <div className="text-center py-24 border border-gray-100 rounded-[28px] bg-white shadow-sm max-w-xl mx-auto">
            <p className="text-gray-450 mb-6 font-bold">No items found for checkout.</p>
            <Button onClick={onContinueShopping}>Continue Shopping</Button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">

            {/* Delivery details form */}
            <div className="lg:col-span-7 space-y-8">

              {/* Shipping Address Container */}
              <div className="bg-white border border-gray-100/80 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
                <h3 className="text-2xl font-black tracking-tight text-gray-900" style={{ fontFamily: FONTS.heading }}>Shipping Address</h3>

                {savedAddresses && savedAddresses.length > 0 && (
                  <div className="space-y-4 mb-6 border-b pb-6 border-gray-100">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Select Delivery Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedAddresses.map((addr: any) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`border-2 rounded-2xl p-5 cursor-pointer text-left transition-all duration-300 relative ${selectedAddressId === addr.id
                            ? 'border-pink-500 bg-pink-50/5 shadow-[0_4px_20px_rgba(236,72,153,0.08)] scale-[1.01]'
                            : 'border-gray-100/80 hover:border-pink-200/80 hover:shadow-md bg-white'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-sm text-gray-900">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-black uppercase bg-pink-100/50 text-pink-600 border border-pink-100/50 px-2 py-0.5 rounded-md">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed truncate">
                            {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}, {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-wider">📞 {addr.phone}</p>
                        </div>
                      ))}
                      <div
                        onClick={() => setSelectedAddressId(null)}
                        className={`border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] ${selectedAddressId === null
                          ? 'border-pink-500 bg-pink-50/5 shadow-[0_4px_20px_rgba(236,72,153,0.08)] text-pink-600 scale-[1.01]'
                          : 'border-gray-200 hover:border-pink-200 text-gray-400 hover:text-pink-500 bg-white'
                          }`}
                      >
                        <MapPin className="w-5 h-5 mb-1.5" />
                        <span className="font-black text-xs uppercase tracking-widest">Add New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAddressId === null && (
                  <div className="space-y-4 pt-2">
                    <Input
                      label="Full Name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Recipient's Name"
                    />

                    <Input
                      label="Address Line 1"
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Street Address, P.O. Box, Company Name"
                    />

                    <Input
                      label="Address Line 2 (Optional)"
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, Suite, Unit, Building, Floor"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                      />
                      <Input
                        label="State"
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="NY"
                      />
                      <Input
                        label="Postal Code"
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="10001"
                      />
                    </div>

                    <Input
                      label="Phone Number"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number for delivery notifications"
                    />
                  </div>
                )}

                {selectedAddressId !== null && (
                  <div className="bg-pink-50/20 border border-pink-100/40 rounded-2xl p-5 text-left flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Selected Shipping Details</h4>
                      <p className="text-sm font-black text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {addressLine1}{addressLine2 && `, ${addressLine2}`}, {city}, {stateName} - {postalCode}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">📞 {phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods Container */}
              <div className="bg-white border border-gray-100/80 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
                <h3 className="text-2xl font-black tracking-tight text-gray-900" style={{ fontFamily: FONTS.heading }}>Payment Method</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['COD', 'Razorpay'] as const).map((method) => (
                    <div
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`border-2 rounded-2xl p-6 flex flex-col justify-between h-36 cursor-pointer transition-all duration-300 relative ${paymentMethod === method
                        ? 'border-pink-500 bg-pink-50/5 shadow-[0_4px_20px_rgba(236,72,153,0.08)] scale-[1.01]'
                        : 'border-gray-100/80 hover:border-pink-200/80 hover:shadow-md bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-gray-900 uppercase tracking-widest">
                          {method === 'COD' ? 'COD' : 'Razorpay'}
                        </span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="w-4 h-4 cursor-pointer"
                          style={{ accentColor: COLORS.primary }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                        {method === 'COD' ? 'Cash on Delivery' : 'Pay via Cards/UPI/QR'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Summary Container */}
            <div className="lg:col-span-5 bg-white border border-gray-100/80 rounded-[28px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 space-y-6 text-left">
              <h3 className="text-2xl font-black tracking-tight text-gray-900" style={{ fontFamily: FONTS.heading }}>Order Summary</h3>

              {/* Order Items List */}
              <div className="max-h-64 overflow-y-auto space-y-4 pr-2 border-b pb-6 border-gray-100">
                {checkoutItems.map((item, idx) => {
                  const imageUrl = item.image || '/images/product_white_tee.png';
                  return (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-12 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm">
                        <img src={imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-xs truncate leading-snug">{item.productName}</h5>

                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-gray-50 border border-gray-100/60 px-2 py-0.5 rounded text-gray-500">
                            Size: {item.size}
                          </span>
                          {item.color && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-gray-50 border border-gray-100/60 px-2 py-0.5 rounded text-gray-500">
                              Color: {item.color}
                            </span>
                          )}
                          <span className="text-[9px] font-black uppercase tracking-wider bg-pink-50/60 border border-pink-100/60 px-2 py-0.5 rounded text-pink-600">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <span className="font-black text-gray-900 text-sm shrink-0">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" /> Promo Code
                  </h4>
                  {availableCoupons.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowCoupons(!showCoupons)}
                      className="text-[10px] font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {showCoupons ? 'Hide' : `View ${availableCoupons.length} Coupons`}
                      {showCoupons ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* Applied Coupon Display */}
                {appliedCoupon ? (
                  <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-4 flex items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          {appliedCoupon.couponType === 'PERCENTAGE'
                            ? `${appliedCoupon.discountValue}% off`
                            : `₹${appliedCoupon.discountValue} off`}
                          {' '}&mdash; You save <span className="font-black text-emerald-700">₹{discountAmount.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="w-6 h-6 rounded-full bg-emerald-100 hover:bg-rose-100 text-emerald-600 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Promo code input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider placeholder:text-gray-300 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(couponCode)}
                        disabled={isValidating || !couponCode.trim()}
                        className="px-5 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        {isValidating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                      </button>
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                      {couponError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[10px] text-red-500 font-bold pl-1 mt-1"
                        >
                          {couponError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Available Coupons Dropdown */}
                    <AnimatePresence>
                      {showCoupons && availableCoupons.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2"
                        >
                          <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3 space-y-2 max-h-48 overflow-y-auto">
                            {availableCoupons.map((coupon) => (
                              <button
                                type="button"
                                key={coupon.id}
                                onClick={() => {
                                  setCouponCode(coupon.code);
                                  handleApplyCoupon(coupon.code);
                                  setShowCoupons(false);
                                }}
                                className="w-full text-left bg-white hover:bg-pink-50/30 border border-gray-100 hover:border-pink-200/60 rounded-xl p-2.5 flex items-center gap-3 transition-all cursor-pointer group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100/50 flex items-center justify-center shrink-0 group-hover:from-pink-100 group-hover:to-purple-100 transition-colors">
                                  <Percent className="w-3.5 h-3.5 text-pink-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black uppercase tracking-wider text-gray-900 truncate">{coupon.code}</p>
                                  <p className="text-[9px] text-gray-400 font-semibold truncate mt-0.5">
                                    {coupon.couponType === 'PERCENTAGE'
                                      ? `${coupon.discountValue}% off`
                                      : `₹${coupon.discountValue} off`}
                                    {coupon.minOrderAmount ? ` • Min order ₹${coupon.minOrderAmount}` : ''}
                                    {coupon.maxDiscount ? ` • Max ₹${coupon.maxDiscount}` : ''}
                                  </p>
                                </div>
                                <span className="text-[9px] font-bold text-pink-500 uppercase tracking-widest shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Apply
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>

              {/* Separator */}
              <div className="h-[1px] bg-gray-100 my-4" />

              {/* Price Details */}
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

                {discountAmount > 0 && appliedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-emerald-650"
                  >
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <Tag className="w-3.5 h-3.5" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-bold text-emerald-600">-₹{discountAmount.toFixed(2)}</span>
                  </motion.div>
                )}

                {tax > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Tax</span>
                    <span className="text-gray-900 font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-[1px] bg-gray-100 my-4" />

                <div className="flex justify-between items-baseline text-base font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-2xl text-pink-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isProcessing}
                className="rounded-2xl font-black uppercase tracking-wider text-xs bg-pink-500 hover:bg-pink-400 border border-pink-400/50 py-4 shadow-[0_4px_12px_rgba(236,72,153,0.2)] hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all duration-300 active:scale-[0.98] cursor-pointer !bg-pink-500 text-white disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Processing...
                  </>
                ) : (
                  `Place Order (₹${total.toFixed(2)})`
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Safe & Secure Checkout</span>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

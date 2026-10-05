import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutScreen from './CheckoutScreen';
import { useGetCartQuery, useClearCartMutation, useAddToCartMutation } from '../../../service/cartApi';
import { useListCouponsQuery, useValidateCouponMutation } from '../../../service/couponApi';
import { useGetAddressesQuery, useCreateAddressMutation } from '../../../service/addressApi';
import { useCheckoutMutation } from '../../../service/checkoutApi';
import { useVerifyPaymentMutation, useHandlePaymentFailureMutation } from '../../../service/paymentApi';
import { useToast } from '../../../components/common/Toast';
import { useAppSelector } from '../../../app/hooks';

export interface OrderItem {
  productId: number;
  variantId: number;
  productName: string;
  image: string | null;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  couponType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
}

export interface CheckoutScreenProps {
  isLoading: boolean;
  name: string;
  setName: (val: string) => void;
  addressLine1: string;
  setAddressLine1: (val: string) => void;
  addressLine2: string;
  setAddressLine2: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  stateName: string;
  setStateName: (val: string) => void;
  postalCode: string;
  setPostalCode: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  paymentMethod: 'COD' | 'Razorpay';
  setPaymentMethod: (val: 'COD' | 'Razorpay') => void;
  checkoutItems: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  availableCoupons: any[];
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  couponCode: string;
  setCouponCode: (val: string) => void;
  couponError: string;
  setCouponError: (val: string) => void;
  showCoupons: boolean;
  setShowCoupons: (val: boolean) => void;
  orderPlaced: boolean;
  placedOrderDetails: any;
  isValidating: boolean;
  handleApplyCoupon: (code: string) => Promise<void>;
  handleRemoveCoupon: () => void;
  handlePlaceOrder: (e: FormEvent) => Promise<void>;
  user: any;
  onBack: () => void;
  onContinueShopping: () => void;
  onTrackOrder: () => void;

  // Saved address props
  savedAddresses?: any[];
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
  isProcessing: boolean;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Form fields
  const [name, setName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Razorpay'>('COD');

  // Address selection state
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Checkout states
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<any>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);

  // Queries & Mutations
  const { data: cartResponse, isLoading: isCartLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated || isBuyNow });
  const [clearCart] = useClearCartMutation();
  const [addToCart] = useAddToCartMutation();
  const { data: couponsResponse } = useListCouponsQuery(undefined, { skip: !isAuthenticated });
  const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation();

  const { data: addressesResponse, isLoading: isAddressesLoading } = useGetAddressesQuery(undefined, { skip: !isAuthenticated });
  const [createAddress] = useCreateAddressMutation();
  const [checkout] = useCheckoutMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [handlePaymentFailure] = useHandlePaymentFailureMutation();

  const addresses = addressesResponse?.data || [];

  // Setup defaults and buy now values
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to continue to checkout.' } });
      return;
    }

    if (user?.name) {
      setName(user.name);
    }

    const tempItem = sessionStorage.getItem('tempCheckoutItem');
    if (tempItem) {
      setIsBuyNow(true);
      setBuyNowItem(JSON.parse(tempItem));
    }
  }, [isAuthenticated, user, navigate]);

  // Set default selected address
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    } else {
      setSelectedAddressId(null);
    }
  }, [addressesResponse]);

  // Autofill form when saved address is chosen
  useEffect(() => {
    if (selectedAddressId !== null) {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        setName(addr.fullName);
        setAddressLine1(addr.addressLine1);
        setAddressLine2(addr.addressLine2 || '');
        setCity(addr.city);
        setStateName(addr.state);
        setPostalCode(addr.postalCode);
        setPhone(addr.phone);
      }
    } else {
      setName(user?.name || '');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setStateName('');
      setPostalCode('');
      setPhone('');
    }
  }, [selectedAddressId, addresses, user]);

  // Derive order items and calculations
  let checkoutItems: OrderItem[] = [];
  let subtotal = 0;

  if (isBuyNow && buyNowItem) {
    checkoutItems = [{
      productId: buyNowItem.productId,
      variantId: buyNowItem.variantId,
      productName: buyNowItem.productName,
      image: buyNowItem.image,
      price: Number(buyNowItem.sellingPrice ?? buyNowItem.price),
      quantity: buyNowItem.quantity,
      size: buyNowItem.size,
      color: buyNowItem.color,
    }];
    subtotal = checkoutItems[0].price * checkoutItems[0].quantity;
  } else if (cartResponse?.data) {
    const items = cartResponse.data.items || [];
    checkoutItems = items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      image: item.image,
      price: Number(item.sellingPrice ?? item.discountPrice ?? item.price),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));
    subtotal = cartResponse.data.cartTotal;
  }

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const tax = subtotal > 0 ? Math.round((subtotal - discountAmount) * 0.18 * 100) / 100 : 0;
  const total = subtotal + shipping - discountAmount + tax;

  // Filter active, non-expired coupons
  const availableCoupons = (couponsResponse?.data || []).filter((c) => {
    if (!c.isActive) return false;
    if (c.expiresAt && new Date(c.expiresAt) < new Date()) return false;
    return true;
  });

  const handleApplyCoupon = async (code: string) => {
    if (!code.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    setCouponError('');
    const trimmedCode = code.trim().toUpperCase();
    try {
      const payload: { code: string; orderAmount?: number } = { code: trimmedCode };
      if (subtotal > 0) {
        payload.orderAmount = subtotal;
      }
      const result = await validateCoupon(payload).unwrap();
      if (result?.data) {
        const backendDiscount = result.data.discount ?? result.data.discountAmount ?? 0;
        const matchedCoupon = availableCoupons.find((c) => c.code === trimmedCode);
        setAppliedCoupon({
          code: trimmedCode,
          discountAmount: backendDiscount,
          couponType: matchedCoupon?.couponType || 'FIXED',
          discountValue: matchedCoupon?.discountValue || backendDiscount,
        });
        setDiscountAmount(backendDiscount);
        setCouponCode(trimmedCode);
        showToast(`Coupon "${trimmedCode}" applied! You save ₹${backendDiscount.toFixed(2)}`, 'success');
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.errors?.[0] || err?.data?.error || 'Invalid or expired coupon code.';
      setCouponError(msg);
      showToast(msg, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError('');
    showToast('Coupon removed.', 'success');
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !addressLine1.trim() || !city.trim() || !stateName.trim() || !postalCode.trim() || !phone.trim()) {
      showToast('Please fill in all required delivery details.', 'error');
      return;
    }

    if (checkoutItems.length === 0) {
      showToast('Your checkout items list is empty.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      let finalAddressId = selectedAddressId;

      // 1. Create address on backend if it's a new address
      if (finalAddressId === null) {
        showToast('Saving delivery address...', 'info');
        const newAddressRes = await createAddress({
          fullName: name,
          phone,
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          state: stateName,
          postalCode,
          country: 'IN',
          isDefault: false,
        }).unwrap();
        finalAddressId = newAddressRes.data.id;
      }

      // 2. Add buy now item to cart first if applicable
      if (isBuyNow && buyNowItem) {
        showToast('Preparing items in cart...', 'info');
        await addToCart({
          productId: buyNowItem.productId,
          variantId: buyNowItem.variantId,
          quantity: buyNowItem.quantity,
        }).unwrap();
      }

      // 3. Initiate backend checkout
      showToast('Processing checkout...', 'info');
      const checkoutRes = await checkout({
        addressId: finalAddressId as number,
        couponCode: appliedCoupon?.code || undefined,
        paymentMethod: paymentMethod === 'Razorpay' ? 'RAZORPAY' : 'COD',
        customerNotes: 'Please deliver safely',
      }).unwrap();

      const orderData = checkoutRes.data.order;
      const paymentData = checkoutRes.data.payment;

      if (paymentMethod === 'COD') {
        const newOrderDetails = {
          orderId: orderData.orderNumber,
          date: orderData.createdAt,
          items: checkoutItems,
          subtotal: orderData.subtotal,
          shipping: orderData.shippingCharges,
          discount: orderData.discountAmount,
          tax: orderData.taxAmount,
          couponCode: orderData.couponCode,
          total: orderData.totalAmount,
          address: {
            name,
            addressLine1,
            addressLine2,
            city,
            state: stateName,
            postalCode,
            phone,
          },
          paymentMethod: 'COD',
          status: 'Placed',
        };

        if (isBuyNow) {
          sessionStorage.removeItem('tempCheckoutItem');
        } else {
          // Clear cart on successful COD checkout
          try {
            await clearCart(undefined).unwrap();
          } catch (cartErr) {
            console.error('Failed to clear cart:', cartErr);
          }
        }

        setPlacedOrderDetails(newOrderDetails);
        setOrderPlaced(true);
        showToast('Order placed successfully!', 'success');
      } else if (paymentMethod === 'Razorpay' && paymentData) {
        showToast('Loading payment gateway...', 'info');
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          showToast('Failed to load Razorpay payment gateway script.', 'error');
          setIsProcessing(false);
          return;
        }

        const options = {
          key: paymentData.razorpayKeyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: 'Sansei',
          description: `Payment for Order #${orderData.orderNumber}`,
          order_id: paymentData.razorpayOrderId,
          handler: async (response: any) => {
            try {
              showToast('Verifying payment...', 'info');
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();

              const verifiedOrderDetails = {
                orderId: orderData.orderNumber,
                date: orderData.createdAt,
                items: checkoutItems,
                subtotal: orderData.subtotal,
                shipping: orderData.shippingCharges,
                discount: orderData.discountAmount,
                tax: orderData.taxAmount,
                couponCode: orderData.couponCode,
                total: orderData.totalAmount,
                address: {
                  name,
                  addressLine1,
                  addressLine2,
                  city,
                  state: stateName,
                  postalCode,
                  phone,
                },
                paymentMethod: 'Razorpay',
                status: 'Paid',
              };

              if (isBuyNow) {
                sessionStorage.removeItem('tempCheckoutItem');
              }

              setPlacedOrderDetails(verifiedOrderDetails);
              setOrderPlaced(true);
              showToast('Payment verified & order placed successfully!', 'success');
            } catch (err: any) {
              showToast(err?.data?.message || 'Payment verification failed.', 'error');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name,
            email: user?.email || '',
            contact: phone,
          },
          theme: {
            color: '#EC4899',
          },
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
            paylater: true,
          },
          config: {
            display: {
              preferences: {
                show_default_blocks: true,
              },
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', async (response: any) => {
          try {
            await handlePaymentFailure({
              razorpay_order_id: response.error.metadata.order_id,
              errorCode: response.error.code,
              errorDescription: response.error.description,
            }).unwrap();
          } catch (err) {
            console.error('Failed to report payment failure to backend:', err);
          }
          showToast(response.error.description || 'Payment failed.', 'error');
          setIsProcessing(false);
        });
        rzp.open();
      }
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      if (paymentMethod !== 'Razorpay') {
        setIsProcessing(false);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate('/orders');
  };

  const isLoading = (isCartLoading && !isBuyNow && !orderPlaced) || isAddressesLoading;

  return (
    <CheckoutScreen
      isLoading={isLoading}
      name={name}
      setName={setName}
      addressLine1={addressLine1}
      setAddressLine1={setAddressLine1}
      addressLine2={addressLine2}
      setAddressLine2={setAddressLine2}
      city={city}
      setCity={setCity}
      stateName={stateName}
      setStateName={setStateName}
      postalCode={postalCode}
      setPostalCode={setPostalCode}
      phone={phone}
      setPhone={setPhone}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      checkoutItems={checkoutItems}
      subtotal={subtotal}
      shipping={shipping}
      tax={tax}
      total={total}
      availableCoupons={availableCoupons}
      appliedCoupon={appliedCoupon}
      discountAmount={discountAmount}
      couponCode={couponCode}
      setCouponCode={setCouponCode}
      couponError={couponError}
      setCouponError={setCouponError}
      showCoupons={showCoupons}
      setShowCoupons={setShowCoupons}
      orderPlaced={orderPlaced}
      placedOrderDetails={placedOrderDetails}
      isValidating={isValidating}
      handleApplyCoupon={handleApplyCoupon}
      handleRemoveCoupon={handleRemoveCoupon}
      handlePlaceOrder={handlePlaceOrder}
      user={user}
      onBack={handleBack}
      onContinueShopping={handleContinueShopping}
      onTrackOrder={handleTrackOrder}

      // Saved Address Props
      savedAddresses={addresses}
      selectedAddressId={selectedAddressId}
      setSelectedAddressId={setSelectedAddressId}
      isProcessing={isProcessing}
    />
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartScreen from './CartScreen';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '../../../service/cartApi';
import { useToast } from '../../../components/common/Toast';
import { useAppSelector } from '../../../app/hooks';
import type { CartItem } from '../../../types/Cart.type';
import {
  getGuestCart,
  updateGuestCartItem,
  removeGuestCartItem,
  calcGuestCartTotals,
  type GuestCartItem,
} from '../../../utils/guestCart';

export interface CartScreenProps {
  isLoading: boolean;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  isUpdating: boolean;
  handleQuantityChange: (itemId: number, currentQty: number, change: number) => Promise<void>;
  handleRemove: (itemId: number) => Promise<void>;
  onBack: () => void;
  onStartShopping: () => void;
  onCheckout: () => void;
  isGuest?: boolean;
}

export default function Cart() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // ── Guest cart state ──────────────────────────────────────────
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setGuestItems(getGuestCart());
    }
  }, [isAuthenticated]);

  // ── Authenticated (API) cart ──────────────────────────────────
  const { data: cartResponse, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const cartData = cartResponse?.data;
  const apiItems = cartData?.items || [];
  const apiSubtotal = cartData?.cartTotal || 0;
  const apiShipping = apiSubtotal > 100 || apiSubtotal === 0 ? 0 : 10;
  const apiTotal = apiSubtotal + apiShipping;

  // ── Guest totals ──────────────────────────────────────────────
  const { subtotal: guestSubtotal, shipping: guestShipping, total: guestTotal } = calcGuestCartTotals(guestItems);

  // ── Unified values based on auth state ───────────────────────
  const items: CartItem[] = isAuthenticated ? apiItems : (guestItems as unknown as CartItem[]);
  const subtotal = isAuthenticated ? apiSubtotal : guestSubtotal;
  const shipping = isAuthenticated ? apiShipping : guestShipping;
  const total = isAuthenticated ? apiTotal : guestTotal;

  // ── Handlers ─────────────────────────────────────────────────
  const handleQuantityChange = async (itemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;

    if (!isAuthenticated) {
      if (newQty < 1) {
        const updated = removeGuestCartItem(itemId);
        setGuestItems(updated);
        showToast('Item removed from cart!');
      } else {
        const updated = updateGuestCartItem(itemId, newQty);
        setGuestItems(updated);
        showToast('Quantity updated!');
      }
      return;
    }

    if (newQty < 1) {
      handleRemove(itemId);
      return;
    }
    try {
      await updateCartItem({ id: itemId, quantity: newQty }).unwrap();
      showToast('Quantity updated!');
    } catch (err) {
      showToast('Failed to update quantity.', 'error');
    }
  };

  const handleRemove = async (itemId: number) => {
    if (!isAuthenticated) {
      const updated = removeGuestCartItem(itemId);
      setGuestItems(updated);
      showToast('Item removed from cart!');
      return;
    }
    try {
      await removeCartItem(itemId).unwrap();
      showToast('Item removed from cart!');
    } catch (err) {
      showToast('Failed to remove item.', 'error');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartShopping = () => {
    navigate('/');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to proceed to checkout.' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <CartScreen
      isLoading={isAuthenticated ? isLoading : false}
      items={items}
      subtotal={subtotal}
      shipping={shipping}
      total={total}
      isUpdating={isAuthenticated ? isUpdating : false}
      handleQuantityChange={handleQuantityChange}
      handleRemove={handleRemove}
      onBack={handleBack}
      onStartShopping={handleStartShopping}
      onCheckout={handleCheckout}
      isGuest={!isAuthenticated}
    />
  );
}

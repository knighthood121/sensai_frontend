import type { CartItem } from '../types/Cart.type';

const GUEST_CART_KEY = 'sensai_guest_cart';

export interface GuestCartItem extends Omit<CartItem, 'id'> {
  id: number; // local negative ID to distinguish from server IDs
}

export function getGuestCart(): GuestCartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items: GuestCartItem[]): void {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function clearGuestCart(): void {
  localStorage.removeItem(GUEST_CART_KEY);
}

/** Add or increment an item in guest cart. Returns updated cart. */
export function addGuestCartItem(
  newItem: Omit<GuestCartItem, 'id'>
): GuestCartItem[] {
  const cart = getGuestCart();

  // Check if the same productId + variantId already exists
  const existing = cart.find(
    (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
  );

  let updated: GuestCartItem[];
  if (existing) {
    updated = cart.map((i) =>
      i.productId === newItem.productId && i.variantId === newItem.variantId
        ? {
            ...i,
            quantity: i.quantity + newItem.quantity,
            itemTotal: (i.quantity + newItem.quantity) * i.sellingPrice,
          }
        : i
    );
  } else {
    const tempId = -(Date.now()); // negative to avoid collision with real IDs
    updated = [
      ...cart,
      {
        ...newItem,
        id: tempId,
        itemTotal: newItem.quantity * newItem.sellingPrice,
      },
    ];
  }

  saveGuestCart(updated);
  return updated;
}

/** Update quantity for a guest cart item by its local id. Returns updated cart. */
export function updateGuestCartItem(id: number, quantity: number): GuestCartItem[] {
  const cart = getGuestCart();
  const updated = cart.map((i) =>
    i.id === id
      ? { ...i, quantity, itemTotal: quantity * i.sellingPrice }
      : i
  );
  saveGuestCart(updated);
  return updated;
}

/** Remove an item from guest cart by its local id. Returns updated cart. */
export function removeGuestCartItem(id: number): GuestCartItem[] {
  const cart = getGuestCart().filter((i) => i.id !== id);
  saveGuestCart(cart);
  return cart;
}

/** Calculate totals from guest cart. */
export function calcGuestCartTotals(items: GuestCartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

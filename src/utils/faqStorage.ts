import { useState, useEffect, useCallback } from 'react';

export interface FaqItem {
  id: string;
  category: string;
  categoryLabel: string;
  question: string;
  answer: string;
  isActive?: boolean;
  updatedAt?: string;
}

export interface FaqCategoryDef {
  id: string;
  label: string;
}

export const DEFAULT_FAQ_CATEGORIES: FaqCategoryDef[] = [
  { id: 'order-process', label: 'Order Process' },
  { id: 'payment-methods', label: 'Payment Methods' },
  { id: 'shipping-delivery', label: 'Shipping & Delivery' },
  { id: 'returns-refunds', label: 'Returns & Refunds' },
  { id: 'gst-invoice', label: 'GST Invoice Queries' },
  { id: 'warranty-info', label: 'Warranty Information' },
];

export const INITIAL_FAQS: FaqItem[] = [
  // ─── 1. ORDER PROCESS ──────────────────────────────────────────────────
  {
    id: 'order-1',
    category: 'order-process',
    categoryLabel: 'Order Process',
    question: 'How do I place an order on Sansai?',
    answer: `Ordering from Sansai is fast and straightforward:

1. Explore our catalog of precision drill bits and cutting tools by category or search.
2. Select your tool variant (diameter, shank type, coating, and quantity) and click 'Add to Cart' or 'Buy Now'.
3. Proceed to checkout, enter or select your delivery address, choose your payment mode, and click 'Place Order'.

You will immediately receive an on-screen confirmation, along with an order confirmation email and SMS containing your order tracking ID.`,
    isActive: true,
  },
  {
    id: 'order-2',
    category: 'order-process',
    categoryLabel: 'Order Process',
    question: 'Can I modify or cancel my order after placing it?',
    answer: `Yes! You can cancel your order directly from your Orders Dashboard as long as its status is 'Pending' or 'Confirmed'.

Once an order has been marked as 'Packed' or 'Shipped', it cannot be cancelled directly because it has already been handed over to logistics. In that case, you can simply initiate a return upon delivery.`,
    isActive: true,
  },
  {
    id: 'order-3',
    category: 'order-process',
    categoryLabel: 'Order Process',
    question: 'How can I track the live status of my order?',
    answer: `Sansai provides real-time 5-stage shipment tracking for every order:

1. Order Confirmed ➔ 2. Processing ➔ 3. Shipped ➔ 4. Out for Delivery ➔ 5. Delivered

Go to 'Your Order ➔ Order History' in the top menu to view your visual progress timeline and courier tracking number.`,
    isActive: true,
  },
  {
    id: 'order-4',
    category: 'order-process',
    categoryLabel: 'Order Process',
    question: 'Do you accept bulk or custom tool cutting inquiries?',
    answer: `Yes, we specialize in bulk industrial supply and customized tooling solutions for CNC workshops, fabricators, and manufacturing plants across India.

Visit our 'Bulk / Custom Inquiry' page to upload technical drawings, CAD specifications, and bulk quantities. Our engineering sales desk responds within 24 business hours with discounted wholesale pricing.`,
    isActive: true,
  },

  // ─── 2. PAYMENT METHODS ────────────────────────────────────────────────
  {
    id: 'payment-1',
    category: 'payment-methods',
    categoryLabel: 'Payment Methods',
    question: 'What payment options are accepted on Sansai?',
    answer: `We provide a wide range of convenient and secure payment methods:

• UPI & QR: Google Pay, PhonePe, Paytm, BHIM, and all UPI apps.
• Credit & Debit Cards: Visa, MasterCard, RuPay, Maestro, and American Express.
• Net Banking: Direct bank transfer from 50+ major public and private banks.
• Cash on Delivery (COD): Available for eligible pincodes across India.`,
    isActive: true,
  },
  {
    id: 'payment-2',
    category: 'payment-methods',
    categoryLabel: 'Payment Methods',
    question: 'Is Cash on Delivery (COD) available for my location?',
    answer: `Cash on Delivery is available for over 22,000+ serviceable pin codes across India for retail tool orders up to ₹10,000.

When entering your delivery pin code during checkout, the COD option will automatically be enabled if your area is serviceable by our courier partners.`,
    isActive: true,
  },
  {
    id: 'payment-3',
    category: 'payment-methods',
    categoryLabel: 'Payment Methods',
    question: 'Are my online transactions safe and encrypted?',
    answer: `Absolutely. All digital payments are handled through RBI-licensed, PCI-DSS Level 1 compliant payment gateways with 256-bit SSL encryption.

Sansai never stores your card CVV, ATM pins, or net banking passwords. Every transaction is authenticated via 3D Secure OTP directly with your issuing bank.`,
    isActive: true,
  },
  {
    id: 'payment-4',
    category: 'payment-methods',
    categoryLabel: 'Payment Methods',
    question: 'What happens if money was deducted from my account but the order failed?',
    answer: `If your bank account was debited but the order shows failed or unconfirmed due to a temporary network drop, please don't worry:

Your bank automatically initiates a reversal within 24 to 48 business hours. If the amount is not refunded after 2 business days, please file a support ticket from your dashboard with the bank reference (UTR) number, and our billing desk will trace the transaction immediately.`,
    isActive: true,
  },

  // ─── 3. SHIPPING & DELIVERY ───────────────────────────────────────────
  {
    id: 'shipping-1',
    category: 'shipping-delivery',
    categoryLabel: 'Shipping & Delivery',
    question: 'What are your delivery charges and shipping timelines?',
    answer: `Delivery Timelines:
• Metro cities & major hubs: 2 – 4 business days.
• Rest of India & industrial zones (MIDC, GIDC, etc.): 4 – 6 business days.

Shipping Charges:
We offer FREE Standard Shipping on orders above ₹499. For orders below ₹499, a nominal flat shipping fee of ₹40–₹60 is applied at checkout.`,
    isActive: true,
  },
  {
    id: 'shipping-2',
    category: 'shipping-delivery',
    categoryLabel: 'Shipping & Delivery',
    question: 'Which courier partners do you use for delivery?',
    answer: `To ensure safe transport of sharp cutting tools and heavy drill bits, we partner exclusively with verified tier-1 logistics networks: Blue Dart, Delhivery, DTDC, Xpressbees, and India Post Speed Post.

All parcels are dispatched in tamper-evident, heavy-duty protective packaging to prevent damage during transit.`,
    isActive: true,
  },
  {
    id: 'shipping-3',
    category: 'shipping-delivery',
    categoryLabel: 'Shipping & Delivery',
    question: 'Do you ship to remote industrial estates and factory workshops?',
    answer: `Yes! We deliver across 26,000+ pin codes in India, including manufacturing clusters, MIDC zones, and SEZs.

When entering your shipping address, please include your factory/shed number, landmark, and a working mobile phone number so the courier delivery executive can reach you without delay.`,
    isActive: true,
  },
  {
    id: 'shipping-4',
    category: 'shipping-delivery',
    categoryLabel: 'Shipping & Delivery',
    question: 'What happens if I am unavailable when the courier arrives?',
    answer: `Our courier partners attempt delivery up to 3 times on consecutive business days. You will receive an SMS and WhatsApp alert with the delivery agent's contact number prior to arrival.

You can also coordinate directly with the delivery agent or contact our support team to reschedule delivery for a preferred date.`,
    isActive: true,
  },

  // ─── 4. RETURNS & REFUNDS ─────────────────────────────────────────────
  {
    id: 'returns-1',
    category: 'returns-refunds',
    categoryLabel: 'Returns & Refunds',
    question: "What is Sansai's return and replacement policy?",
    answer: `We provide a transparent 7-Day Return & Replacement Policy from the date of delivery.

If an item arrives damaged, defective, functionally impaired, or does not match the ordered specifications (size, diameter, shank type), you are eligible for an immediate free replacement or full refund.`,
    isActive: true,
  },
  {
    id: 'returns-2',
    category: 'returns-refunds',
    categoryLabel: 'Returns & Refunds',
    question: 'How do I raise a return or replacement request?',
    answer: `To raise a return or replacement request:

1. Sign in and navigate to 'My Orders'.
2. Find the delivered order and click the 'Return or replace items' or 'Problem with Order' button.
3. Select your reason, describe the issue, and attach a photo if the product arrived damaged or incorrect.
4. Our team reviews the request within 24 hours and arranges a free reverse pickup at your doorstep.`,
    isActive: true,
  },
  {
    id: 'returns-3',
    category: 'returns-refunds',
    categoryLabel: 'Returns & Refunds',
    question: 'When and how will I receive my refund?',
    answer: `Once the returned product arrives at our fulfillment facility and passes quality inspection, refunds are initiated within 24 to 48 hours:

• Prepaid Orders (UPI/Cards): Credited back to your original payment source in 3 to 5 business days.
• COD Orders: Refunded directly to your bank account via NEFT/IMPS after you submit your account number & IFSC code.`,
    isActive: true,
  },
  {
    id: 'returns-4',
    category: 'returns-refunds',
    categoryLabel: 'Returns & Refunds',
    question: 'What if I ordered the wrong size by mistake? Can I exchange it?',
    answer: `Yes! As long as the cutting tool has not been chucked into a drill/machine or used, you can request an exchange for the correct size within 7 days of delivery.

Simply click 'Problem with Order' on your order card and choose 'Exchange for different size'.`,
    isActive: true,
  },

  // ─── 5. GST INVOICE QUERIES ───────────────────────────────────────────
  {
    id: 'gst-1',
    category: 'gst-invoice',
    categoryLabel: 'GST Invoice Queries',
    question: 'Can I claim GST input tax credit (B2B) for my business purchases?',
    answer: `Yes, 100%! Sansai issues legitimate, GST-compliant tax invoices with proper HSN codes (e.g., 8207 for drill bits & cutting tools) and itemized CGST/SGST/IGST breakdown.

Registered businesses, proprietorships, and enterprises can claim full input tax credit (ITC) on all orders.`,
    isActive: true,
  },
  {
    id: 'gst-2',
    category: 'gst-invoice',
    categoryLabel: 'GST Invoice Queries',
    question: 'How do I add my company name and GSTIN during checkout?',
    answer: `You can provide your business details in your profile or directly at checkout:

1. During checkout, in the Shipping / Billing Address section, specify your registered company name.
2. Add your 15-digit GSTIN number in the company or customer notes field, or save it permanently in your account settings.

Your GSTIN will be printed on both the physical packing slip and digital invoice.`,
    isActive: true,
  },
  {
    id: 'gst-3',
    category: 'gst-invoice',
    categoryLabel: 'GST Invoice Queries',
    question: 'How do I download or print my official GST tax invoice?',
    answer: `Downloading your invoice is instant and available anytime:

1. Go to 'Your Orders'.
2. Locate your order card and find the 'Invoice' dropdown on the right side of the order header.
3. Click 'Print Invoice' to instantly view, save as PDF, or print your official tax invoice.`,
    isActive: true,
  },
  {
    id: 'gst-4',
    category: 'gst-invoice',
    categoryLabel: 'GST Invoice Queries',
    question: 'Can I update my GSTIN after the order has already been delivered?',
    answer: `As per GST regulations, tax invoices cannot be modified once GSTR-1 filings are finalized at the end of the tax period.

However, if your order was placed within the current calendar month, please contact our accounts desk via a support ticket within 48 hours of purchase, and we will issue an amended invoice or credit note reissue if eligible.`,
    isActive: true,
  },

  // ─── 6. WARRANTY INFORMATION ──────────────────────────────────────────
  {
    id: 'warranty-1',
    category: 'warranty-info',
    categoryLabel: 'Warranty Information',
    question: 'Do Sansai tools and drill bits come with a warranty?',
    answer: `Yes! All Sansai precision cutting tools, drill bits, and hole saws come with a Manufacturer's Guarantee against metallurgical and manufacturing defects.

Each batch is precision-ground and hardness-tested to meet rigorous industrial tolerance standards (HRC hardness testing and concentricity checks).`,
    isActive: true,
  },
  {
    id: 'warranty-2',
    category: 'warranty-info',
    categoryLabel: 'Warranty Information',
    question: 'What is covered under warranty versus normal wear and tear?',
    answer: `Covered under warranty:
• Flaws in steel metallurgy or heat-treatment
• Premature carbide brazing detachment
• Shank run-out or out-of-tolerance straightness
• Defective out-of-box cutting edges

Not covered (Normal wear & tear):
• Natural cutting edge dulling from extended use
• Thermal burn caused by dry drilling without coolant
• Chipping due to incorrect RPM or excessive feed
• Using non-masonry bits on reinforced rebar concrete`,
    isActive: true,
  },
  {
    id: 'warranty-3',
    category: 'warranty-info',
    categoryLabel: 'Warranty Information',
    question: 'How do I submit a warranty claim?',
    answer: `To file a warranty inspection claim:

1. Go to 'My Orders' and click 'Problem with Order'.
2. Select 'Warranty Claim' as the subject.
3. Provide details of the workpiece material, machine speed (RPM), and coolant used, along with 2 clear photos of the tool flutes and shank.
4. Our technical engineering desk will review the claim and issue an approved replacement tool.`,
    isActive: true,
  },
  {
    id: 'warranty-4',
    category: 'warranty-info',
    categoryLabel: 'Warranty Information',
    question: 'How can I maximize tool life and cutting performance?',
    answer: `To get the highest longevity and cleanest cuts from your Sansai tooling:

• Match tool material to workpiece: Use HSS-Co (Cobalt) for stainless steel and tough alloys; use carbide-tipped bits for masonry and stone.
• Use cutting fluid / coolant: Continuous lubrication prevents heat buildup, preventing flutes from softening.
• Maintain recommended RPM: Larger diameter bits require lower spindle speeds to avoid centrifugal heat damage.
• Avoid wobbling: Ensure your drill chuck or collet has zero run-out and the workpiece is clamped securely.`,
    isActive: true,
  },
];

const STORAGE_KEY = 'sensai_faqs_data';
const EVENT_NAME = 'sensai_faqs_updated';

// Helper to broadcast changes to all listeners
function notifyUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function getStoredFaqs(): FaqItem[] {
  if (typeof window === 'undefined') return INITIAL_FAQS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAQS));
      return INITIAL_FAQS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAQS));
      return INITIAL_FAQS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load FAQs from storage:', err);
    return INITIAL_FAQS;
  }
}

export function saveStoredFaqs(faqs: FaqItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
    notifyUpdate();
  } catch (err) {
    console.error('Failed to save FAQs to storage:', err);
  }
}

export function addFaq(newFaq: Omit<FaqItem, 'id'>): FaqItem {
  const faqs = getStoredFaqs();
  const created: FaqItem = {
    ...newFaq,
    id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    isActive: newFaq.isActive !== false,
    updatedAt: new Date().toISOString(),
  };
  const updated = [created, ...faqs];
  saveStoredFaqs(updated);
  return created;
}

export function updateFaq(id: string, updates: Partial<FaqItem>): FaqItem | null {
  const faqs = getStoredFaqs();
  const index = faqs.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updatedItem: FaqItem = {
    ...faqs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  faqs[index] = updatedItem;
  saveStoredFaqs(faqs);
  return updatedItem;
}

export function deleteFaq(id: string): boolean {
  const faqs = getStoredFaqs();
  const filtered = faqs.filter((item) => item.id !== id);
  if (filtered.length === faqs.length) return false;
  saveStoredFaqs(filtered);
  return true;
}

export function resetToDefaultFaqs(): FaqItem[] {
  saveStoredFaqs(INITIAL_FAQS);
  return INITIAL_FAQS;
}

/**
 * React hook to interactively subscribe to FAQ state
 */
export function useFaqs() {
  const [faqs, setFaqs] = useState<FaqItem[]>(() => getStoredFaqs());

  const reload = useCallback(() => {
    setFaqs(getStoredFaqs());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => reload();
    window.addEventListener(EVENT_NAME, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(EVENT_NAME, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [reload]);

  const handleAdd = useCallback((faq: Omit<FaqItem, 'id'>) => {
    const res = addFaq(faq);
    setFaqs(getStoredFaqs());
    return res;
  }, []);

  const handleUpdate = useCallback((id: string, updates: Partial<FaqItem>) => {
    const res = updateFaq(id, updates);
    setFaqs(getStoredFaqs());
    return res;
  }, []);

  const handleDelete = useCallback((id: string) => {
    const res = deleteFaq(id);
    setFaqs(getStoredFaqs());
    return res;
  }, []);

  const handleReset = useCallback(() => {
    const res = resetToDefaultFaqs();
    setFaqs(res);
    return res;
  }, []);

  const handleToggleActive = useCallback((id: string) => {
    const target = faqs.find((f) => f.id === id);
    if (!target) return;
    updateFaq(id, { isActive: target.isActive === false ? true : false });
    setFaqs(getStoredFaqs());
  }, [faqs]);

  return {
    faqs,
    addFaq: handleAdd,
    updateFaq: handleUpdate,
    deleteFaq: handleDelete,
    resetFaqs: handleReset,
    toggleActive: handleToggleActive,
    reload,
  };
}

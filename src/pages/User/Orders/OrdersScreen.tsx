import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../../../constant/style';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/common/Button';
import TaxInvoice from '../../../components/common/TaxInvoice';
import { useAppSelector } from '../../../app/hooks';
import { useToast } from '../../../components/common/Toast';
import {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from '../../../service/orderApi';
import { useAddToCartMutation } from '../../../service/cartApi';
import { useCreateTicketMutation } from '../../../service/ticketApi';
import {
  Check,
  Clock,
  MapPin,
  Truck,
  X,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  XCircle,
  Copy,
  Tag,
  Loader2,
  FileText,
  Search,
  ShoppingBag
} from 'lucide-react';
import type { OrderStatus } from '../../../types/order.type';

type DateFilterType = '3months' | '2026' | '2025' | 'older';

export default function OrdersScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // RTK Mutations
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [createTicket, { isLoading: isCreatingTicket }] = useCreateTicketMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Tab & Filters State
  const [activeTab, setActiveTab] = useState<'orders' | 'buyAgain' | 'notShipped'>('orders');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('3months');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);

  // Active Dropdowns state
  const [openInvoiceDropdownId, setOpenInvoiceDropdownId] = useState<number | null>(null);
  const [openShipToDropdownId, setOpenShipToDropdownId] = useState<number | null>(null);

  // Details Modal State
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Ticket Modal State
  const [ticketOrderId, setTicketOrderId] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  // Cancel Order Modal State
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Print Invoice target
  const [printingOrder, setPrintingOrder] = useState<any | null>(null);

  // Fetch Orders
  const {
    data: ordersData,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
  } = useGetOrdersQuery(
    { page, limit: 10 },
    { skip: !isAuthenticated }
  );

  // Fetch selected order details
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetOrderByIdQuery(
    selectedOrderId as number,
    { skip: !selectedOrderId }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to view your orders.' } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const allOrders = ordersData?.data || [];
  const pagination = ordersData?.pagination;

  // ─── Filter Logic ────────────────────────────────────────────────────────
  const filterOrdersByDate = (ordersList: any[]) => {
    const now = new Date();
    return ordersList.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (dateFilter === '3months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return orderDate >= threeMonthsAgo;
      }
      if (dateFilter === '2026') {
        return orderDate.getFullYear() === 2026;
      }
      if (dateFilter === '2025') {
        return orderDate.getFullYear() === 2025;
      }
      return orderDate.getFullYear() < 2025;
    });
  };

  const filterOrdersBySearch = (ordersList: any[]) => {
    if (!activeSearch.trim()) return ordersList;
    const query = activeSearch.toLowerCase().trim();
    return ordersList.filter((order) => {
      const matchesOrderNo = order.orderNumber.toLowerCase().includes(query);
      const matchesProduct = order.items.some((item: any) =>
        item.productName.toLowerCase().includes(query)
      );
      return matchesOrderNo || matchesProduct;
    });
  };

  // Compute filtered list based on tab
  let displayedOrders = [...allOrders];

  if (activeTab === 'notShipped') {
    displayedOrders = displayedOrders.filter((order) =>
      ['PENDING', 'CONFIRMED', 'PACKED'].includes(order.status)
    );
  }

  displayedOrders = filterOrdersByDate(displayedOrders);
  displayedOrders = filterOrdersBySearch(displayedOrders);

  // Get unique products for "Buy Again"
  const getUniquePurchasedItems = () => {
    const itemsMap = new Map<number, any>();
    allOrders.forEach((order) => {
      order.items.forEach((item: any) => {
        if (!itemsMap.has(item.productId)) {
          itemsMap.set(item.productId, {
            ...item,
            orderDate: order.createdAt,
          });
        }
      });
    });
    return Array.from(itemsMap.values());
  };

  const buyAgainItems = getUniquePurchasedItems().filter((item) => {
    if (!activeSearch.trim()) return true;
    return item.productName.toLowerCase().includes(activeSearch.toLowerCase().trim());
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleBuyAgain = async (productId: number, variantId: number) => {
    try {
      await addToCart({ productId, variantId, quantity: 1 }).unwrap();
      showToast('Item added to your shopping cart!', 'success');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to add item to cart.', 'error');
    }
  };

  const handleOpenTicket = (order: any) => {
    setTicketOrderId(order.id);
    setTicketSubject(`Problem with Order #${order.orderNumber}`);
    setTicketMessage(`Order Number: ${order.orderNumber}\n\nPlease describe the issue you are facing with this order (e.g. delivery issue, item missing, defective item): `);
    setTicketPriority('NORMAL');
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Please provide a subject and a message.', 'error');
      return;
    }
    try {
      await createTicket({
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
        priority: ticketPriority,
      }).unwrap();
      showToast('Support ticket raised successfully. Admin will review it shortly.', 'success');
      setTicketOrderId(null);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to raise support ticket.', 'error');
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrderId) return;
    if (!cancelReason.trim()) {
      showToast('Please provide a reason for cancellation.', 'error');
      return;
    }
    try {
      await cancelOrder({
        id: cancellingOrderId,
        data: { reason: cancelReason },
      }).unwrap();
      showToast('Order cancelled successfully', 'success');
      setCancellingOrderId(null);
      setCancelReason('');
      if (selectedOrderId === cancellingOrderId) {
        setSelectedOrderId(null);
      }
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to cancel order.', 'error');
    }
  };

  const handlePrintInvoice = (order: any) => {
    setPrintingOrder(order);
    setOpenInvoiceDropdownId(null);
  };

  // ─── Format & Styles ──────────────────────────────────────────────────────

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return { text: 'Delivered', desc: 'Package was delivered successfully', color: 'text-emerald-600' };
      case 'CANCELLED':
        return { text: 'Cancelled', desc: 'This order has been cancelled', color: 'text-rose-600' };
      case 'RETURNED':
        return { text: 'Returned', desc: 'Items have been returned successfully', color: 'text-rose-600' };
      case 'RETURN_REQUESTED':
        return { text: 'Return Requested', desc: 'Return request is currently under review', color: 'text-purple-600' };
      case 'SHIPPED':
        return { text: 'Shipped', desc: 'In Transit / Package is on its way', color: 'text-blue-600' };
      case 'OUT_FOR_DELIVERY':
        return { text: 'Out for delivery', desc: 'Package is out with delivery partner', color: 'text-amber-600' };
      case 'PACKED':
        return { text: 'Packed', desc: 'Order packed and ready for dispatch', color: 'text-indigo-600' };
      case 'CONFIRMED':
        return { text: 'Order Confirmed', desc: "We've received your order and are preparing it for shipment", color: 'text-emerald-600' };
      case 'PENDING':
        return { text: 'Order Confirmed', desc: "We've received your order and are preparing it for shipment", color: 'text-emerald-600' };
      default:
        return { text: 'Processing', desc: 'We are processing your order', color: 'text-gray-500' };
    }
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED':
      case 'RETURNED':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'PENDING':
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PACKED':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'RETURN_REQUESTED':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getOrderTrackingInfo = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return {
          progressWidth: '25%',
          statusText: 'Order Confirmed',
          statusDesc: "We've received your order and are preparing it for shipment.",
          badgeStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          steps: [
            { label: 'Order Confirmed', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Processing', desc: 'Active', isCompleted: false, isActive: true },
            { label: 'Shipped', desc: 'Upcoming', isCompleted: false, isActive: false },
            { label: 'Out for Delivery', desc: 'Upcoming', isCompleted: false, isActive: false },
            { label: 'Delivered', desc: 'Upcoming', isCompleted: false, isActive: false },
          ],
        };
      case 'PACKED':
        return {
          progressWidth: '40%',
          statusText: 'Processing & Packed',
          statusDesc: 'Your order has been packed and is awaiting courier pickup.',
          badgeStyle: 'bg-teal-50 text-teal-600 border-teal-100',
          steps: [
            { label: 'Order Confirmed', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Processing', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Shipped', desc: 'Awaiting Pickup', isCompleted: false, isActive: true },
            { label: 'Out for Delivery', desc: 'Upcoming', isCompleted: false, isActive: false },
            { label: 'Delivered', desc: 'Upcoming', isCompleted: false, isActive: false },
          ],
        };
      case 'SHIPPED':
        return {
          progressWidth: '55%',
          statusText: 'Shipped',
          statusDesc: 'Package has been dispatched and is on its way.',
          badgeStyle: 'bg-blue-50 text-blue-600 border-blue-100',
          steps: [
            { label: 'Order Confirmed', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Processing', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Shipped', desc: 'Active', isCompleted: false, isActive: true },
            { label: 'Out for Delivery', desc: 'Upcoming', isCompleted: false, isActive: false },
            { label: 'Delivered', desc: 'Upcoming', isCompleted: false, isActive: false },
          ],
        };
      case 'OUT_FOR_DELIVERY':
        return {
          progressWidth: '75%',
          statusText: 'Out for Delivery',
          statusDesc: 'Package is out for delivery with our courier partner.',
          badgeStyle: 'bg-amber-50 text-amber-600 border-amber-100',
          steps: [
            { label: 'Order Confirmed', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Processing', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Shipped', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Out for Delivery', desc: 'Active', isCompleted: false, isActive: true },
            { label: 'Delivered', desc: 'Upcoming', isCompleted: false, isActive: false },
          ],
        };
      case 'DELIVERED':
        return {
          progressWidth: '100%',
          statusText: 'Delivered',
          statusDesc: 'Package was delivered successfully.',
          badgeStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          steps: [
            { label: 'Order Confirmed', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Processing', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Shipped', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Out for Delivery', desc: 'Completed', isCompleted: true, isActive: false },
            { label: 'Delivered', desc: 'Completed', isCompleted: true, isActive: false },
          ],
        };
      default:
        return null;
    }
  };

  const OrderTrackingStepper = ({ trackingInfo }: { trackingInfo: NonNullable<ReturnType<typeof getOrderTrackingInfo>> }) => {
    return (
      <div className="w-full max-w-3xl mx-auto px-2">
        <div className="relative flex items-center justify-between w-full">
          {/* Background Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full -z-10" />

          {/* Active Animated Progress Line */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: trackingInfo.progressWidth }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full -z-10"
          />

          {/* Timeline Steps */}
          {trackingInfo.steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 relative">
              {/* Circle indicator */}
              {step.isCompleted ? (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 border-4 border-emerald-100 flex items-center justify-center text-white shadow-md transition-all duration-300">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                </div>
              ) : step.isActive ? (
                <div className="relative">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-ping" />
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-4 border-teal-400 flex items-center justify-center shadow-md transition-all duration-300">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-teal-500" />
                  </div>
                </div>
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center text-gray-300 shadow-sm transition-all duration-300" />
              )}

              {/* Label */}
              <span
                className={`mt-3 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-center max-w-[70px] sm:max-w-[85px] md:max-w-[120px] transition-colors duration-300 ${
                  step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] relative overflow-hidden" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Decorative background blobs to match other screens */}
      <div className="absolute top-[-8%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-red-200/8 to-rose-200/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-red-100/10 to-stone-100/10 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-12 sm:py-16 relative z-10 print:hidden">
        {/* Breadcrumb Navigation & Title */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-red-600 transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600">My Orders</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: FONTS.heading }}>
            Your <span style={{ color: COLORS.primary }}>Orders</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-sm sm:text-base max-w-xl">
            Track your order status, view invoices and manage your complete purchase history.
          </p>
        </div>

        {/* Top search and tabs bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-gray-100 mb-8 pb-3 gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <button
              onClick={() => { setActiveTab('orders'); setPage(1); }}
              className={`pb-3.5 relative transition-all cursor-pointer ${activeTab === 'orders' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-red-600'
                }`}
            >
              Orders
              {activeTab === 'orders' && (
                <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: COLORS.primary }} />
              )}
            </button>
            <button
              onClick={() => { setActiveTab('buyAgain'); setPage(1); }}
              className={`pb-3.5 relative transition-all cursor-pointer ${activeTab === 'buyAgain' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-red-600'
                }`}
            >
              Buy Again
              {activeTab === 'buyAgain' && (
                <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: COLORS.primary }} />
              )}
            </button>
            <button
              onClick={() => { setActiveTab('notShipped'); setPage(1); }}
              className={`pb-3.5 relative transition-all cursor-pointer ${activeTab === 'notShipped' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-red-600'
                }`}
            >
              Not Yet Shipped
              {activeTab === 'notShipped' && (
                <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: COLORS.primary }} />
              )}
            </button>
          </div>

          {/* Search form */}
          <form
            onSubmit={(e) => { e.preventDefault(); setActiveSearch(searchQuery); }}
            className="flex items-center w-full xl:max-w-md"
          >
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search all orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-l-2xl border border-gray-200 text-sm focus:outline-none focus:border-red-600 bg-white"
              />
            </div>
            <button
              type="submit"
              className="text-white px-6 py-2.5 rounded-r-2xl text-xs font-bold transition-all cursor-pointer border hover:opacity-90 active:scale-95"
              style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
            >
              Search Orders
            </button>
          </form>
        </div>

        {/* Date Filter & Info bar */}
        {activeTab !== 'buyAgain' && (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
            <span>{displayedOrders.length} order{displayedOrders.length !== 1 ? 's' : ''} placed in</span>
            <div className="relative inline-block">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
                className="bg-white hover:bg-gray-50 transition-colors border border-gray-200 pl-3 pr-8 py-1 rounded-full text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer appearance-none text-gray-700"
              >
                <option value="3months">past 3 months</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="older">older orders</option>
              </select>
              <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        )}

        {/* Loading / Error States */}
        {isListLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-[32px] shadow-sm">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading orders...</p>
          </div>
        ) : isListError ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load orders</h3>
            <p className="text-red-700 text-sm mb-6">{(listError as any)?.data?.message || 'Failed to reach order API.'}</p>
            <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
          </div>
        ) : activeTab === 'buyAgain' ? (
          // ─── BUY AGAIN TAB ────────────────────────────────────────────────
          buyAgainItems.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-[32px] shadow-sm max-w-2xl mx-auto">
              <ShoppingBag size={40} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No items to buy again</h3>
              <p className="text-gray-400 text-sm">Products you purchase will appear here for easy reordering.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {buyAgainItems.map((item) => (
                <div key={item.id} className="border border-gray-100 bg-white rounded-[28px] p-5 flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-400">
                  <div>
                    <div className="aspect-[4/5] rounded-[22px] overflow-hidden mb-4 border border-gray-100 bg-gray-50 relative">
                      <img
                        src={item.productImage || '/images/product_white_tee.png'}
                        alt={item.productName}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      />
                    </div>
                    <div className="px-1 text-left space-y-1">
                      <h4
                        onClick={() => navigate(`/product/${item.productId}`)}
                        className="font-bold text-gray-900 line-clamp-2 hover:text-red-600 cursor-pointer hover:underline text-sm leading-snug"
                      >
                        {item.productName}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bought on {new Date(item.orderDate).toLocaleDateString()}</p>
                      <p className="text-base font-extrabold text-red-600 pt-1">₹{item.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-gray-50 flex gap-2">
                    <button
                      onClick={() => handleBuyAgain(item.productId, item.variantId)}
                      disabled={isAddingToCart}
                      className="flex-1 text-white font-bold py-2 rounded-full text-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      Buy again
                    </button>
                    <button
                      onClick={() => navigate(`/product/${item.productId}`)}
                      className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold py-2 rounded-full text-xs transition-all cursor-pointer active:scale-95"
                    >
                      View item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : displayedOrders.length === 0 ? (
          // ─── EMPTY ORDERS ────────────────────────────────────────────────
          <div className="text-center py-24 bg-white border border-gray-100 rounded-[32px] shadow-sm max-w-2xl mx-auto">
            <FileText size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No orders found</h3>
            <p className="text-gray-400 text-sm">Try adjusting search or filter options, or start shopping.</p>
            <Button onClick={() => navigate('/')} size="sm" className="mt-6 rounded-full px-8 uppercase tracking-wider text-[10px] font-bold">
              Start Shopping
            </Button>
          </div>
        ) : (
          // ─── ORDERS CARD LIST ────────────────────────────────────────────
          <div className="space-y-8">
            {displayedOrders.map((order) => {
              const statusDisplay = getOrderStatusDisplay(order.status);
              const trackingInfo = getOrderTrackingInfo(order.status);
              const shipName = order.address?.fullName || 'Customer';

              return (
                <div key={order.id} className="border border-gray-100/80 rounded-[28px] overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-400">
                  {/* Card Header Row */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-gray-50/40 border-b border-gray-100 px-6 sm:px-10 py-5 flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-gray-450">
                    <div className="flex gap-x-8 gap-y-3 flex-wrap items-center">
                      <div>
                        <p className="text-[9px] text-gray-400 mb-0.5">Order Placed</p>
                        <p className="text-gray-900 font-extrabold">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="hidden sm:block w-px h-6 bg-gray-200" />
                      <div>
                        <p className="text-[9px] text-gray-400 mb-0.5">Total</p>
                        <p className="text-red-600 font-black">₹{order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div className="hidden sm:block w-px h-6 bg-gray-200" />
                      <div className="relative">
                        <p className="text-[9px] text-gray-400 mb-0.5">Ship To</p>
                        <button
                          onClick={() => setOpenShipToDropdownId(openShipToDropdownId === order.id ? null : order.id)}
                          className="font-bold flex items-center gap-0.5 cursor-pointer hover:underline"
                          style={{ color: COLORS.primary }}
                        >
                          {shipName}
                          <ChevronDown size={12} />
                        </button>

                        {/* Ship to Address Popover */}
                        <AnimatePresence>
                          {openShipToDropdownId === order.id && order.address && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setOpenShipToDropdownId(null)} />
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 z-30 text-xs text-gray-700 text-left normal-case tracking-normal"
                              >
                                <div className="flex justify-between items-start mb-2 border-b pb-1.5">
                                  <span className="font-extrabold text-gray-900">Shipping Address</span>
                                  <button onClick={() => setOpenShipToDropdownId(null)} className="text-gray-400 hover:text-gray-900">&times;</button>
                                </div>
                                <p className="font-bold text-gray-900">{order.address.fullName}</p>
                                <p className="mt-1 text-gray-500">{order.address.addressLine1}</p>
                                {order.address.addressLine2 && <p className="text-gray-500">{order.address.addressLine2}</p>}
                                <p className="text-gray-500">{order.address.city}, {order.address.state} - {order.address.postalCode}</p>
                                <p className="mt-2 text-gray-400 font-bold">Phone: {order.address.phone}</p>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto sm:ml-0 text-left sm:text-right">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] text-gray-400">Order #</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(order.orderNumber);
                              showToast('Order ID copied!', 'success');
                            }}
                            className="text-[10px] text-gray-700 font-bold bg-white border border-gray-200 px-2 py-0.5 rounded-md hover:bg-gray-50 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Copy size={10} />
                            {order.orderNumber}
                          </button>
                        </div>
                        <div className="flex items-center gap-2.5 sm:justify-end">
                          <button
                            onClick={() => setSelectedOrderId(order.id)}
                            className="font-bold hover:underline cursor-pointer"
                            style={{ color: COLORS.primary }}
                          >
                            View details
                          </button>
                          <span className="text-gray-250">|</span>
                          <div className="relative">
                            <button
                              onClick={() => setOpenInvoiceDropdownId(openInvoiceDropdownId === order.id ? null : order.id)}
                              className="font-bold flex items-center gap-0.5 cursor-pointer hover:underline"
                              style={{ color: COLORS.primary }}
                            >
                              Invoice
                              <ChevronDown size={12} />
                            </button>

                            <AnimatePresence>
                              {openInvoiceDropdownId === order.id && (
                                <>
                                  <div className="fixed inset-0 z-20" onClick={() => setOpenInvoiceDropdownId(null)} />
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-2xl py-1.5 z-30 text-left normal-case tracking-normal"
                                  >
                                    <button
                                      onClick={() => handlePrintInvoice(order)}
                                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50/50 hover:text-red-600 transition-colors"
                                    >
                                      Print Invoice
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Stepper Layout (matching Image 1) */}
                  {trackingInfo ? (
                    <div className="border-b border-gray-100/80 px-6 sm:px-10 py-6 sm:py-8 bg-gradient-to-b from-gray-50/40 via-white to-white">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trackingInfo.badgeStyle}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {trackingInfo.statusText}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {trackingInfo.statusDesc}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {order.estimatedDelivery && (
                            <span className="text-xs text-gray-500 font-semibold">
                              Arriving by <strong className="text-gray-900">{formatDate(order.estimatedDelivery)}</strong>
                            </span>
                          )}
                          {order.shippingTrackingId && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200/80 px-3 py-1 rounded-full">
                              <Truck size={12} className="text-gray-400" />
                              <span>Tracking: <strong className="text-gray-900">{order.shippingTrackingId}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>

                      <OrderTrackingStepper trackingInfo={trackingInfo} />
                    </div>
                  ) : (
                    <div className={`border-b border-gray-100/80 px-6 sm:px-10 py-5 ${
                      order.status === 'CANCELLED' ? 'bg-rose-50/30' : 'bg-purple-50/30'
                    } flex flex-wrap items-center justify-between gap-4`}>
                      <div className="flex items-center gap-3">
                        {order.status === 'CANCELLED' ? (
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                            <XCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-0.5 ${getStatusBadgeStyle(order.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusDisplay.text}
                          </span>
                          <p className="text-xs text-gray-500 font-medium">{statusDisplay.desc}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 sm:p-10 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
                    {/* Left side: Items */}
                    <div className="flex-1 space-y-6">
                      {/* Items */}
                      <div className="divide-y divide-gray-50">
                        {order.items.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="flex gap-5 py-4 first:pt-0 last:pb-0 group">
                            <div className="w-[72px] h-[88px] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm group-hover:shadow-md group-hover:border-gray-250 transition-all duration-300">
                              <img
                                src={item.productImage || '/images/product_white_tee.png'}
                                alt={item.productName}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => navigate(`/product/${item.productId}`)}
                              />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <h4
                                onClick={() => navigate(`/product/${item.productId}`)}
                                className="font-extrabold text-gray-900 hover:text-red-600 cursor-pointer hover:underline text-sm sm:text-base leading-snug line-clamp-1"
                              >
                                {item.productName}
                              </h4>
                              {item.size && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] text-gray-500 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    Size: {item.size}
                                  </span>
                                  {item.color && (
                                    <span className="text-[9px] text-gray-500 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                      {item.color}
                                    </span>
                                  )}
                                  <span className="text-[9px] text-red-600 font-black bg-red-50/50 border border-red-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                              )}
                              <p className="text-[11px] text-gray-400 font-semibold pt-0.5">₹{item.unitPrice.toFixed(2)} per unit</p>

                              {/* Item actions */}
                              <div className="flex items-center gap-2 mt-3 flex-wrap">
                                <button
                                  onClick={() => handleBuyAgain(item.productId, item.variantId)}
                                  disabled={isAddingToCart}
                                  className="text-white px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer hover:opacity-90 active:scale-95"
                                  style={{ backgroundColor: COLORS.primary }}
                                >
                                  Buy it again
                                </button>
                                <button
                                  onClick={() => navigate(`/product/${item.productId}`)}
                                  className="bg-white hover:bg-gray-50 border border-gray-250 hover:border-gray-300 px-4 py-1.5 rounded-full text-[10px] text-gray-700 font-semibold transition-all cursor-pointer active:scale-95"
                                >
                                  View item
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right side: Action Button Stack */}
                    <div className="w-full lg:w-56 shrink-0 flex flex-col gap-2 pt-2">
                      {order.shippingTrackingId && (
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 font-bold py-2.5 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                        >
                          Track package
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenTicket(order)}
                        className="w-full text-white font-bold py-2.5 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        Problem with Order
                      </button>

                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() => handleOpenTicket({ ...order, subject: `Return/Replacement Request for Order #${order.orderNumber}` })}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-705 hover:border-red-300 hover:text-red-600 font-bold py-2.5 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                        >
                          Return or replace items
                        </button>
                      )}

                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() => navigate(`/product/${order.items[0]?.productId}`)}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-705 hover:border-red-300 hover:text-red-600 font-bold py-2.5 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                        >
                          Write product review
                        </button>
                      )}

                      {['PENDING', 'CONFIRMED'].includes(order.status) && (
                        <button
                          onClick={() => setCancellingOrderId(order.id)}
                          className="w-full bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-650 font-bold py-2.5 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                        >
                          Cancel order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!pagination.hasPreviousPage}
                  className="px-5 py-2 border border-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${p === page ? 'text-white' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      style={p === page ? { backgroundColor: COLORS.primary } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={!pagination.hasNextPage}
                  className="px-5 py-2 border border-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* ─── support ticket modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {ticketOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTicketOrderId(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[28px] w-full max-w-lg p-8 shadow-[0_32px_80px_rgba(0,0,0,0.12)] z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{ fontFamily: FONTS.heading, color: COLORS.text }}>Raise Support Ticket</h3>
                <button onClick={() => setTicketOrderId(null)} className="text-2xl leading-none opacity-50 hover:opacity-100">&times;</button>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e: any) => setTicketPriority(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 bg-white appearance-none cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Describe your Problem</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:outline-none focus:border-red-600 bg-white resize-none"
                  />
                </div>

                <div className="flex gap-4 justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={() => setTicketOrderId(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" disabled={isCreatingTicket}>
                    {isCreatingTicket ? 'Submitting...' : 'Submit Ticket'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Cancel Order reason modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {cancellingOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isCancelling) setCancellingOrderId(null); }}
              className="absolute inset-0 bg-black/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[28px] w-full max-w-md p-8 shadow-[0_32px_80px_rgba(0,0,0,0.12)] z-10 border border-gray-100"
            >
              <div className="text-center mb-6">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold" style={{ fontFamily: FONTS.heading }}>Cancel Your Order?</h3>
                <p className="text-xs text-gray-500 mt-1">This action is permanent and cannot be undone.</p>
              </div>

              <form onSubmit={handleCancelSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reason" className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                    Reason for Cancellation
                  </label>
                  <textarea
                    id="reason"
                    required
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Bought by mistake, Found a better deal..."
                    className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:outline-none focus:border-red-600 bg-white resize-none"
                    disabled={isCancelling}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCancellingOrderId(null)}
                    className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-full text-xs font-bold text-gray-605 cursor-pointer active:scale-95 transition-all"
                    disabled={isCancelling}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-red-600 hover:bg-red-750 text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Detail modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[28px] w-full max-w-4xl max-h-[85vh] shadow-[0_32px_80px_rgba(0,0,0,0.12)] z-10 flex flex-col overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-8 py-5 flex items-center justify-between z-20">
                <div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: FONTS.heading }}>Order Details</h3>
                  {detailData?.data && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>Order Number: <strong>{detailData.data.orderNumber}</strong></span>
                      <span>·</span>
                      <span>{formatDate(detailData.data.createdAt)}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => setSelectedOrderId(null)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                {isDetailLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
                    <p className="text-xs text-gray-400">Loading details...</p>
                  </div>
                ) : isDetailError || !detailData?.data ? (
                  <div className="text-center py-10 text-gray-500 text-sm">Failed to load order details.</div>
                ) : (
                  (() => {
                    const order = detailData.data;
                    const modalTracking = getOrderTrackingInfo(order.status);
                    return (
                      <div className="space-y-6">
                        {modalTracking && (
                          <div className="bg-gray-50/70 border border-gray-150 rounded-2xl p-6 sm:p-8">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                              <div className="flex items-center gap-2.5">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${modalTracking.badgeStyle}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {modalTracking.statusText}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">
                                  {modalTracking.statusDesc}
                                </span>
                              </div>
                            </div>
                            <OrderTrackingStepper trackingInfo={modalTracking} />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left column */}
                        <div className="md:col-span-7 space-y-4">
                          {/* Shipping address */}
                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                              <MapPin size={14} className="text-red-600" /> Shipping Address
                            </h4>
                            <p className="font-bold text-gray-900 text-sm">{order.address?.fullName || 'No Address'}</p>
                            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                              {order.address?.addressLine1}
                              {order.address?.addressLine2 ? `, ${order.address?.addressLine2}` : ''}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">{order.address?.city}, {order.address?.state} - {order.address?.postalCode}</p>
                            <p className="text-xs text-gray-500 mt-2 font-bold">Phone: {order.address?.phone || '—'}</p>
                          </div>

                          {/* Shipment info */}
                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                              <Truck size={14} className="text-red-600" /> Shipment Information
                            </h4>
                            <div className="text-xs space-y-2.5">
                              <div className="flex justify-between border-b pb-1.5">
                                <span className="text-gray-400 font-semibold">Tracking ID</span>
                                <span className="font-bold">{order.shippingTrackingId || 'Not assigned yet'}</span>
                              </div>
                              <div className="flex justify-between border-b pb-1.5">
                                <span className="text-gray-400 font-semibold">Estimated Delivery</span>
                                <span className="font-bold">{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Pending shipment'}</span>
                              </div>
                              {order.deliveredAt && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400 font-semibold">Delivered At</span>
                                  <span className="font-bold text-emerald-600">{formatDateTime(order.deliveredAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order timelines */}
                          {order.timelines && order.timelines.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150">
                              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
                                <Clock size={14} className="text-red-600" /> Order History
                              </h4>
                              <div className="relative pl-4 space-y-4">
                                <div className="absolute left-[3px] top-1.5 bottom-1.5 w-[1.5px] bg-gray-250" />
                                {order.timelines.map((log: any, idx: number) => (
                                  <div key={log.id} className="relative pl-4">
                                    <div className={`absolute left-[-15px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${idx === 0 ? 'bg-red-600 border-red-600 shadow-sm shadow-red-200' : 'bg-white border-gray-300'
                                      }`} />
                                    <p className={`text-xs font-bold ${idx === 0 ? 'text-red-600' : 'text-gray-700'}`}>{log.status.replace(/_/g, ' ')}</p>
                                    <p className="text-[10px] text-gray-450 mt-0.5">{formatDateTime(log.createdAt)}</p>
                                    {log.notes && <p className="text-[10px] text-gray-500 mt-1.5 bg-white border rounded-xl p-2.5 leading-relaxed">{log.notes}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right column */}
                        <div className="md:col-span-5 space-y-4">
                          {/* Items breakdown */}
                          <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Items</h4>
                            <div className="space-y-3 max-h-40 overflow-y-auto">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-3 items-center">
                                  <img
                                    src={item.productImage || '/images/product_white_tee.png'}
                                    alt={item.productName}
                                    className="w-10 h-12 object-cover rounded-lg border shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate">{item.productName}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Size: {item.size || '—'} · Qty: {item.quantity}</p>
                                  </div>
                                  <span className="text-xs font-bold">₹{item.totalPrice.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Billing breakdown */}
                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Billing Summary</h4>
                            <div className="text-xs space-y-2.5">
                              <div className="flex justify-between">
                                <span className="text-gray-405 font-semibold">Subtotal</span>
                                <span className="font-bold text-gray-950">₹{order.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-405 font-semibold">Shipping</span>
                                <span className="font-bold">{order.shippingCharges === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${order.shippingCharges.toFixed(2)}`}</span>
                              </div>
                              {order.taxAmount > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-405 font-semibold">Tax</span>
                                  <span className="font-bold">₹{order.taxAmount.toFixed(2)}</span>
                                </div>
                              )}
                              {order.discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                  <span className="font-semibold flex items-center gap-1"><Tag size={10} /> Coupon ({order.couponCode})</span>
                                  <span className="font-bold">-₹{order.discountAmount.toFixed(2)}</span>
                                </div>
                              )}
                              <hr className="my-2" />
                              <div className="flex justify-between items-baseline pt-1">
                                <span className="text-sm font-bold text-gray-900">Total</span>
                                <span className="text-lg font-extrabold text-red-600">₹{order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── OFFICIAL GST TAX INVOICE MODAL & PRINT VIEW ─── */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 print:p-0 print:static print:bg-white print:backdrop-blur-none">
          {/* Close overlay */}
          <div className="absolute inset-0 print:hidden" onClick={() => setPrintingOrder(null)} />

          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:rounded-none print:w-full print:m-0 z-10"
            id="printable-invoice"
          >
            {(() => {
              const orderDate = new Date(printingOrder.createdAt);
              const orderYear = orderDate.getFullYear();
              const nextYearShort = (orderYear + 1).toString().slice(2);
              const invoiceNumber = `INV/${orderYear.toString().slice(2)}-${nextYearShort}/${printingOrder.orderNumber}`;

              const invoiceItems = printingOrder.items?.map((item: any) => ({
                id: item.id,
                productName: item.productName,
                sku: item.size ? `${item.productName.slice(0, 4).toUpperCase()}-${item.size}` : 'ZOMM-LC-TL-0144',
                hsnCode: '82079090',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                unit: 'NOS',
              })) || [];

              const buyer = {
                fullName: printingOrder.address?.fullName || 'Valued Customer',
                companyName: (printingOrder as any).companyName || printingOrder.address?.fullName || 'Shigan Industries Private Limited',
                addressLine1: printingOrder.address?.addressLine1 || 'Shyam Udyog Parisar, Alier',
                addressLine2: printingOrder.address?.addressLine2 || 'Bhangrola Road, Manesar, Gurugram',
                city: printingOrder.address?.city || 'Manesar',
                state: printingOrder.address?.state || 'Haryana',
                postalCode: printingOrder.address?.postalCode || '122052',
                phone: printingOrder.address?.phone || '+91-9870517217',
                email: '',
                gstin: (printingOrder as any).gstin || '06AAZCS7666J1ZA',
                pan: (printingOrder as any).pan || 'AAZCS7666J',
              };

              return (
                <TaxInvoice
                  invoiceNumber={invoiceNumber}
                  invoiceDate={orderDate}
                  poNumber={`PO-PC/${orderYear.toString().slice(2)}-${nextYearShort}/${printingOrder.orderNumber}`}
                  poDate={new Date(orderDate.getTime() - 30 * 24 * 60 * 60 * 1000)}
                  buyer={buyer}
                  items={invoiceItems}
                  subtotal={printingOrder.subtotal}
                  totalAmount={printingOrder.totalAmount}
                  onClose={() => setPrintingOrder(null)}
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

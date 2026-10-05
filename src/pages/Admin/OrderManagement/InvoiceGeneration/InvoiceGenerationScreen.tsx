import { COLORS, FONTS } from '../../../../constant/style';
import logo from '../../../../assets/logo.png';
import Button from '../../../../components/common/Button';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Search,
  FileText,
  Printer,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  User,
  Calendar,
  Hash,
  ExternalLink,
  Receipt,
  Filter,
} from 'lucide-react';
import type { InvoiceRow } from './index';
import type { Pagination } from '../../../../types/Product.type';
import type { AdminOrderDetail } from '../../../../types/AdminOrder.type';
import type { PaymentStatus } from '../../../../types/Payment.type';

export interface InvoiceGenerationScreenProps {
  invoices: InvoiceRow[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: any;
  pagination: Pagination | undefined;
  page: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  paymentStatusFilter: PaymentStatus | '';
  onPaymentStatusFilterChange: (status: PaymentStatus | '') => void;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onSelectAll: () => void;
  onViewInvoice: (orderId: number) => void;
  onBatchPrint: () => void;
  onGoToOrderDetails: (orderId: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onBack: () => void;
  formatDate: (dateStr: string) => string;
  formatDateTime: (dateStr: string) => string;
  // Invoice detail modal
  showInvoiceModal: boolean;
  orderDetail: AdminOrderDetail | undefined;
  isDetailLoading: boolean;
  onCloseInvoiceModal: () => void;
  onPrintInvoice: () => void;
}

const paymentStatusTabs: { label: string; value: PaymentStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Paid', value: 'SUCCESS' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Refunded', value: 'REFUNDED' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Generated':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    case 'Failed':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
    case 'Refunded':
      return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
    default:
      return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'Generated':
      return 'bg-emerald-500';
    case 'Pending':
      return 'bg-amber-500';
    case 'Failed':
      return 'bg-rose-500';
    case 'Refunded':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getOrderStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    case 'CANCELLED':
    case 'RETURNED':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    case 'CONFIRMED':
    case 'PACKED':
      return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20';
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
    case 'RETURN_REQUESTED':
      return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
    default:
      return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
  }
};

const getOrderStatusDotStyle = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'bg-emerald-500';
    case 'CANCELLED':
    case 'RETURNED':
      return 'bg-rose-500';
    case 'PENDING':
      return 'bg-amber-500';
    case 'CONFIRMED':
    case 'PACKED':
      return 'bg-indigo-500';
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return 'bg-blue-500';
    case 'RETURN_REQUESTED':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getPaymentBadge = (method: string) => {
  if (method === 'Razorpay') return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
  if (method === 'Cash on Delivery') return 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20';
  return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
};

/* ─── Skeleton Row ─────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
      <td className="px-5 py-4"><div className="w-28 h-4 bg-gray-200 rounded" /></td>
      <td className="px-5 py-4"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
      <td className="px-5 py-4 hidden sm:table-cell"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
      <td className="px-5 py-4 hidden md:table-cell"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
      <td className="px-5 py-4 hidden md:table-cell"><div className="w-20 h-4 bg-gray-200 rounded" /></td>
      <td className="px-5 py-4"><div className="w-16 h-4 bg-gray-200 rounded" /></td>
      <td className="px-5 py-4"><div className="w-20 h-5 bg-gray-200 rounded-full" /></td>
      <td className="px-5 py-4 text-right"><div className="w-20 h-4 bg-gray-200 rounded ml-auto" /></td>
    </tr>
  );
}

/* ─── Invoice Detail Modal ─────────────────────────────────────────────── */
function InvoiceDetailModal({
  orderDetail,
  isDetailLoading,
  onClose,
  onPrint,
  formatDate,
  formatDateTime,
}: {
  orderDetail: AdminOrderDetail | undefined;
  isDetailLoading: boolean;
  onClose: () => void;
  onPrint: () => void;
  formatDate: (d: string) => string;
  formatDateTime: (d: string) => string;
}) {
  if (isDetailLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 max-w-md">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
          <p className="text-sm text-gray-500" style={{ fontFamily: FONTS.main }}>Loading invoice details…</p>
        </div>
      </div>
    );
  }

  if (!orderDetail) return null;

  const order = orderDetail;
  const invoiceNumber = `INV-${order.orderNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:bg-white print:backdrop-blur-none print:static print:inset-auto">
      {/* Close overlay */}
      <div className="absolute inset-0 print:hidden" onClick={onClose} />

      {/* Invoice content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:rounded-none print:mx-0 print:max-w-none"
        style={{ fontFamily: FONTS.main }}
        id="printable-invoice"
      >
        {/* Close button (hidden when printing) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors print:hidden"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="p-8 print:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src={logo} alt="sensai" className="h-12 w-auto object-contain" />
              <div>
                <p className="text-xs text-gray-500">Precision Fasteners & Workshop Tools</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: FONTS.heading }}>INVOICE</h3>
              <p className="text-sm font-semibold text-pink-600 mt-1">{invoiceNumber}</p>
              <p className="text-xs text-gray-500 mt-1">Date: {formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Customer / Bill To */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Bill To</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{order.address?.fullName || order.customer?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500">{order.customer?.email || ''}</p>
              {order.address ? (
                <>
                  <p className="text-xs text-gray-500">{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p className="text-xs text-gray-500">{order.address.addressLine2}</p>}
                  <p className="text-xs text-gray-500">
                    {order.address.city}, {order.address.state} - {order.address.postalCode}
                  </p>
                  <p className="text-xs text-gray-500">Phone: {order.address.phone}</p>
                </>
              ) : (
                order.customer?.phone && <p className="text-xs text-gray-500">Phone: {order.customer.phone}</p>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Ship To</span>
              </div>
              {order.address ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">{order.address.fullName}</p>
                  <p className="text-xs text-gray-500">{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p className="text-xs text-gray-500">{order.address.addressLine2}</p>}
                  <p className="text-xs text-gray-500">
                    {order.address.city}, {order.address.state} - {order.address.postalCode}
                  </p>
                  <p className="text-xs text-gray-500">Phone: {order.address.phone}</p>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">No address on file</p>
              )}
            </div>
          </div>

          {/* Order Info Bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-600">
              <Hash className="w-3.5 h-3.5" />
              <span className="font-medium">Order:</span> {order.orderNumber}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">Date:</span> {formatDateTime(order.createdAt)}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getPaymentBadge(order.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'Cash on Delivery')}`}>
              <CreditCard className="w-3.5 h-3.5" />
              {order.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'COD'}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getOrderStatusBadgeStyle(order.status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getOrderStatusDotStyle(order.status)}`} />
              Fulfillment: {order.status}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">#</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden sm:table-cell">Variant</th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Qty</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Unit Price</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items?.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 print:w-8 print:h-8"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{item.productName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {item.size && (
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-600">{item.size}</span>
                        )}
                        {item.color && (
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-600">{item.color}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 font-medium">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-700">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{item.totalPrice.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Breakdown */}
          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingCharges > 0 ? `₹${order.shippingCharges.toLocaleString('en-IN')}` : 'FREE'}</span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>₹{order.taxAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span style={{ color: COLORS.primary }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {order.payment && (
            <div className="bg-gradient-to-r from-gray-50 to-pink-50/30 rounded-xl p-4 mb-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Payment Details</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-gray-400 font-medium">Method</p>
                  <p className="text-gray-800 font-semibold">{order.payment.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'COD'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.payment.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                      order.payment.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        order.payment.status === 'FAILED' ? 'bg-rose-50 text-rose-700' :
                          'bg-purple-50 text-purple-700'
                    }`}>
                    {order.payment.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Amount</p>
                  <p className="text-gray-800 font-semibold">₹{order.payment.amount.toLocaleString('en-IN')}</p>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <p className="text-gray-400 font-medium">Transaction ID</p>
                    <p className="text-gray-800 font-semibold text-[10px] break-all">{order.payment.transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer / Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 print:hidden">
            <p className="text-xs text-gray-400">Thank you for shopping with Sansei!</p>
            <div className="flex gap-2">
              <Button variant="outline" size="md" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" size="md" onClick={onPrint}>
                <Printer className="w-4 h-4 mr-1.5" />
                Print Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Screen ──────────────────────────────────────────────────────── */
export default function InvoiceGenerationScreen({
  invoices,
  isLoading,
  isFetching,
  isError,
  error,
  pagination,
  page,
  searchQuery,
  onSearchChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onViewInvoice,
  onBatchPrint,
  onGoToOrderDetails,
  onNextPage,
  onPrevPage,
  onBack,
  formatDate,
  formatDateTime,
  showInvoiceModal,
  orderDetail,
  isDetailLoading,
  onCloseInvoiceModal,
  onPrintInvoice,
}: InvoiceGenerationScreenProps) {
  const totalInvoices = pagination?.total || 0;
  const allSelected = invoices.length > 0 && selectedIds.size === invoices.length;

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Invoice Generation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and generate billing invoices for your orders.
            {totalInvoices > 0 && (
              <span className="ml-1 text-gray-400">({totalInvoices} total)</span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.size > 0 && (
            <Button variant="outline" size="md" onClick={onBatchPrint}>
              <Printer className="w-4 h-4 mr-1.5" />
              Print Selected ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-4" style={{ borderColor: COLORS.border }}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all"
              style={{ fontFamily: FONTS.main }}
            />
          </div>

          {/* Payment Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <Filter className="w-4 h-4 text-gray-400 ml-2 mr-1 flex-shrink-0" />
            {paymentStatusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onPaymentStatusFilterChange(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${paymentStatusFilter === tab.value
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto my-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-800 mb-2" style={{ fontFamily: FONTS.heading }}>Failed to load invoices</h3>
          <p className="text-sm text-red-600">
            {(error as any)?.data?.message || 'An error occurred while fetching invoice data. Please try again.'}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && invoices.length === 0 && (
        <div className="bg-white border rounded-2xl p-12 text-center" style={{ borderColor: COLORS.border }}>
          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: FONTS.heading }}>No invoices found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || paymentStatusFilter
              ? 'No invoices match your current filters. Try adjusting your search criteria.'
              : 'Invoices will appear here once orders are placed.'}
          </p>
        </div>
      )}

      {/* Invoice Table */}
      {(isLoading || invoices.length > 0) && (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-opacity ${isFetching && !isLoading ? 'opacity-70' : ''}`} style={{ borderColor: COLORS.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-5 py-4 w-12 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={onSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                      disabled={isLoading}
                    />
                  </th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Invoice ID</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Order Ref</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell text-gray-500">Customer</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Date</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Payment</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                      {/* Checkbox */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(invoice.id)}
                          onChange={() => onToggleSelect(invoice.id)}
                          className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                        />
                      </td>

                      {/* Invoice ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-bold text-sm text-gray-900">{invoice.invoiceId}</span>
                        </div>
                      </td>

                      {/* Order Ref */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => onGoToOrderDetails(invoice.id)}
                          className="text-pink-600 hover:text-pink-700 hover:underline font-medium text-sm inline-flex items-center gap-1"
                        >
                          #{invoice.orderNumber}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">{invoice.customerName}</p>
                          {invoice.customerEmail && (
                            <p className="text-[11px] text-gray-400">{invoice.customerEmail}</p>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell text-xs">
                        {formatDate(invoice.date)}
                      </td>

                      {/* Payment Method */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getPaymentBadge(invoice.paymentMethod)}`}>
                          <CreditCard className="w-3 h-3" />
                          {invoice.paymentMethod === 'Cash on Delivery' ? 'COD' : invoice.paymentMethod}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900">₹{invoice.amount.toLocaleString('en-IN')}</span>
                        {invoice.itemCount > 0 && (
                          <p className="text-[10px] text-gray-400">{invoice.itemCount} item{invoice.itemCount > 1 ? 's' : ''}</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusBadge(invoice.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(invoice.status)}`} />
                            Invoice: {invoice.status}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getOrderStatusBadgeStyle(invoice.orderStatus)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getOrderStatusDotStyle(invoice.orderStatus)}`} />
                            Order: {invoice.orderStatus}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.status === 'Generated' ? (
                            <button
                              onClick={() => onViewInvoice(invoice.id)}
                              className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </button>
                          ) : invoice.status === 'Pending' ? (
                            <button
                              onClick={() => onViewInvoice(invoice.id)}
                              className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View
                            </button>
                          ) : invoice.status === 'Failed' ? (
                            <button
                              onClick={() => onViewInvoice(invoice.id)}
                              className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              View
                            </button>
                          ) : (
                            <button
                              onClick={() => onViewInvoice(invoice.id)}
                              className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50/30">
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{(page - 1) * (pagination.limit || 10) + 1}</span>
                {' – '}
                <span className="font-semibold text-gray-700">
                  {Math.min(page * (pagination.limit || 10), pagination.total)}
                </span>
                {' of '}
                <span className="font-semibold text-gray-700">{pagination.total}</span> invoices
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrevPage}
                  disabled={!pagination.hasPreviousPage}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors ${pagination.hasPreviousPage
                      ? 'border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-gray-600 px-2">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={onNextPage}
                  disabled={!pagination.hasNextPage}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors ${pagination.hasNextPage
                      ? 'border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showInvoiceModal && (
        <InvoiceDetailModal
          orderDetail={orderDetail}
          isDetailLoading={isDetailLoading}
          onClose={onCloseInvoiceModal}
          onPrint={onPrintInvoice}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
        />
      )}

      {/* Print styles (injected) */}
      <style>{`
        @media print {
          body > *:not(#printable-invoice) {
            display: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:static {
            position: static !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:max-h-none {
            max-height: none !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
          .print\\:mx-0 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          .print\\:inset-auto {
            inset: auto !important;
          }
          .print\\:backdrop-blur-none {
            backdrop-filter: none !important;
          }
          .print\\:w-8 {
            width: 2rem !important;
          }
          .print\\:h-8 {
            height: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

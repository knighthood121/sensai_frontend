import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import TaxInvoice from '../../../../components/common/TaxInvoice';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Search,
  FileText,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  CreditCard,
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
}: {
  orderDetail: AdminOrderDetail | undefined;
  isDetailLoading: boolean;
  onClose: () => void;
  onPrint?: () => void;
  formatDate?: (d: string) => string;
  formatDateTime?: (d: string) => string;
}) {
  if (isDetailLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 max-w-md">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          <p className="text-sm text-gray-500" style={{ fontFamily: FONTS.main }}>Loading invoice details…</p>
        </div>
      </div>
    );
  }

  if (!orderDetail) return null;

  const order = orderDetail;
  const orderDate = new Date(order.createdAt);
  const orderYear = orderDate.getFullYear();
  const nextYearShort = (orderYear + 1).toString().slice(2);
  const invoiceNumber = `INV/${orderYear.toString().slice(2)}-${nextYearShort}/${order.orderNumber}`;

  const invoiceItems = order.items?.map((item) => ({
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
    fullName: order.address?.fullName || order.customer?.name || 'Valued Customer',
    companyName: (order as any).companyName || order.address?.fullName || 'Shigan Industries Private Limited',
    addressLine1: order.address?.addressLine1 || 'Shyam Udyog Parisar, Alier',
    addressLine2: order.address?.addressLine2 || 'Bhangrola Road, Manesar, Gurugram',
    city: order.address?.city || 'Manesar',
    state: order.address?.state || 'Haryana',
    postalCode: order.address?.postalCode || '122052',
    phone: order.address?.phone || order.customer?.phone || '+91-9870517217',
    email: order.customer?.email || '',
    gstin: (order as any).gstin || '06AAZCS7666J1ZA',
    pan: (order as any).pan || 'AAZCS7666J',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 print:p-0 print:static print:bg-white print:backdrop-blur-none">
      {/* Close overlay */}
      <div className="absolute inset-0 print:hidden" onClick={onClose} />

      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:rounded-none print:w-full print:m-0 z-10"
        id="printable-invoice"
      >
        <TaxInvoice
          invoiceNumber={invoiceNumber}
          invoiceDate={orderDate}
          poNumber={`PO-PC/${orderYear.toString().slice(2)}-${nextYearShort}/${order.orderNumber}`}
          poDate={new Date(orderDate.getTime() - 30 * 24 * 60 * 60 * 1000)}
          buyer={buyer}
          items={invoiceItems}
          subtotal={order.subtotal}
          totalAmount={order.totalAmount}
          onClose={onClose}
        />
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
      <div className={showInvoiceModal ? 'print:hidden' : ''}>
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
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
                    ? 'bg-white text-red-600 shadow-sm'
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
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-red-500" />
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
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
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
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
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
                          className="text-red-600 hover:text-red-700 hover:underline font-medium text-sm inline-flex items-center gap-1"
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
                              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
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
                              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
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

      </div>

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
    </div>
  );
}

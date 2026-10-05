import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from '../../../../service/adminOrderApi';
import { Loader2, AlertCircle, Search, Filter } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import type { OrderStatus } from '../../../../types/order.type';
import type { PaymentStatus } from '../../../../types/Payment.type';

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PACKED', 'CANCELLED'],
    PACKED: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
    OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: ['RETURN_REQUESTED'],
    CANCELLED: [],
    RETURN_REQUESTED: ['RETURNED', 'DELIVERED'],
    RETURNED: [],
  };

  const handleStatusChange = async (orderId: number, currentStatus: OrderStatus, newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;
    try {
      showToast(`Updating status of order #${orderId} to ${newStatus}...`, 'info');
      await updateOrderStatus({
        id: orderId,
        data: { status: newStatus },
      }).unwrap();
      showToast('Order status updated successfully.', 'success');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update order status.', 'error');
    }
  };

  // Component query states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('');

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch admin orders
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useGetAdminOrdersQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    paymentStatus: paymentStatusFilter || undefined,
  });

  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination;

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
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
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-650/20';
    }
  };

  const getStatusDotStyle = (status: OrderStatus) => {
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

  const getPaymentBadgeStyle = (paymentStatus: PaymentStatus) => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
      case 'REFUNDED':
        return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
      default:
        return 'bg-gray-50 text-gray-750 ring-1 ring-gray-650/20';
    }
  };

  const getPaymentDotStyle = (paymentStatus: PaymentStatus) => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return 'bg-emerald-500';
      case 'PENDING':
        return 'bg-amber-500';
      case 'FAILED':
        return 'bg-rose-500';
      case 'REFUNDED':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Order Management</h1>
        </div>
      </div>

      {/* Top search & filters bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.textLight }}
            />
            <input
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-4 focus:ring-pink-100 bg-white"
              style={{ borderColor: COLORS.border }}
              placeholder="Search orders by ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-48">
            <select
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white appearance-none cursor-pointer"
              style={{ borderColor: COLORS.border }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as OrderStatus | '');
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PACKED">Packed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURN_REQUESTED">Return Requested</option>
              <option value="RETURNED">Returned</option>
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {/* Payment Status Filter */}
          <div className="relative w-full sm:w-48">
            <select
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white appearance-none cursor-pointer"
              style={{ borderColor: COLORS.border }}
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value as PaymentStatus | '');
                setPage(1);
              }}
            >
              <option value="">All Payments</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>
      </div>

      {/* Orders table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center" style={{ borderColor: COLORS.border }}>
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading orders...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-1">Error Loading Orders</h3>
          <p className="text-red-700 text-sm mb-4">{(error as any)?.data?.message || 'Failed to connect to order APIs.'}</p>
          <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 transition-colors">
                  <th className="px-5 py-4 w-12 text-left">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer" />
                  </th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell text-gray-500">Date</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Customer</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Total</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Payment</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden lg:table-cell text-gray-500">Status</th>
                  <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer" />
                      </td>
                      <td
                        className="px-5 py-4 font-bold text-sm text-gray-900 group-hover:text-pink-600 transition-colors cursor-pointer hover:underline"
                        onClick={() => navigate('/admin/orders/details', { state: { orderId: order.id } })}
                      >
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-sm text-gray-900">{order.customer?.name}</p>
                        <p className="text-xs mt-0.5 text-gray-500">{order.customer?.email}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-sm text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPaymentBadgeStyle(order.paymentStatus)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getPaymentDotStyle(order.paymentStatus)}`} />
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, order.status, e.target.value as OrderStatus)}
                            disabled={isUpdating || !VALID_TRANSITIONS[order.status] || VALID_TRANSITIONS[order.status].length === 0}
                            className={`appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border-0 transition-all hover:ring-2 focus:ring-2 focus:ring-pink-500/20 disabled:cursor-not-allowed disabled:opacity-80 ${getStatusBadgeStyle(order.status)}`}
                          >
                            <option value={order.status}>{order.status}</option>
                            {VALID_TRANSITIONS[order.status]?.map((statusOption) => (
                              <option key={statusOption} value={statusOption} className="text-gray-900 bg-white font-semibold">
                                {statusOption}
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
                            onClick={() => navigate('/admin/orders/details', { state: { orderId: order.id } })}
                            title="View Details"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-pink-500"
                        style={{ backgroundColor: COLORS.primary + '12' }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <p className="font-bold text-base mb-1">No orders found</p>
                      <p className="text-xs mb-4 text-gray-500">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-150">
              <span className="text-xs text-gray-500 font-semibold">
                Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!pagination.hasPreviousPage}
                  className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={!pagination.hasNextPage}
                  className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

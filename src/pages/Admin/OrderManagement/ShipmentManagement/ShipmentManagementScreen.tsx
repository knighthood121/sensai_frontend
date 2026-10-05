import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import { Loader2, AlertCircle, Search, Filter, Truck, Package, MapPin, Eye, Edit3 } from 'lucide-react';
import type { OrderStatus } from '../../../../types/order.type';
import type { AdminOrderSummary } from '../../../../types/AdminOrder.type';
import type { Pagination } from '../../../../types/Product.type';
import type { ShipmentFilterStatus } from './index';

interface ShipmentManagementScreenProps {
  orders: AdminOrderSummary[];
  allOrders: AdminOrderSummary[];
  pagination: Pagination | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
  isUpdating: boolean;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  statusFilter: ShipmentFilterStatus;
  setStatusFilter: (s: ShipmentFilterStatus) => void;
  handleQuickStatusChange: (orderId: number, currentStatus: OrderStatus, newStatus: OrderStatus) => void;
  trackingModalOpen: boolean;
  setTrackingModalOpen: (open: boolean) => void;
  selectedOrder: AdminOrderSummary | null;
  trackingId: string;
  setTrackingId: (id: string) => void;
  trackingStatus: OrderStatus;
  setTrackingStatus: (s: OrderStatus) => void;
  openTrackingModal: (order: AdminOrderSummary) => void;
  handleSubmitTracking: () => void;
  detailModalOpen: boolean;
  setDetailModalOpen: (open: boolean) => void;
  detailOrder: AdminOrderSummary | null;
  openDetailModal: (order: AdminOrderSummary) => void;
  validTransitions: Record<string, OrderStatus[]>;
}

export default function ShipmentManagementScreen({
  orders,
  allOrders,
  pagination,
  isLoading,
  isError,
  error,
  isUpdating,
  page,
  setPage,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  handleQuickStatusChange,
  trackingModalOpen,
  setTrackingModalOpen,
  selectedOrder,
  trackingId,
  setTrackingId,
  trackingStatus,
  setTrackingStatus,
  openTrackingModal,
  handleSubmitTracking,
  detailModalOpen,
  setDetailModalOpen,
  detailOrder,
  openDetailModal,
  validTransitions,
}: ShipmentManagementScreenProps) {
  const navigate = useNavigate();

  // ─── Style Helpers ────────────────────────────────────────────────────────

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20';
      case 'PACKED':
        return 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/20';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-400/20';
    }
  };

  const getStatusDotStyle = (status: OrderStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-indigo-500';
      case 'PACKED':
        return 'bg-violet-500';
      case 'SHIPPED':
        return 'bg-blue-500';
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-500';
      case 'DELIVERED':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => status.replace(/_/g, ' ');

  // ─── Summary Stats ────────────────────────────────────────────────────────
  const confirmedCount = allOrders.filter((o) => o.status === 'CONFIRMED').length;
  const packedCount = allOrders.filter((o) => o.status === 'PACKED').length;
  const shippedCount = allOrders.filter((o) => o.status === 'SHIPPED').length;
  const outForDeliveryCount = allOrders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = allOrders.filter((o) => o.status === 'DELIVERED').length;

  const statCards = [
    { label: 'Confirmed', count: confirmedCount, color: 'indigo', icon: Package },
    { label: 'Packed', count: packedCount, color: 'violet', icon: Package },
    { label: 'Shipped', count: shippedCount, color: 'blue', icon: Truck },
    { label: 'Out for Delivery', count: outForDeliveryCount, color: 'amber', icon: Truck },
    { label: 'Delivered', count: deliveredCount, color: 'emerald', icon: MapPin },
  ];

  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', icon: 'text-violet-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
  };

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Header */}
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
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Shipment Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track and manage order shipments and deliveries.</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {statCards.map((card) => {
            const c = colorMap[card.color];
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`${c.bg} rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:ring-2 hover:ring-offset-1 transition-all`}
                style={{ '--tw-ring-color': 'rgba(0,0,0,0.08)' } as React.CSSProperties}
                onClick={() => {
                  const statusKey = card.label.replace(/ /g, '_').toUpperCase() as OrderStatus;
                  setStatusFilter(statusFilter === statusKey ? '' : statusKey);
                  setPage(1);
                }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon} bg-white/60`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${c.text}`}>{card.count}</p>
                  <p className="text-xs font-semibold text-gray-500">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters Bar */}
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
              placeholder="Search by order ID, customer, tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-52">
            <select
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white appearance-none cursor-pointer"
              style={{ borderColor: COLORS.border }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ShipmentFilterStatus);
                setPage(1);
              }}
            >
              <option value="">All Shipment Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PACKED">Packed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center" style={{ borderColor: COLORS.border }}>
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading shipments...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-1">Error Loading Shipments</h3>
          <p className="text-red-700 text-sm mb-4">{(error as any)?.data?.message || 'Failed to connect to order APIs.'}</p>
          <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Order</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell text-gray-500">Customer</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Tracking</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden lg:table-cell text-gray-500">Destination</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Date</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      {/* Order Info */}
                      <td className="px-5 py-4">
                        <p
                          className="font-bold text-sm text-gray-900 group-hover:text-pink-600 transition-colors cursor-pointer hover:underline"
                          onClick={() => navigate('/admin/orders/details', { state: { orderId: order.id } })}
                        >
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatCurrency(order.totalAmount)}</p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="font-bold text-sm text-gray-900">{order.customer?.name}</p>
                        <p className="text-xs mt-0.5 text-gray-500">{order.customer?.phone || order.customer?.email}</p>
                      </td>

                      {/* Tracking ID */}
                      <td className="px-5 py-4">
                        {order.shippingTrackingId ? (
                          <p className="font-mono font-bold text-sm text-gray-900">{order.shippingTrackingId}</p>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No tracking</span>
                        )}
                      </td>

                      {/* Destination */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {order.address ? (
                          <div>
                            <p className="text-sm text-gray-900">{order.address.city}, {order.address.state}</p>
                            <p className="text-xs text-gray-400">{order.address.postalCode}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                        {formatDate(order.updatedAt)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => handleQuickStatusChange(order.id, order.status, e.target.value as OrderStatus)}
                            disabled={isUpdating || !validTransitions[order.status] || validTransitions[order.status].length === 0}
                            className={`appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border-0 transition-all hover:ring-2 focus:ring-2 focus:ring-pink-500/20 disabled:cursor-not-allowed disabled:opacity-80 ${getStatusBadgeStyle(order.status)}`}
                          >
                            <option value={order.status}>{getStatusLabel(order.status)}</option>
                            {(validTransitions[order.status] || []).map((opt) => (
                              <option key={opt} value={opt} className="text-gray-900 bg-white font-semibold">
                                {getStatusLabel(opt)}
                              </option>
                            ))}
                          </select>
                          {(validTransitions[order.status] || []).length > 0 && (
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            onClick={() => openDetailModal(order)}
                            title="View Shipment Details"
                          >
                            <Eye size={16} />
                          </button>
                          {order.status !== 'DELIVERED' && (
                            <button
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
                              onClick={() => openTrackingModal(order)}
                              title="Update Tracking"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-pink-500"
                        style={{ backgroundColor: COLORS.primary + '12' }}
                      >
                        <Truck size={28} />
                      </div>
                      <p className="font-bold text-base mb-1">No shipments found</p>
                      <p className="text-xs mb-4 text-gray-500">There are no orders currently in the shipment pipeline.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — identical to OrderListScreen */}
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

      {/* ─── Shipment Detail Modal ───────────────────────────────────────────── */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Shipment Details">
        {detailOrder && (
          <div className="space-y-5">
            {/* Order Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{detailOrder.orderNumber}</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(detailOrder.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotStyle(detailOrder.status)}`} />
                {getStatusLabel(detailOrder.status)}
              </span>
            </div>

            {/* Customer */}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Customer</p>
              <p className="font-bold text-sm">{detailOrder.customer?.name}</p>
              <p className="text-xs text-gray-500">{detailOrder.customer?.email}{detailOrder.customer?.phone ? ` · ${detailOrder.customer.phone}` : ''}</p>
            </div>

            {/* Delivery Address */}
            {detailOrder.address && (
              <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="text-sm font-medium text-gray-900">{detailOrder.address.fullName}</p>
                <p className="text-sm text-gray-600">
                  {detailOrder.address.addressLine1}
                  {detailOrder.address.addressLine2 ? `, ${detailOrder.address.addressLine2}` : ''}
                </p>
                <p className="text-sm text-gray-600">{detailOrder.address.city}, {detailOrder.address.state} – {detailOrder.address.postalCode}</p>
                <p className="text-xs text-gray-500 mt-1">Phone: {detailOrder.address.phone}</p>
              </div>
            )}

            {/* Tracking */}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tracking Information</p>
              {detailOrder.shippingTrackingId ? (
                <p className="font-mono font-bold text-sm text-gray-900">{detailOrder.shippingTrackingId}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">No tracking ID assigned yet</p>
              )}
            </div>

            {/* Order Items */}
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Items ({detailOrder.items.length})</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {detailOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Color: ${item.color}`} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{formatCurrency(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-bold text-gray-500">Total Amount</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(detailOrder.totalAmount)}</span>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/admin/orders/details', { state: { orderId: detailOrder.id } })}
              >
                Full Order Details
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Update Tracking Modal ───────────────────────────────────────────── */}
      <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Update Tracking & Status">
        {selectedOrder && (
          <div className="space-y-5">
            {/* Order Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{selectedOrder.orderNumber}</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(selectedOrder.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotStyle(selectedOrder.status)}`} />
                {getStatusLabel(selectedOrder.status)}
              </span>
            </div>

            {/* Destination Summary */}
            {selectedOrder.address && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Ship To</p>
                <p className="font-bold text-sm">{selectedOrder.address.fullName}</p>
                <p className="text-xs text-gray-500">{selectedOrder.address.city}, {selectedOrder.address.state} – {selectedOrder.address.postalCode}</p>
              </div>
            )}

            {/* Tracking ID Input */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Tracking ID</label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-4 focus:ring-pink-100 bg-white font-mono"
                style={{ borderColor: COLORS.border }}
                placeholder="e.g. TRK987654321"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>

            {/* Status Selector */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Update Status To</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white appearance-none cursor-pointer"
                style={{ borderColor: COLORS.border }}
                value={trackingStatus}
                onChange={(e) => setTrackingStatus(e.target.value as OrderStatus)}
              >
                <option value={selectedOrder.status}>{getStatusLabel(selectedOrder.status)} (current)</option>
                {(validTransitions[selectedOrder.status] || []).map((opt) => (
                  <option key={opt} value={opt}>{getStatusLabel(opt)}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" size="sm" onClick={() => setTrackingModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitTracking}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save & Ship'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

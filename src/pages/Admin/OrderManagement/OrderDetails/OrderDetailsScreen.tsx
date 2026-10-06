import React from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  MapPin,
  CreditCard,
  User,
  Clock,
  Tag
} from 'lucide-react';
import type { OrderStatus } from '../../../../types/order.type';
import type { AdminOrderDetail } from '../../../../types/AdminOrder.type';

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

export interface OrderDetailsScreenProps {
  orderId: number | undefined;
  order: AdminOrderDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
  targetStatus: OrderStatus | '';
  setTargetStatus: React.Dispatch<React.SetStateAction<OrderStatus | ''>>;
  statusNotes: string;
  setStatusNotes: React.Dispatch<React.SetStateAction<string>>;
  trackingId: string;
  setTrackingId: React.Dispatch<React.SetStateAction<string>>;
  showStatusModal: boolean;
  setShowStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdating: boolean;
  formatDate: (dateStr: string) => string;
  formatDateTime: (dateStr: string) => string;
  getStatusBadgeStyle: (status: OrderStatus) => string;
  getStatusDotStyle: (status: OrderStatus) => string;
  handleStatusUpdate: (e: React.FormEvent) => Promise<void>;
  navigate: NavigateFunction;
}

export default function OrderDetailsScreen({
  orderId,
  order,
  isLoading,
  isError,
  error,
  targetStatus,
  setTargetStatus,
  statusNotes,
  setStatusNotes,
  trackingId,
  setTrackingId,
  showStatusModal,
  setShowStatusModal,
  isUpdating,
  formatDate,
  formatDateTime,
  getStatusBadgeStyle,
  getStatusDotStyle,
  handleStatusUpdate,
  navigate,
}: OrderDetailsScreenProps) {

  if (!orderId) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto my-12" style={{ fontFamily: FONTS.main }}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-900 mb-1">No Order Selected</h3>
        <p className="text-red-700 text-sm mb-6">Please navigate to the order details from the list view.</p>
        <Button onClick={() => navigate('/admin/orders/list')}>Go to Order List</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-20" style={{ fontFamily: FONTS.main }}>
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto my-12" style={{ fontFamily: FONTS.main }}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Error Loading Order</h3>
        <p className="text-red-700 text-sm mb-6">{(error as any)?.data?.message || 'Failed to fetch detailed order information.'}</p>
        <Button onClick={() => navigate('/admin/orders/list')}>Back to List</Button>
      </div>
    );
  }

  const nextOptions = VALID_TRANSITIONS[order.status] || [];

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }} className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders/list')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Order {order.orderNumber}</h1>
            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {nextOptions.length > 0 && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setTargetStatus(nextOptions[0]);
                setShowStatusModal(true);
              }}
            >
              Update Status
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status transition shortcut bar */}
          {nextOptions.length > 0 && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-450 mb-3">Quick Transition Options</h2>
              <div className="flex flex-wrap gap-3">
                {nextOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setTargetStatus(status);
                      setShowStatusModal(true);
                    }}
                    className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Transition to {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Items Summary */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => {
                const imageUrl = item.productImage || '/images/product_white_tee.png';
                return (
                  <div key={idx} className="flex items-center gap-4 py-4 border-b last:border-0" style={{ borderColor: COLORS.border }}>
                    <div className="w-16 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                      <img src={imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-gray-900 leading-snug">{item.productName}</h3>
                      <p className="text-xs text-gray-450 font-bold uppercase tracking-wider mt-1">
                        {item.color && `Color: ${item.color}`}
                        {item.color && item.size && ` | `}
                        {item.size && `Size: ${item.size}`}
                      </p>
                    </div>
                    <div className="text-right font-semibold">
                      <p className="font-bold text-sm text-gray-900">₹{item.unitPrice.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations breakdown */}
            <div className="mt-6 pt-6 border-t font-semibold text-gray-600" style={{ borderColor: COLORS.border }}>
              <div className="flex justify-between mb-2 text-sm">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Shipping Charges</span>
                <span className="text-gray-900">
                  {order.shippingCharges === 0 ? <span className="text-emerald-600 font-black">Free</span> : `₹${order.shippingCharges.toFixed(2)}`}
                </span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between mb-2 text-sm">
                  <span>GST / Tax</span>
                  <span className="text-gray-900">₹{order.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between mb-2 text-sm text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Tag size={13} /> Coupon ({order.couponCode})
                  </span>
                  <span>-₹{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t text-gray-900" style={{ borderColor: COLORS.border }}>
                <span>Grand Total</span>
                <span className="text-pink-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Timeline steppers */}
          {order.timelines && order.timelines.length > 0 && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Clock size={18} className="text-pink-500" /> Order History Logs
              </h2>
              <div className="relative border-l-2 border-gray-150 ml-3 space-y-6">
                {order.timelines.map((log, index) => (
                  <div key={log.id} className="relative pl-6">
                    <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 bg-white ${index === 0 ? 'border-pink-500 scale-110 shadow-sm' : 'border-gray-300'
                      }`} />
                    <div>
                      <span className={`text-xs font-black uppercase tracking-wide ${index === 0 ? 'text-pink-600' : 'text-gray-900'}`}>
                        {log.status}
                      </span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{formatDateTime(log.createdAt)}</p>
                      {log.notes && (
                        <p className="text-xs text-gray-600 mt-1 font-semibold leading-relaxed bg-[#FAFBFD] border border-gray-100 rounded-xl p-2.5">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal / Customer Notes */}
          {(order.customerNotes || order.internalNotes) && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4" style={{ borderColor: COLORS.border }}>
              {order.customerNotes && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Customer Notes</h2>
                  <p className="text-sm font-semibold text-gray-700 italic">"{order.customerNotes}"</p>
                </div>
              )}
              {order.internalNotes && (
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">Internal Notes (Admin Only)</h2>
                  <p className="text-sm font-semibold text-gray-700 italic">"{order.internalNotes}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Customer, Shipping & Payment Summary */}
        <div className="space-y-6">
          {/* Customer profile info */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User size={18} className="text-pink-500" /> Customer Overview
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-black">
                {order.customer?.name ? order.customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'C'}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{order.customer?.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Customer ID: #{order.userId}</p>
              </div>
            </div>
            <div className="space-y-2.5 pt-2 border-t border-gray-50 text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span className="text-gray-900 truncate">{order.customer?.email}</span>
              </div>
              {order.customer?.phone && (
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span className="text-gray-900">{order.customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping address info */}
          {order.address && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-pink-500" /> Shipping Address
              </h2>
              <address className="text-sm text-gray-600 not-italic leading-relaxed">
                <p className="font-extrabold text-gray-900 mb-1">{order.address.fullName}</p>
                <p className="font-semibold">{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p className="font-semibold">{order.address.addressLine2}</p>}
                <p className="font-semibold">{order.address.city}, {order.address.state} - {order.address.postalCode}</p>
                <p className="font-semibold">{order.address.country}</p>
                {order.address.phone && <p className="text-xs text-gray-400 font-bold mt-2">📞 {order.address.phone}</p>}
              </address>
            </div>
          )}

          {/* Payment & fulfillment status details */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-pink-500" /> Status Overview
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Payment Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.paymentStatus === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' :
                  order.paymentStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' :
                    'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'SUCCESS' ? 'bg-emerald-500' :
                    order.paymentStatus === 'PENDING' ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`} />
                  {order.paymentStatus}
                </span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5 pl-0.5">Method: {order.paymentMethod}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Fulfillment Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(order.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotStyle(order.status)}`} />
                  {order.status}
                </span>
                {order.shippingTrackingId && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5 pl-0.5">
                    Carrier Tracking: <span className="font-mono text-gray-900">{order.shippingTrackingId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Update Status Modal --- */}
      {showStatusModal && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => {
              if (!isUpdating) {
                setShowStatusModal(false);
                setTargetStatus('');
                setStatusNotes('');
                setTrackingId('');
              }
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <div className="relative bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl z-10 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2" style={{ fontFamily: FONTS.heading }}>
              Update Order Status
            </h3>
            <p className="text-xs text-gray-400 font-semibold mb-6">
              You are updating order status from <span className="font-bold text-pink-500">{order.status}</span> to <span className="font-bold text-pink-500">{targetStatus}</span>.
            </p>

            <form onSubmit={handleStatusUpdate} className="space-y-5">
              {/* Optional Transition Notes */}
              <div>
                <label htmlFor="notes" className="block text-xs font-black uppercase tracking-wider text-gray-450 mb-2">
                  Transition Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="E.g., Shipped via DHL express package service..."
                  className="w-full rounded-2xl border border-gray-250 p-4 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none"
                  disabled={isUpdating}
                />
              </div>

              {/* Shipping tracking input - required only when moving to SHIPPED */}
              {targetStatus === 'SHIPPED' && (
                <div>
                  <label htmlFor="trackingId" className="block text-xs font-black uppercase tracking-wider text-gray-450 mb-2">
                    Carrier Tracking ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="trackingId"
                    type="text"
                    required
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="E.g., DHL9876543210"
                    className="w-full rounded-2xl border border-gray-250 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                    disabled={isUpdating}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setTargetStatus('');
                    setStatusNotes('');
                    setTrackingId('');
                  }}
                  className="flex-1 py-3.5 rounded-full font-black uppercase tracking-wider text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-full font-black uppercase tracking-wider text-xs bg-pink-500 hover:bg-pink-600 text-white shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Confirm Update'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




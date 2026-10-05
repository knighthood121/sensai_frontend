import { useState, useEffect } from 'react';
import ShipmentManagementScreen from './ShipmentManagementScreen';
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from '../../../../service/adminOrderApi';
import { useToast } from '../../../../components/common/Toast';
import type { OrderStatus } from '../../../../types/order.type';
import type { AdminOrderSummary } from '../../../../types/AdminOrder.type';

// Shipment-relevant statuses — orders enter the shipment pipeline once confirmed
const SHIPMENT_STATUSES: OrderStatus[] = ['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

// Valid shipment-flow status transitions
const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
};

export type ShipmentFilterStatus = OrderStatus | '';

export default function ShipmentManagement() {
  const { showToast } = useToast();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // ─── Filter & Pagination State ─────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentFilterStatus>('');

  // ─── Tracking Modal State ──────────────────────────────────────────────────
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderSummary | null>(null);
  const [trackingId, setTrackingId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<OrderStatus>('SHIPPED');

  // ─── Detail Modal State ────────────────────────────────────────────────────
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<AdminOrderSummary | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ─── Fetch Admin Orders ───────────────────────────────────────────────────
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
  });

  // Client-side filter: Only show shipment-relevant statuses when no specific filter is set
  const allOrders = ordersData?.data || [];
  const orders = statusFilter
    ? allOrders
    : allOrders.filter((o) => SHIPMENT_STATUSES.includes(o.status));
  const pagination = ordersData?.pagination;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleQuickStatusChange = async (orderId: number, currentStatus: OrderStatus, newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;
    try {
      showToast(`Updating shipment status to ${newStatus.replace(/_/g, ' ')}...`, 'info');
      await updateOrderStatus({
        id: orderId,
        data: { status: newStatus },
      }).unwrap();
      showToast('Shipment status updated successfully.', 'success');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update shipment status.', 'error');
    }
  };

  const openTrackingModal = (order: AdminOrderSummary) => {
    setSelectedOrder(order);
    setTrackingId(order.shippingTrackingId || '');
    setTrackingStatus(
      order.status === 'CONFIRMED' || order.status === 'PACKED' ? 'SHIPPED' : order.status
    );
    setTrackingModalOpen(true);
  };

  const handleSubmitTracking = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus({
        id: selectedOrder.id,
        data: {
          status: trackingStatus,
          shippingTrackingId: trackingId || undefined,
        },
      }).unwrap();
      showToast('Tracking info updated and shipment status changed.', 'success');
      setTrackingModalOpen(false);
      setSelectedOrder(null);
      setTrackingId('');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update tracking info.', 'error');
    }
  };

  const openDetailModal = (order: AdminOrderSummary) => {
    setDetailOrder(order);
    setDetailModalOpen(true);
  };

  return (
    <ShipmentManagementScreen
      orders={orders}
      allOrders={allOrders}
      pagination={pagination}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isUpdating={isUpdating}
      page={page}
      setPage={setPage}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      handleQuickStatusChange={handleQuickStatusChange}
      trackingModalOpen={trackingModalOpen}
      setTrackingModalOpen={setTrackingModalOpen}
      selectedOrder={selectedOrder}
      trackingId={trackingId}
      setTrackingId={setTrackingId}
      trackingStatus={trackingStatus}
      setTrackingStatus={setTrackingStatus}
      openTrackingModal={openTrackingModal}
      handleSubmitTracking={handleSubmitTracking}
      detailModalOpen={detailModalOpen}
      setDetailModalOpen={setDetailModalOpen}
      detailOrder={detailOrder}
      openDetailModal={openDetailModal}
      validTransitions={VALID_TRANSITIONS}
    />
  );
}

import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../../../../components/common/Toast';
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from '../../../../service/adminOrderApi';
import type { OrderStatus } from '../../../../types/order.type';
import OrderDetailsScreen from './OrderDetailsScreen';

export default function OrderDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const state = location.state as { orderId?: number } | null;
  const orderId = state?.orderId;

  // Status transition form states
  const [targetStatus, setTargetStatus] = useState<OrderStatus | ''>('');
  const [statusNotes, setStatusNotes] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Fetch order details
  const {
    data: detailData,
    isLoading,
    isError,
    error,
  } = useGetAdminOrderByIdQuery(orderId as number, { skip: !orderId });

  // Update order status mutation
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const order = detailData?.data;

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
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

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !targetStatus) return;

    try {
      await updateStatus({
        id: orderId,
        data: {
          status: targetStatus,
          notes: statusNotes || undefined,
          shippingTrackingId: targetStatus === 'SHIPPED' ? trackingId : undefined,
        },
      }).unwrap();

      showToast(`Order status updated to ${targetStatus} successfully.`, 'success');
      setShowStatusModal(false);
      setTargetStatus('');
      setStatusNotes('');
      setTrackingId('');
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Failed to update order status.', 'error');
    }
  };

  return (
    <OrderDetailsScreen
      orderId={orderId}
      order={order}
      isLoading={isLoading}
      isError={isError}
      error={error}
      targetStatus={targetStatus}
      setTargetStatus={setTargetStatus}
      statusNotes={statusNotes}
      setStatusNotes={setStatusNotes}
      trackingId={trackingId}
      setTrackingId={setTrackingId}
      showStatusModal={showStatusModal}
      setShowStatusModal={setShowStatusModal}
      isUpdating={isUpdating}
      formatDate={formatDate}
      formatDateTime={formatDateTime}
      getStatusBadgeStyle={getStatusBadgeStyle}
      getStatusDotStyle={getStatusDotStyle}
      handleStatusUpdate={handleStatusUpdate}
      navigate={navigate}
    />
  );
}

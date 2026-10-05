import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceGenerationScreen from './InvoiceGenerationScreen';
import {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
} from '../../../../service/adminOrderApi';
import { useToast } from '../../../../components/common/Toast';
import type { AdminOrderListQueryParams } from '../../../../types/AdminOrder.type';
import type { PaymentStatus } from '../../../../types/Payment.type';
import type { OrderStatus } from '../../../../types/order.type';

export type InvoiceStatus = 'Generated' | 'Pending' | 'Failed' | 'Refunded';

export interface InvoiceRow {
  id: number;
  invoiceId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  amount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  status: InvoiceStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  itemCount: number;
}

const deriveInvoiceStatus = (paymentStatus: PaymentStatus): InvoiceStatus => {
  switch (paymentStatus) {
    case 'SUCCESS':
      return 'Generated';
    case 'PENDING':
      return 'Pending';
    case 'FAILED':
      return 'Failed';
    case 'REFUNDED':
      return 'Refunded';
    default:
      return 'Pending';
  }
};

const formatPaymentMethod = (method: string): string => {
  switch (method) {
    case 'RAZORPAY':
      return 'Razorpay';
    case 'COD':
      return 'Cash on Delivery';
    default:
      return method;
  }
};

export default function InvoiceGeneration() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filter state
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Invoice detail modal state
  const [viewingOrderId, setViewingOrderId] = useState<number | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Build query params
  const queryParams: AdminOrderListQueryParams = useMemo(() => {
    const params: AdminOrderListQueryParams = { page, limit };
    if (paymentStatusFilter) {
      params.paymentStatus = paymentStatusFilter;
    }
    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }
    return params;
  }, [page, limit, paymentStatusFilter, debouncedSearch]);

  // Fetch admin orders
  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetAdminOrdersQuery(queryParams);

  // Fetch single order detail for invoice modal
  const {
    data: orderDetailResponse,
    isLoading: isDetailLoading,
  } = useGetAdminOrderByIdQuery(viewingOrderId as number, {
    skip: !viewingOrderId,
  });

  const orders = ordersResponse?.data || [];
  const pagination = ordersResponse?.pagination;
  const orderDetail = orderDetailResponse?.data;

  // Map orders to invoice rows
  const invoiceRows: InvoiceRow[] = useMemo(() => {
    return orders.map((order) => ({
      id: order.id,
      invoiceId: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      customerName: order.address?.fullName || order.customer?.name || 'N/A',
      customerEmail: order.customer?.email || '',
      date: order.createdAt,
      amount: order.totalAmount,
      subtotal: order.subtotal,
      discount: order.discountAmount,
      shipping: order.shippingCharges,
      tax: order.taxAmount,
      status: deriveInvoiceStatus(order.paymentStatus),
      paymentMethod: formatPaymentMethod(order.paymentMethod),
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      itemCount: order.items?.length || 0,
    }));
  }, [orders]);

  // Search debounce handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter handler
  const handlePaymentStatusFilterChange = useCallback((status: PaymentStatus | '') => {
    setPaymentStatusFilter(status);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [pagination]);

  const handlePrevPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  }, [pagination]);

  // Selection handlers
  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === invoiceRows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(invoiceRows.map((r) => r.id)));
    }
  }, [selectedIds, invoiceRows]);

  // Invoice view/download handler
  const handleViewInvoice = useCallback((orderId: number) => {
    setViewingOrderId(orderId);
    setShowInvoiceModal(true);
  }, []);

  const handleCloseInvoiceModal = useCallback(() => {
    setShowInvoiceModal(false);
    setViewingOrderId(null);
  }, []);

  const handlePrintInvoice = useCallback(() => {
    window.print();
  }, []);

  // Batch print handler
  const handleBatchPrint = useCallback(() => {
    if (selectedIds.size === 0) {
      showToast('Please select at least one invoice.', 'error');
      return;
    }
    showToast(`${selectedIds.size} invoice(s) queued for print. Opening first invoice...`, 'info');
    const firstId = Array.from(selectedIds)[0];
    handleViewInvoice(firstId);
  }, [selectedIds, showToast, handleViewInvoice]);

  // Navigate to order details
  const handleGoToOrderDetails = useCallback((orderId: number) => {
    navigate('/admin/orders/details', { state: { orderId } });
  }, [navigate]);

  // Date formatting
  const formatDate = useCallback((dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  }, []);

  const formatDateTime = useCallback((dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  }, []);

  // Navigate back
  const handleBack = useCallback(() => {
    navigate('/admin/orders');
  }, [navigate]);

  return (
    <InvoiceGenerationScreen
      invoices={invoiceRows}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      error={error}
      pagination={pagination}
      page={page}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      paymentStatusFilter={paymentStatusFilter}
      onPaymentStatusFilterChange={handlePaymentStatusFilterChange}
      selectedIds={selectedIds}
      onToggleSelect={handleToggleSelect}
      onSelectAll={handleSelectAll}
      onViewInvoice={handleViewInvoice}
      onBatchPrint={handleBatchPrint}
      onGoToOrderDetails={handleGoToOrderDetails}
      onNextPage={handleNextPage}
      onPrevPage={handlePrevPage}
      onBack={handleBack}
      formatDate={formatDate}
      formatDateTime={formatDateTime}
      showInvoiceModal={showInvoiceModal}
      orderDetail={orderDetail}
      isDetailLoading={isDetailLoading}
      onCloseInvoiceModal={handleCloseInvoiceModal}
      onPrintInvoice={handlePrintInvoice}
    />
  );
}

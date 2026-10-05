import { useState } from 'react';
import InventoryManagementScreen from './InventoryManagementScreen';
import {
  useGetInventoryDashboardQuery,
  useGetInventoryLogsQuery,
  useGetLowStockVariantsQuery,
  useGetVariantInventoryLogsQuery,
} from '../../../../service/adminInventoryApi';
import type { InventoryAction } from '../../../../types/Inventory.type';

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [threshold, setThreshold] = useState<number>(10);
  
  // General Logs query states
  const [logsPage, setLogsPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<InventoryAction | ''>('');

  // Selected variant for audit history logs modal
  const [selectedVariant, setSelectedVariant] = useState<{
    productId: number;
    variantId: number;
    variantSku: string;
    size: string;
    color: string;
    productName: string;
  } | null>(null);
  const [variantLogsPage, setVariantLogsPage] = useState(1);

  // Queries
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
  } = useGetInventoryDashboardQuery(threshold);

  const {
    data: logsData,
    isLoading: isLogsLoading,
    isError: isLogsError,
    error: logsError,
  } = useGetInventoryLogsQuery({
    page: logsPage,
    limit: 10,
    action: actionFilter || undefined,
  });

  const {
    data: lowStockData,
    isLoading: isLowStockLoading,
  } = useGetLowStockVariantsQuery({
    page: 1,
    limit: 10,
    threshold,
  });

  const {
    data: variantLogsData,
    isLoading: isVariantLogsLoading,
  } = useGetVariantInventoryLogsQuery(
    {
      productId: selectedVariant?.productId as number,
      variantId: selectedVariant?.variantId as number,
      page: variantLogsPage,
      limit: 5,
    },
    { skip: !selectedVariant }
  );

  return (
    <InventoryManagementScreen
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      threshold={threshold}
      setThreshold={setThreshold}
      logsPage={logsPage}
      setLogsPage={setLogsPage}
      actionFilter={actionFilter}
      setActionFilter={setActionFilter}
      selectedVariant={selectedVariant}
      setSelectedVariant={setSelectedVariant}
      variantLogsPage={variantLogsPage}
      setVariantLogsPage={setVariantLogsPage}
      dashboardData={dashboardData}
      isDashboardLoading={isDashboardLoading}
      isDashboardError={isDashboardError}
      dashboardError={dashboardError}
      logsData={logsData}
      isLogsLoading={isLogsLoading}
      isLogsError={isLogsError}
      logsError={logsError}
      lowStockData={lowStockData}
      isLowStockLoading={isLowStockLoading}
      variantLogsData={variantLogsData}
      isVariantLogsLoading={isVariantLogsLoading}
    />
  );
}

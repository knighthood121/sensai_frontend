import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import {
  Loader2,
  AlertCircle,
  X,
  Package,
  Layers,
  TrendingUp,
  TrendingDown,
  FileClock,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import type { InventoryAction } from '../../../../types/Inventory.type';

interface InventoryManagementScreenProps {
  activeTab: 'dashboard' | 'logs';
  setActiveTab: (tab: 'dashboard' | 'logs') => void;
  threshold: number;
  setThreshold: (t: number) => void;
  logsPage: number;
  setLogsPage: (p: number) => void;
  actionFilter: InventoryAction | '';
  setActionFilter: (a: InventoryAction | '') => void;
  selectedVariant: {
    productId: number;
    variantId: number;
    variantSku: string;
    size: string;
    color: string;
    productName: string;
  } | null;
  setSelectedVariant: (v: any | null) => void;
  variantLogsPage: number;
  setVariantLogsPage: (p: number) => void;
  dashboardData: any;
  isDashboardLoading: boolean;
  isDashboardError: boolean;
  dashboardError: any;
  logsData: any;
  isLogsLoading: boolean;
  isLogsError: boolean;
  logsError: any;
  lowStockData: any;
  isLowStockLoading: boolean;
  variantLogsData: any;
  isVariantLogsLoading: boolean;
}

export default function InventoryManagementScreen({
  activeTab,
  setActiveTab,
  threshold,
  setThreshold,
  logsPage,
  setLogsPage,
  actionFilter,
  setActionFilter,
  selectedVariant,
  setSelectedVariant,
  variantLogsPage,
  setVariantLogsPage,
  dashboardData,
  isDashboardLoading,
  isDashboardError,
  dashboardError,
  logsData,
  isLogsLoading,
  isLogsError,
  logsError,
  lowStockData,
  isLowStockLoading,
  variantLogsData,
  isVariantLogsLoading,
}: InventoryManagementScreenProps) {
  const navigate = useNavigate();

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

  const getActionBadgeStyle = (action: InventoryAction) => {
    switch (action) {
      case 'IN':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'OUT':
        return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
      case 'RETURN':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'CANCELLED':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      case 'MANUAL':
        return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-650/20';
    }
  };

  const dashboardSummary = dashboardData?.data?.summary;
  const dashboardActivity = dashboardData?.data?.recentActivity;
  const lowStockVariants = lowStockData?.data?.variants || [];
  const logs = logsData?.data || [];
  const pagination = logsData?.pagination;

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }} className="relative">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Inventory Management</h1>
            <p className="text-sm text-gray-500">Monitor stock levels, view low stock alerts and audit historical changes.</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        /* --- DASHBOARD TAB --- */
        <div className="space-y-6">
          {isDashboardLoading ? (
            <div className="bg-white rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center" style={{ borderColor: COLORS.border }}>
              <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading summary...</p>
            </div>
          ) : isDashboardError ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-900 mb-1">Failed to Load Dashboard</h3>
              <p className="text-red-700 text-sm mb-6">{(dashboardError as any)?.data?.message || 'Failed to connect to backend inventory services.'}</p>
              <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
            </div>
          ) : (
            <>
              {/* Summary statistics grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Stock', value: dashboardSummary?.totalStock || 0, sub: `${dashboardSummary?.totalVariants || 0} Variants`, icon: <Package size={22} className="text-blue-500" /> },
                  { label: 'Reserved Stock', value: dashboardSummary?.totalReserved || 0, sub: 'Allocated to orders', icon: <Layers size={22} className="text-amber-500" /> },
                  { label: 'Available Stock', value: dashboardSummary?.totalAvailable || 0, sub: 'Ready for shelf', icon: <TrendingUp size={22} className="text-emerald-500" /> },
                  { label: 'Low Stock Warnings', value: dashboardSummary?.lowStockVariants || 0, sub: `Threshold: ${threshold}`, icon: <TrendingDown size={22} className="text-rose-500" /> },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md flex items-start justify-between"
                    style={{ borderColor: COLORS.border }}
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: COLORS.textLight }}>
                        {stat.label}
                      </p>
                      <p className="text-3xl font-black mb-1 text-gray-900" style={{ fontFamily: FONTS.heading }}>
                        {stat.value}
                      </p>
                      <span className="text-[11px] font-semibold text-gray-400">{stat.sub}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Threshold control card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: COLORS.border }}>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-gray-900">Configure Stock Alerts</h3>
                  <p className="text-xs text-gray-500 font-medium">Set a global threshold value. Variants with stock levels equal to or below this value will trigger alert warnings.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label htmlFor="threshold" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alert Threshold:</label>
                  <input
                    id="threshold"
                    type="number"
                    min={1}
                    max={100}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 border border-gray-250 rounded-xl text-center font-bold text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Alerts & Recents dual column panel */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Low Stock Alerts (col-span-2) */}
                <div className="xl:col-span-2 bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ borderColor: COLORS.border }}>
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-55/30 flex justify-between items-center">
                    <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <TrendingDown size={18} className="text-rose-500" /> Low Stock Alerts
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-1 rounded-full">
                      {lowStockVariants.length} Warnings
                    </span>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    {isLowStockLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
                        <p className="text-xs text-gray-400 font-bold uppercase">Loading alerts...</p>
                      </div>
                    ) : lowStockVariants.length === 0 ? (
                      <div className="py-20 text-center">
                        <span className="text-3xl block mb-2">🎉</span>
                        <p className="font-bold text-sm text-gray-900">All products fully stocked</p>
                        <p className="text-xs text-gray-450 mt-1">There are currently no items matching or below the warning threshold.</p>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50/50 text-left border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="px-6 py-3.5">Product Name</th>
                            <th className="px-6 py-3.5">SKU</th>
                            <th className="px-6 py-3.5">Size/Color</th>
                            <th className="px-6 py-3.5 text-center">Stock</th>
                            <th className="px-6 py-3.5 text-center">Reserved</th>
                            <th className="px-6 py-3.5 text-center">Available</th>
                            <th className="px-6 py-3.5 text-right">Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {lowStockVariants.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-bold text-sm text-gray-900 leading-snug truncate max-w-[200px]">{item.productName}</p>
                              </td>
                              <td className="px-6 py-4 font-mono text-xs text-gray-600">{item.sku}</td>
                              <td className="px-6 py-4 font-bold text-xs text-gray-400 uppercase tracking-wide">
                                {item.size} / {item.color}
                              </td>
                              <td className="px-6 py-4 text-center text-gray-900 font-bold">{item.stock}</td>
                              <td className="px-6 py-4 text-center text-amber-500 font-bold">{item.reservedStock}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`font-black text-sm ${item.availableStock <= 0 ? 'text-red-600' : 'text-rose-500'}`}>
                                  {item.availableStock}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedVariant({
                                    productId: item.productId,
                                    variantId: item.id,
                                    variantSku: item.sku,
                                    size: item.size,
                                    color: item.color,
                                    productName: item.productName,
                                  })}
                                  className="text-pink-500 hover:text-pink-600 font-bold text-xs hover:underline flex items-center justify-end gap-1 cursor-pointer"
                                >
                                  Logs <ExternalLink size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Recent activity summary (col-span-1) */}
                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ borderColor: COLORS.border }}>
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-55/30">
                    <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                      <FileClock size={18} className="text-pink-500" /> Recent Actions Summary
                    </h3>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                    {dashboardActivity?.byAction && Object.keys(dashboardActivity.byAction).length > 0 ? (
                      Object.entries(dashboardActivity.byAction).map(([action, stats]: [string, any]) => (
                        <div key={action} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                          <div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getActionBadgeStyle(action as any)}`}>
                              {action}
                            </span>
                            <p className="text-[10px] text-gray-400 font-semibold mt-1">Actions log records count: {stats.count}</p>
                          </div>
                          <span className="font-black text-sm text-gray-900">
                            {stats.totalQty > 0 ? `+${stats.totalQty}` : stats.totalQty} units
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No recent actions logged</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      ) : (
        /* --- AUDIT LOGS TAB --- */
        <div className="space-y-6">
          {/* Filters Row */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-wrap gap-4 items-center justify-between" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center gap-3">
              <label htmlFor="action" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter Action:</label>
              <select
                id="action"
                className="px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold outline-none cursor-pointer"
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value as any);
                  setLogsPage(1);
                }}
              >
                <option value="">All Actions</option>
                <option value="IN">IN (Stock Added)</option>
                <option value="OUT">OUT (Stock Deducted)</option>
                <option value="RETURN">RETURN (Return Restored)</option>
                <option value="CANCELLED">CANCELLED (Release Reserve)</option>
                <option value="MANUAL">MANUAL (Manual Adjustment)</option>
              </select>
            </div>
            
            <div className="text-xs text-gray-450 font-semibold">
              Auditing changes logs list view
            </div>
          </div>

          {/* Audit Logs Table */}
          {isLogsLoading ? (
            <div className="bg-white rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center" style={{ borderColor: COLORS.border }}>
              <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading audit logs...</p>
            </div>
          ) : isLogsError ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-900 mb-1">Failed to Load Logs</h3>
              <p className="text-red-700 text-sm mb-6">{(logsError as any)?.data?.message || 'An unexpected error occurred while loading audit logs.'}</p>
              <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/50 text-left border-b border-gray-250 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Product / Details</th>
                      <th className="px-6 py-4">Variant SKU</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4 text-center">Qty Changed</th>
                      <th className="px-6 py-4 text-center">Fulfillment Step (Prev &rarr; New)</th>
                      <th className="px-6 py-4">Reference & Notes</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.length > 0 ? (
                      logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-xs text-gray-400 font-medium whitespace-nowrap">
                            {formatDateTime(log.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm text-gray-900 leading-snug truncate max-w-[180px]" title={log.productName || 'Product deleted'}>
                              {log.productName || 'Product deleted'}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                              Size: {log.variantSize || 'N/A'} &bull; Color: {log.variantColor || 'N/A'}
                            </p>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">{log.variantSku || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getActionBadgeStyle(log.action)}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-center font-bold text-sm whitespace-nowrap ${
                            log.action === 'IN' || log.action === 'RETURN' ? 'text-emerald-600' : 'text-rose-500'
                          }`}>
                            {log.action === 'IN' || log.action === 'RETURN' ? `+${log.quantityChanged}` : `-${log.quantityChanged}`}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-xs text-gray-500 whitespace-nowrap">
                            {log.previousStock} &rarr; <span className="text-gray-900">{log.newStock}</span>
                          </td>
                          <td className="px-6 py-4 max-w-[200px]">
                            {log.reference && <p className="font-bold text-xs text-gray-900 font-mono mb-0.5">{log.reference}</p>}
                            <p className="text-xs text-gray-450 font-medium leading-relaxed truncate" title={log.notes || undefined}>{log.notes || 'No description notes.'}</p>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedVariant({
                                productId: log.productId,
                                variantId: log.variantId,
                                variantSku: log.variantSku || 'Variant',
                                size: log.variantSize || 'N/A',
                                color: log.variantColor || 'N/A',
                                productName: log.productName || 'Product',
                              })}
                              className="text-pink-500 hover:text-pink-600 font-bold text-xs hover:underline flex items-center justify-end gap-1 cursor-pointer"
                            >
                              Audit <ExternalLink size={12} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center text-gray-450">
                          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="font-bold text-sm text-gray-900">No logs matching filter</p>
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
                    Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries total)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogsPage(Math.max(logsPage - 1, 1))}
                      disabled={!pagination.hasPreviousPage}
                      className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setLogsPage(Math.min(logsPage + 1, pagination.totalPages))}
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
      )}

      {/* --- Variant Stock History Modal --- */}
      {selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => {
              setSelectedVariant(null);
              setVariantLogsPage(1);
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl z-10 border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between z-20">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight" style={{ fontFamily: FONTS.heading }}>
                  Variant Audit History
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5 leading-snug">
                  {selectedVariant.productName} &bull; Size: {selectedVariant.size} &bull; Color: {selectedVariant.color}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedVariant(null);
                  setVariantLogsPage(1);
                }}
                className="p-2 hover:bg-gray-50 rounded-full border border-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
              {isVariantLogsLoading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
                  <p className="text-xs text-gray-405 font-bold uppercase tracking-wider">Loading variant logs...</p>
                </div>
              ) : !variantLogsData?.data || variantLogsData.data.logs.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-900">No stock updates logged</p>
                  <p className="text-xs text-gray-450 mt-1">This variant doesn't have any logged transactions yet.</p>
                </div>
              ) : (
                (() => {
                  const varInfo = variantLogsData.data.variant;
                  const varLogs = variantLogsData.data.logs;
                  const varPagination = variantLogsData.data.pagination;

                  return (
                    <div className="space-y-6">
                      {/* Current Stock Metrics Banner */}
                      <div className="grid grid-cols-3 gap-4 bg-[#FAFBFD] border border-gray-100 rounded-2xl p-4 text-center font-bold">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total On-hand</p>
                          <p className="text-lg text-gray-900">{varInfo.stock}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Reserved</p>
                          <p className="text-lg text-amber-500">{varInfo.reservedStock}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Available</p>
                          <p className="text-lg text-emerald-600">{varInfo.availableStock}</p>
                        </div>
                      </div>

                      {/* Stepper Timeline */}
                      <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pt-2">
                        {varLogs.map((log: any, index: number) => (
                          <div key={log.id} className="relative pl-6">
                            {/* Connector dot */}
                            <span className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                              index === 0 ? 'border-pink-500 scale-110 shadow-sm' : 'border-gray-300'
                            }`} />
                            
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getActionBadgeStyle(log.action)}`}>
                                    {log.action}
                                  </span>
                                  <span className={`font-black text-xs ${
                                    log.action === 'IN' || log.action === 'RETURN' ? 'text-emerald-600' : 'text-rose-500'
                                  }`}>
                                    {log.action === 'IN' || log.action === 'RETURN' ? `+${log.quantityChanged}` : `-${log.quantityChanged}`} units
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-semibold mt-1">{formatDateTime(log.createdAt)}</p>
                                {log.notes && (
                                  <p className="text-xs text-gray-600 font-medium leading-relaxed bg-[#FAFBFD] border border-gray-100 rounded-xl p-2.5 mt-2">
                                    {log.notes}
                                  </p>
                                )}
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-gray-400 uppercase font-black">Stock levels</span>
                                <p className="font-bold text-xs text-gray-600 mt-0.5">
                                  {log.previousStock} &rarr; <span className="text-gray-900">{log.newStock}</span>
                                </p>
                                {log.reference && (
                                  <p className="text-[9px] font-bold text-pink-500 font-mono mt-1 uppercase bg-pink-50 border border-pink-100/50 px-2 py-0.5 rounded-md inline-block">
                                    Ref: {log.reference}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Modal Pagination */}
                      {varPagination && varPagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 pt-6 border-t border-gray-100">
                          <button
                            onClick={() => setVariantLogsPage(Math.max(variantLogsPage - 1, 1))}
                            disabled={variantLogsPage === 1}
                            className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            Previous
                          </button>
                          <span className="text-xs text-gray-500 font-semibold">
                            Page {variantLogsPage} of {varPagination.totalPages}
                          </span>
                          <button
                            onClick={() => setVariantLogsPage(Math.min(variantLogsPage + 1, varPagination.totalPages))}
                            disabled={variantLogsPage === varPagination.totalPages}
                            className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

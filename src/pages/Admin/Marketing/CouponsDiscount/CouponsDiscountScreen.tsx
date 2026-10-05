import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import Modal from '../../../../components/common/Modal';
import Loader from '../../../../components/common/Loader';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import type { Coupon } from '../../../../types/Coupon.type';
import type { CouponsDiscountScreenProps } from './index';

export default function CouponsDiscountScreen({
  coupons,
  isLoading,
  error,
  isOpen,
  setIsOpen,
  editingCoupon,
  formError,
  code,
  setCode,
  description,
  setDescription,
  couponType,
  setCouponType,
  discountValue,
  setDiscountValue,
  maxDiscount,
  setMaxDiscount,
  minOrderAmount,
  setMinOrderAmount,
  maxUsagePerUser,
  setMaxUsagePerUser,
  maxTotalUsage,
  setMaxTotalUsage,
  expiresAt,
  setExpiresAt,
  isActive,
  setIsActive,
  handleOpenCreate,
  handleOpenEdit,
  handleSubmit,
  handleToggleStatus,
  handleDelete,
  isCreating,
  isUpdating,
  onBack,
}: CouponsDiscountScreenProps) {

  const formatDiscount = (type: 'PERCENTAGE' | 'FIXED', value: number) => {
    return type === 'PERCENTAGE' ? `${value}% OFF` : `$${value} OFF`;
  };

  const getStatusBadge = (coupon: Coupon) => {
    const isExpired = coupon.expiresAt ? new Date(coupon.expiresAt) < new Date() : false;
    if (!coupon.isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 ring-1 ring-gray-600/20">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          Inactive
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 ring-1 ring-rose-600/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  };

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>

      {/* Back navigation button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Coupons & Discounts</h1>
          <p className="text-sm text-gray-500 mt-1">Create and distribute promotional codes and discount rules.</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform"
        >
          + Create Coupon
        </Button>
      </div>

      {/* Main Content Layout */}
      {isLoading ? (
        <div className="py-20 bg-white rounded-2xl border shadow-sm flex justify-center items-center" style={{ borderColor: COLORS.border }}>
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="mb-6">
          <ErrorMessage message="Failed to fetch coupons. Please try reloading the page." />
        </div>
      ) : coupons.length === 0 ? (
        <EmptyState
          title="No Coupons Found"
          description="Create your first discount coupon code to share with your customers and drive sales!"
          icon="🎫"
          action={
            <Button variant="primary" size="md" onClick={handleOpenCreate}>
              Create Coupon
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>

          {/* Header of Table */}
          <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: COLORS.primary + '15', color: COLORS.primary }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ fontFamily: FONTS.heading }}>
                Discount Coupons ({coupons.length})
              </h3>
              <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                Active promotion rules for your e-commerce platform.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Code</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Discount</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Usage</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell text-gray-500">Expiry</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded border border-pink-100">{coupon.code}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{formatDiscount(coupon.couponType, coupon.discountValue)}</p>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{coupon.couponType === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell">
                      <span className="font-bold text-gray-900">{coupon.totalUsed}</span> / <span className="text-gray-400 font-semibold">{coupon.maxTotalUsage ?? '∞'}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No Expiry'}
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="px-5 py-4 text-right space-x-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(coupon)}
                        className="text-pink-600 hover:text-pink-700 font-bold text-xs uppercase tracking-wider cursor-pointer focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(coupon)}
                        className={`${coupon.isActive ? 'text-gray-500 hover:text-gray-750' : 'text-emerald-600 hover:text-emerald-700'} font-bold text-xs uppercase tracking-wider cursor-pointer focus:outline-none`}
                      >
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(coupon.id)}
                        className="text-rose-600 hover:text-rose-700 font-bold text-xs uppercase tracking-wider cursor-pointer focus:outline-none"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">

          {/* Modal local error message */}
          {formError && (
            <div
              className="mb-4 px-4 py-3 rounded-2xl text-xs font-semibold text-center w-full"
              style={{
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
              }}
            >
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Coupon Code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER50"
              disabled={!!editingCoupon}
            />

            <div className="w-full">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1 text-gray-400">
                Discount Type
              </label>
              <select
                value={couponType}
                onChange={(e) => setCouponType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none bg-white text-sm"
                style={{ borderColor: COLORS.border }}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Discount Value"
              type="number"
              required
              min="1"
              value={discountValue || ''}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              placeholder={couponType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 50'}
            />

            <Input
              label="Usage Limit (Optional)"
              type="number"
              min="1"
              value={maxTotalUsage}
              onChange={(e) => setMaxTotalUsage(e.target.value)}
              placeholder="e.g. 100 (Infinite if blank)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Min Order Amount ($)"
              type="number"
              min="0"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              placeholder="e.g. 100"
            />

            <Input
              label="Max Discount ($)"
              type="number"
              min="0"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              placeholder="e.g. 50"
              disabled={couponType === 'FIXED'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Max Usage Per User"
              type="number"
              min="1"
              value={maxUsagePerUser}
              onChange={(e) => setMaxUsagePerUser(e.target.value)}
              placeholder="e.g. 1"
            />

            <Input
              label="Expiration Date"
              type="date"
              required
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1 text-gray-400">
              Description (Optional)
            </label>
            <textarea
              className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none resize-none text-sm bg-white"
              style={{ borderColor: COLORS.border, minHeight: '80px' }}
              placeholder="Enter coupon terms or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Toggle Active status checkbox */}
          <div className="flex items-center gap-2 py-2 px-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-pink-500"
            />
            <label htmlFor="isActive" className="text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer">
              Coupon is Active
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
}

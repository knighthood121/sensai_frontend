import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import Modal from '../../../../components/common/Modal';
import Loader from '../../../../components/common/Loader';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import type { VariantScreenProps } from './index';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getStockStatus = (available: number, total: number) => {
  if (available <= 0) return { label: 'Out of Stock', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', ring: 'ring-rose-600/20' };
  if (available <= Math.max(total * 0.15, 3)) return { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', ring: 'ring-amber-600/20' };
  return { label: 'In Stock', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-600/20' };
};

const FormError = ({ message }: { message: string }) =>
  message ? (
    <div
      className="mb-4 px-4 py-3 rounded-2xl text-xs font-semibold text-center w-full"
      style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
    >
      {message}
    </div>
  ) : null;

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProductVariantsScreen(props: VariantScreenProps) {
  const navigate = useNavigate();

  const {
    searchQuery, onSearchChange, searchResults, isSearching,
    selectedProduct, onSelectProduct, onClearProduct,
    variants, isLoadingVariants, variantsError,
    stockSummary, isLoadingStockSummary,
    isCreateOpen, onOpenCreate, onCloseCreate,
    createForm, onAddCreateRow, onRemoveCreateRow, onCreateFieldChange,
    onSubmitCreate, isCreating, createError,
    isEditOpen, editingVariant, onOpenEdit, onCloseEdit,
    editForm, onEditFieldChange, onSubmitEdit, isUpdating, editError,
    isStockOpen, stockVariant, onOpenStock, onCloseStock,
    stockForm, onStockFieldChange, onSubmitStock, isAdjustingStock, stockError,
    onDelete, isDeleting,
    inventoryActions,
    distinctSizes,
    distinctColors,
  } = props;

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>

      {/* ── Back Button ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          style={{ borderColor: COLORS.border }}
          title="Go Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* ── Page Title ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Product Variants</h1>
          <p className="text-sm text-gray-500 mt-1">Manage sizes, colors, SKUs and stock for each product variant.</p>
        </div>
        {selectedProduct && (
          <Button
            variant="primary"
            size="md"
            onClick={onOpenCreate}
            className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform"
          >
            + Add Variant
          </Button>
        )}
      </div>

      {/* ── Product Selector ─────────────────────────────────────────────── */}
      {!selectedProduct ? (
        <ProductSelector
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchResults={searchResults}
          isSearching={isSearching}
          onSelectProduct={onSelectProduct}
        />
      ) : (
        <>
          {/* ── Selected Product Header ──────────────────────────────────── */}
          <SelectedProductHeader product={selectedProduct} onClear={onClearProduct} />

          {/* ── Stock Summary Cards ──────────────────────────────────────── */}
          {isLoadingStockSummary ? (
            <div className="py-10 flex justify-center"><Loader size="lg" /></div>
          ) : stockSummary ? (
            <StockSummaryCards
              totalStock={stockSummary.totalStock}
              reserved={stockSummary.totalReservedStock}
              available={stockSummary.totalAvailableStock}
              inStock={stockSummary.inStock}
            />
          ) : null}

          {/* ── Variants Table ───────────────────────────────────────────── */}
          {isLoadingVariants ? (
            <div className="py-20 bg-white rounded-2xl border shadow-sm flex justify-center items-center" style={{ borderColor: COLORS.border }}>
              <Loader size="lg" />
            </div>
          ) : variantsError ? (
            <ErrorMessage message="Failed to load variants. Please try again." />
          ) : variants.length === 0 ? (
            <EmptyState
              title="No Variants Found"
              description="This product has no variants yet. Add your first size/color combination to get started."
              icon="🧬"
              action={
                <Button variant="primary" size="md" onClick={onOpenCreate}>
                  + Add First Variant
                </Button>
              }
            />
          ) : (
            <VariantsTable
              variants={variants}
              onEdit={onOpenEdit}
              onStock={onOpenStock}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          )}
        </>
      )}

      {/* ── Create Variant Modal ─────────────────────────────────────────── */}
      <Modal isOpen={isCreateOpen} onClose={onCloseCreate} title="Add Variant(s)">
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmitCreate(); }}
          className="space-y-4 pt-2"
        >
          <FormError message={createError} />

          {createForm.items.map((item, idx) => (
            <div key={idx} className="relative border rounded-2xl p-4 space-y-3" style={{ borderColor: COLORS.border }}>
              {createForm.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveCreateRow(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold shadow hover:bg-rose-600 cursor-pointer transition-colors"
                  title="Remove row"
                >
                  ×
                </button>
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Variant {idx + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Size"
                  required
                  value={item.size}
                  onChange={(e) => onCreateFieldChange(idx, 'size', e.target.value)}
                  placeholder="e.g. M"
                  list="distinct-sizes"
                />
                <Input
                  label="Color"
                  required
                  value={item.color}
                  onChange={(e) => onCreateFieldChange(idx, 'color', e.target.value)}
                  placeholder="e.g. Black"
                  list="distinct-colors"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="SKU"
                  required
                  value={item.sku}
                  onChange={(e) => onCreateFieldChange(idx, 'sku', e.target.value)}
                  placeholder="e.g. TEE-BLK-M"
                />
                <Input
                  label="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price !== null && item.price !== undefined ? item.price : ''}
                  onChange={(e) => onCreateFieldChange(idx, 'price', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Optional"
                />
                <Input
                  label="Stock"
                  type="number"
                  min="0"
                  value={item.stock ?? 0}
                  onChange={(e) => onCreateFieldChange(idx, 'stock', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={onAddCreateRow}
            className="w-full py-3 border-2 border-dashed rounded-2xl text-sm font-bold text-gray-400 hover:text-pink-500 hover:border-pink-300 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
          >
            + Add Another Variant
          </button>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCloseCreate}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isCreating}>
              {isCreating ? 'Creating...' : `Create ${createForm.items.length} Variant(s)`}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Variant Modal ───────────────────────────────────────────── */}
      <Modal isOpen={isEditOpen} onClose={onCloseEdit} title="Edit Variant">
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmitEdit(); }}
          className="space-y-4 pt-2"
        >
          <FormError message={editError} />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Size"
              required
              value={editForm.size}
              onChange={(e) => onEditFieldChange('size', e.target.value)}
              placeholder="e.g. M"
              list="distinct-sizes"
            />
            <Input
              label="Color"
              required
              value={editForm.color}
              onChange={(e) => onEditFieldChange('color', e.target.value)}
              placeholder="e.g. Black"
              list="distinct-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="SKU"
              required
              value={editForm.sku}
              onChange={(e) => onEditFieldChange('sku', e.target.value)}
              placeholder="e.g. TEE-BLK-M"
            />
            <Input
              label="Price"
              type="number"
              min="0"
              step="0.01"
              value={editForm.price}
              onChange={(e) => onEditFieldChange('price', e.target.value)}
              placeholder="Optional"
            />
            <Input
              label="Stock"
              type="number"
              min="0"
              value={editForm.stock}
              onChange={(e) => onEditFieldChange('stock', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCloseEdit}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Update Variant'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Stock Adjustment Modal ───────────────────────────────────────── */}
      <Modal isOpen={isStockOpen} onClose={onCloseStock} title="Stock Adjustment">
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmitStock(); }}
          className="space-y-4 pt-2"
        >
          <FormError message={stockError} />

          {stockVariant && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border" style={{ borderColor: COLORS.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: COLORS.primary + '15', color: COLORS.primary }}>
                📦
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{stockVariant.sku}</p>
                <p className="text-xs text-gray-500">{stockVariant.size} / {stockVariant.color} — Current Stock: <span className="font-bold text-gray-900">{stockVariant.stock}</span></p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1 text-gray-400">
                Action
              </label>
              <select
                value={stockForm.action}
                onChange={(e) => onStockFieldChange('action', e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none bg-white text-sm"
                style={{ borderColor: COLORS.border }}
              >
                {inventoryActions.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="Quantity"
              type="number"
              required
              min="1"
              value={stockForm.quantity}
              onChange={(e) => onStockFieldChange('quantity', e.target.value)}
              placeholder="e.g. 10"
            />
          </div>

          <Input
            label="Reference (Optional)"
            value={stockForm.reference}
            onChange={(e) => onStockFieldChange('reference', e.target.value)}
            placeholder="e.g. PO-2024-001"
          />

          <div className="w-full">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1 text-gray-400">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none resize-none text-sm bg-white"
              style={{ borderColor: COLORS.border, minHeight: '70px' }}
              placeholder="Add stock adjustment notes..."
              value={stockForm.notes}
              onChange={(e) => onStockFieldChange('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCloseStock}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isAdjustingStock}>
              {isAdjustingStock ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </form>
      </Modal>

      <datalist id="distinct-sizes">
        {distinctSizes?.map((size) => (
          <option key={size} value={size} />
        ))}
      </datalist>
      <datalist id="distinct-colors">
        {distinctColors?.map((color) => (
          <option key={color} value={color} />
        ))}
      </datalist>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProductSelector({
  searchQuery, onSearchChange, searchResults, isSearching, onSelectProduct,
}: Pick<VariantScreenProps, 'searchQuery' | 'onSearchChange' | 'searchResults' | 'isSearching' | 'onSelectProduct'>) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border shadow-sm p-8" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: COLORS.primary + '15', color: COLORS.primary }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ fontFamily: FONTS.heading }}>Select a Product</h3>
            <p className="text-xs text-gray-500">Search by product name to manage its variants</p>
          </div>
        </div>

        <div className="relative">
          <Input
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            rightElement={
              isSearching ? (
                <div className="w-4 h-4 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )
            }
          />

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl z-20 max-h-[320px] overflow-y-auto"
              style={{ borderColor: COLORS.border }}
            >
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product as any)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-pink-50/50 transition-colors cursor-pointer border-b last:border-0 text-left"
                  style={{ borderColor: COLORS.border }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border" style={{ borderColor: COLORS.border }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">📷</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">SKU: {product.sku}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 shrink-0">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Empty search result */}
          {searchQuery.trim().length > 0 && searchResults.length === 0 && !isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl z-20 px-6 py-8 text-center" style={{ borderColor: COLORS.border }}>
              <p className="text-gray-400 text-sm font-semibold">No products found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectedProductHeader({ product, onClear }: { product: any; onClear: () => void }) {
  const image = product.images?.[0]?.imageUrl ?? null;
  return (
    <div className="bg-white rounded-2xl border shadow-sm px-6 py-5 mb-6 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border" style={{ borderColor: COLORS.border }}>
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📷</div>
          )}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: FONTS.heading }}>{product.name}</h3>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">SKU: {product.sku} · ID: {product.id}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-rose-600 hover:bg-rose-50 border transition-all cursor-pointer"
        style={{ borderColor: COLORS.border }}
      >
        Change Product
      </button>
    </div>
  );
}

function StockSummaryCards({
  totalStock, reserved, available, inStock,
}: { totalStock: number; reserved: number; available: number; inStock: boolean }) {
  const cards = [
    {
      label: 'Total Stock',
      value: totalStock,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
        </svg>
      ),
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600',
      shadow: 'shadow-blue-500/10',
    },
    {
      label: 'Reserved',
      value: reserved,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      textColor: 'text-amber-600',
      shadow: 'shadow-amber-500/10',
    },
    {
      label: 'Available',
      value: available,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      shadow: 'shadow-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${card.shadow}`}
          style={{ borderColor: COLORS.border }}
        >
          <div className="px-6 py-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.textColor}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">{card.label}</p>
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: FONTS.heading }}>{card.value.toLocaleString()}</p>
            </div>
          </div>
          <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
        </div>
      ))}
    </div>
  );
}

function VariantsTable({
  variants, onEdit, onStock, onDelete, isDeleting,
}: {
  variants: VariantScreenProps['variants'];
  onEdit: VariantScreenProps['onOpenEdit'];
  onStock: VariantScreenProps['onOpenStock'];
  onDelete: VariantScreenProps['onDelete'];
  isDeleting: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>

      {/* Table Header */}
      <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: COLORS.primary + '15', color: COLORS.primary }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ fontFamily: FONTS.heading }}>
            Variants ({variants.length})
          </h3>
          <p className="text-xs mt-0.5" style={{ color: COLORS.textLight }}>
            All size and color combinations for this product
          </p>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Size</th>
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Color</th>
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">SKU</th>
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">Price</th>
              <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Stock</th>
              <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">Reserved</th>
              <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">Available</th>
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {variants.map((v) => {
              const status = getStockStatus(v.availableStock, v.stock);
              return (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                      {v.size}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300 shadow-sm shrink-0"
                        style={{ backgroundColor: v.color.toLowerCase() }}
                        title={v.color}
                      />
                      <span className="text-sm font-semibold text-gray-700">{v.color}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded border border-pink-100">
                      {v.sku}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="font-bold text-gray-900">
                      {v.price !== null ? `₹${v.price.toLocaleString()}` : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold text-gray-900">{v.stock}</span>
                  </td>
                  <td className="px-5 py-4 text-center hidden lg:table-cell">
                    <span className="font-semibold text-amber-600">{v.reservedStock}</span>
                  </td>
                  <td className="px-5 py-4 text-center hidden lg:table-cell">
                    <span className="font-bold text-emerald-600">{v.availableStock}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text} ring-1 ${status.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(v)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                        title="Edit Variant"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onStock(v)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Adjust Stock"
                      >
                        Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(v)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-40"
                        title="Delete Variant"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import type { ProductListScreenProps } from './index';

export default function ProductListScreen({
  products,
  isLoading,
  productToDelete,
  setProductToDelete,
  deleteError,
  setDeleteError,
  handleDeleteConfirm,
  isDeleting,
  onAddProduct,
  onEditProduct,
  onBack,
}: ProductListScreenProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-pink-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
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
          <h2 className="text-xl font-bold" style={{ fontFamily: FONTS.heading }}>
            Product Catalog
          </h2>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.textLight }}
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-4 focus:ring-pink-100"
              style={{ borderColor: COLORS.border }}
              placeholder="Search products..."
              onFocus={(e) => { e.target.style.borderColor = COLORS.primary; }}
              onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
            />
          </div>
        </div>
        <Button variant="primary" size="md" onClick={onAddProduct} className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform">
          + Add Product
        </Button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 transition-colors">
                <th className="px-5 py-4 w-12 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer" />
                </th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Category</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Price</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell text-gray-500">Stock</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden lg:table-cell text-gray-500">Status</th>
                <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => {
                  const available = product.availableStock ?? 0;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                            <img src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 group-hover:text-pink-600 transition-colors">{product.name}</p>
                            <p className="text-xs mt-0.5 md:hidden text-gray-500">{product.category?.name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-sm text-gray-900">
                        ₹{product.sellingPrice}
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${available > 50 ? 'bg-emerald-500' : available > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(100, (available / 200) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{available}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.isActive && available > 50 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' :
                            product.isActive && available > 0 ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' :
                              'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${product.isActive && available > 50 ? 'bg-emerald-500' :
                            product.isActive && available > 0 ? 'bg-amber-500' :
                              'bg-rose-500'
                            }`} />
                          {!product.isActive ? 'Inactive' : available > 50 ? 'Active' : available > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
                            onClick={() => onEditProduct(product.id)}
                            title="Edit Product"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-gray-400 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
                            onClick={() => setProductToDelete(product)}
                            title="Delete Product"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: COLORS.primary + '12', color: COLORS.primary }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                    </div>
                    <p className="font-bold text-base mb-1">No products yet</p>
                    <p className="text-xs mb-4 text-gray-500">Start by adding your first product</p>
                    <Button variant="primary" size="sm" onClick={onAddProduct}>+ Add Your First Product</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
          <div
            className="bg-white rounded-2xl border max-w-md w-full p-6 shadow-2xl transition-transform transform duration-350"
            style={{ borderColor: COLORS.border }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950" style={{ fontFamily: FONTS.heading }}>
                  Delete Product?
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-gray-900 font-bold">"{productToDelete.name}"</strong>? This will permanently remove the product listing and all associated inventory variants.
            </p>

            {deleteError && (
              <div className="mb-4 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteError('');
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all bg-rose-600 hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

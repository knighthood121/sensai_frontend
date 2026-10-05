import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import type { CategoriesManagementScreenProps } from './index';

export default function CategoriesManagementScreen({
  onBack,
  activeCategoryId,
  setActiveCategoryId,
  activeCategory,
  categories,
  isCategoriesLoading,
  subCategories,
  isSubCategoriesLoading,
  catModalOpen,
  setCatModalOpen,
  catFormMode,
  catName,
  setCatName,
  catSlug,
  setCatSlug,
  catDescription,
  setCatDescription,
  catImage,
  setCatImage,
  catDisplayOrder,
  setCatDisplayOrder,
  catIsActive,
  setCatIsActive,
  subModalOpen,
  setSubModalOpen,
  subFormMode,
  subName,
  setSubName,
  subSlug,
  setSubSlug,
  subDescription,
  setSubDescription,
  subImage,
  setSubImage,
  subIsActive,
  setSubIsActive,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  deleteType,
  handleOpenCategoryModal,
  handleCategorySubmit,
  handleOpenSubCategoryModal,
  handleSubCategorySubmit,
  handleOpenDeleteConfirm,
  handleDeleteConfirm,
  isSaving,
  isDeleting,
}: CategoriesManagementScreenProps) {
  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }} className="max-w-7xl mx-auto py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
          <div>
            <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: FONTS.heading }}>Categories & Subcategories</h2>
            <p className="text-xs text-gray-400 mt-0.5">Organize product catalogues and display levels</p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="rounded-xl px-5 font-bold uppercase tracking-wider text-xs bg-pink-500 hover:bg-pink-400 border border-pink-400/50 py-3 shadow-[0_4px_12px_rgba(236,72,153,0.15)] cursor-pointer !bg-pink-500"
          onClick={() => handleOpenCategoryModal('create')}
        >
          + Add Category
        </Button>
      </div>

      {isCategoriesLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-[32px] border-dashed border-gray-150">
          <h4 className="text-xl font-bold mb-1">No categories found</h4>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Get started by creating your first product category list.</p>
          <Button onClick={() => handleOpenCategoryModal('create')}>+ Create Category</Button>
        </div>
      ) : (
        /* Two Column Master-Detail view */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Categories Master List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 px-1">Categories ({categories.length})</h3>
            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
              {categories.map((cat, i) => {
                const isSelected = cat.id === activeCategoryId;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`flex items-center justify-between px-6 py-5 cursor-pointer transition-all duration-300 border-l-4 ${isSelected
                        ? 'bg-pink-500/5 border-pink-500'
                        : 'border-transparent hover:bg-gray-50/60'
                      }`}
                    style={{ borderBottom: i < categories.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${isSelected ? 'bg-pink-500 text-white scale-105 shadow-md shadow-pink-500/20' : 'bg-pink-50 text-pink-500'
                          }`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <circle cx="7.5" cy="7.5" r="1" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900 truncate">{cat.name}</p>
                          {!cat.isActive && (
                            <span className="text-[8px] bg-amber-50 border border-amber-200 text-amber-600 px-1 rounded font-black uppercase tracking-wider">Inactive</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                          {cat.subCategoryCount || 0} Subcategories &bull; {cat.productCount || 0} Products
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenCategoryModal('edit', cat)}
                        className="p-1.5 hover:text-pink-500 text-gray-400 transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm('category', cat.id)}
                        className="p-1.5 hover:text-rose-600 text-gray-400 transition-colors cursor-pointer"
                        title="Archive Category"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Subcategories Detail List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">
                {activeCategory ? `Subcategories in ${activeCategory.name}` : 'Subcategories'}
              </h3>
              {activeCategoryId && (
                <button
                  onClick={() => handleOpenSubCategoryModal('create')}
                  className="text-xs font-bold text-pink-500 hover:text-pink-600 hover:underline transition-all uppercase tracking-wider cursor-pointer"
                >
                  + Add Subcategory
                </button>
              )}
            </div>

            {activeCategoryId ? (
              isSubCategoriesLoading ? (
                <div className="flex items-center justify-center py-20 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : subCategories.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-100 rounded-[32px] shadow-sm px-4">
                  <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold mb-0.5 text-gray-800">No subcategories yet</h4>
                  <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">Create granular classification levels inside {activeCategory?.name}.</p>
                  <Button size="sm" onClick={() => handleOpenSubCategoryModal('create')}>+ Create Subcategory</Button>
                </div>
              ) : (
                <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                  {subCategories.map((sub, i) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/40 transition-colors"
                      style={{ borderBottom: i < subCategories.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900 truncate">{sub.name}</p>
                            {!sub.isActive && (
                              <span className="text-[8px] bg-amber-50 border border-amber-200 text-amber-600 px-1 rounded font-black uppercase tracking-wider">Inactive</span>
                            )}
                          </div>
                          {sub.description && (
                            <p className="text-[11px] text-gray-400 font-medium truncate max-w-sm mt-0.5">{sub.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button
                          onClick={() => handleOpenSubCategoryModal('edit', sub)}
                          className="p-1.5 hover:text-pink-500 text-gray-400 transition-colors cursor-pointer"
                          title="Edit Subcategory"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm('subcategory', sub.id)}
                          className="p-1.5 hover:text-rose-600 text-gray-400 transition-colors cursor-pointer"
                          title="Archive Subcategory"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-gray-50 border border-dashed rounded-[32px] border-gray-150">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Select a category to view subcategories</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CATEGORY FORM MODAL --- */}
      <AnimatePresence>
        {catModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCatModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[40px] shadow-2xl relative z-10 w-full max-w-lg p-10 border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black mb-1" style={{ fontFamily: FONTS.heading }}>
                {catFormMode === 'create' ? 'Add Category' : 'Edit Category'}
              </h3>
              <p className="text-xs text-gray-400 mb-6 font-medium">Configure catalog categorization details below.</p>

              <form onSubmit={handleCategorySubmit} className="space-y-5">
                <Input
                  label="Category Name"
                  placeholder="e.g. Hoodies, Accessories"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  disabled={isSaving}
                />

                <Input
                  label="Custom Slug (Optional)"
                  placeholder="e.g. organic-hoodies (auto-generated if empty)"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  disabled={isSaving}
                />

                <Input
                  label="Image URL (Optional)"
                  placeholder="e.g. /images/category_hoodie.png"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  disabled={isSaving}
                />

                <Input
                  label="Display Order (Optional)"
                  type="number"
                  placeholder="0"
                  value={catDisplayOrder}
                  onChange={(e) => setCatDisplayOrder(e.target.value)}
                  disabled={isSaving}
                />

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1 text-gray-500">
                    Category Description (Optional)
                  </label>
                  <textarea
                    className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-sm resize-none"
                    style={{ borderColor: COLORS.border, minHeight: '80px' }}
                    placeholder="Short summary for shop catalog layout..."
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                    onBlur={(e) => e.target.style.borderColor = COLORS.border}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="catIsActive"
                    checked={catIsActive}
                    onChange={(e) => setCatIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-2"
                    style={{ accentColor: COLORS.primary }}
                    disabled={isSaving}
                  />
                  <label htmlFor="catIsActive" className="text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                    Active (visible in product creation & landing screens)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" size="md" type="button" onClick={() => setCatModalOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Category'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUBCATEGORY FORM MODAL --- */}
      <AnimatePresence>
        {subModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSubModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[40px] shadow-2xl relative z-10 w-full max-w-lg p-10 border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black mb-1" style={{ fontFamily: FONTS.heading }}>
                {subFormMode === 'create' ? 'Add Subcategory' : 'Edit Subcategory'}
              </h3>
              <p className="text-xs text-gray-400 mb-6 font-medium">Configure classification level under {activeCategory?.name}.</p>

              <form onSubmit={handleSubCategorySubmit} className="space-y-5">
                <Input
                  label="Subcategory Name"
                  placeholder="e.g. Printed, Solid Cotton"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  disabled={isSaving}
                />

                <Input
                  label="Custom Slug (Optional)"
                  placeholder="e.g. printed-tees (auto-generated if empty)"
                  value={subSlug}
                  onChange={(e) => setSubSlug(e.target.value)}
                  disabled={isSaving}
                />

                <Input
                  label="Image URL (Optional)"
                  placeholder="e.g. /images/subcategory_printed.png"
                  value={subImage}
                  onChange={(e) => setSubImage(e.target.value)}
                  disabled={isSaving}
                />

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1 text-gray-500">
                    Subcategory Description (Optional)
                  </label>
                  <textarea
                    className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-sm resize-none"
                    style={{ borderColor: COLORS.border, minHeight: '80px' }}
                    placeholder="Short summary detail..."
                    value={subDescription}
                    onChange={(e) => setSubDescription(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                    onBlur={(e) => e.target.style.borderColor = COLORS.border}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="subIsActive"
                    checked={subIsActive}
                    onChange={(e) => setSubIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-2"
                    style={{ accentColor: COLORS.primary }}
                    disabled={isSaving}
                  />
                  <label htmlFor="subIsActive" className="text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                    Active (visible in product creation & filters)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" size="md" type="button" onClick={() => setSubModalOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Subcategory'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[32px] shadow-2xl relative z-10 w-full max-w-md p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-2">
                Archive {deleteType === 'category' ? 'Category?' : 'Subcategory?'}
              </h3>
              <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
                {deleteType === 'category'
                  ? 'Are you sure? Archiving this category will also archive all its subcategories and associated products.'
                  : 'Are you sure? Archiving this subcategory will also archive its associated products.'}
              </p>

              <div className="flex justify-center gap-3">
                <Button variant="ghost" size="md" onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="bg-rose-600 hover:bg-rose-500 border border-rose-500/50 text-white cursor-pointer !bg-rose-600"
                >
                  {isDeleting ? 'Archiving...' : 'Confirm Delete'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

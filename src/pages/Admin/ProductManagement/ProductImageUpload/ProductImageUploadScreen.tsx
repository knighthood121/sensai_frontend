import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import type { ProductImageUploadScreenProps } from './index';

export default function ProductImageUploadScreen({
  selectedProductId,
  error,
  success,
  products,
  images,
  currentProduct,
  isProductsLoading,
  isDetailsLoading,
  isDetailsFetching,
  isUploading,
  isDeleting,
  imageUrl,
  setImageUrl,
  handleAddImageUrl,
  handleProductChange,
  handleUploadAreaClick,
  handleFileChange,
  handleDeleteClick,
  fileInputRef,
  onBack,
}: ProductImageUploadScreenProps) {
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
            Manage Product Images
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden mb-6" style={{ borderColor: COLORS.border }}>
        <div className="p-6 border-b" style={{ borderColor: COLORS.border }}>
          <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>
            Select Product
          </label>
          <select
            className="w-full max-w-md px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-sm"
            style={{ borderColor: COLORS.border, backgroundColor: '#FFFFFF' }}
            value={selectedProductId}
            onChange={handleProductChange}
            disabled={isProductsLoading}
          >
            <option value="">-- Choose a product to manage --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (SKU: {product.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="p-6">
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-2xl text-sm font-semibold text-center w-full"
              style={{
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-6 px-4 py-3 rounded-2xl text-sm font-semibold text-center w-full text-emerald-700 bg-emerald-50 border border-emerald-200"
            >
              {success}
            </div>
          )}

          {!selectedProductId ? (
            <div className="text-center py-12 text-gray-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-sm font-bold">Please select a product from the list above to manage images</p>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: COLORS.border }}>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest" style={{ color: COLORS.textLight }}>Add image from URL</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void handleAddImageUrl(); } }} placeholder="https://example.com/product-image.jpg" className="min-w-0 flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none" style={{ borderColor: COLORS.border }} disabled={isUploading} />
                  <Button variant="primary" size="md" type="button" onClick={() => void handleAddImageUrl()} disabled={isUploading || !imageUrl.trim()}>Add URL</Button>
                </div>
              </div>

              {/* Upload area */}
              <div
                onClick={handleUploadAreaClick}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer mb-8 ${
                  isUploading ? 'bg-gray-50 border-pink-200 pointer-events-none' : 'hover:border-pink-300'
                }`}
                style={{ borderColor: COLORS.border }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: COLORS.primary + '12', color: COLORS.primary }}
                >
                  {isUploading ? (
                    <svg className="animate-spin h-6 w-6 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>
                
                <p className="text-sm font-bold mb-1">
                  {isUploading ? 'Uploading files to server...' : 'Click to select and upload images'}
                </p>
                <p className="text-xs mb-4" style={{ color: COLORS.textLight }}>PNG, JPG, WEBP up to 5MB each</p>
                <Button variant="outline" size="sm" type="button" disabled={isUploading}>
                  Browse Images
                </Button>
              </div>

              {/* Image gallery */}
              <h4 className="text-sm font-bold mb-4" style={{ fontFamily: FONTS.heading }}>
                Current Product Images ({images.length})
              </h4>
              
              {isDetailsLoading || isDetailsFetching ? (
                <p className="text-xs text-gray-500">Updating image catalog...</p>
              ) : images.length === 0 ? (
                <div className="p-8 border rounded-xl text-center text-gray-500 text-xs">
                  No images uploaded for this product yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="aspect-square rounded-xl overflow-hidden relative border group shadow-sm transition-shadow hover:shadow-md"
                      style={{ borderColor: COLORS.border }}
                    >
                      <img src={img.imageUrl} alt={img.altText || currentProduct?.name} className="w-full h-full object-cover" />
                      
                      {img.isPrimary && (
                        <span className="absolute top-2 left-2 bg-pink-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                          Primary
                        </span>
                      )}

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(img.id)}
                          disabled={isDeleting}
                          className="w-10 h-10 rounded-full bg-white text-rose-600 shadow-lg hover:scale-105 transition-transform flex items-center justify-center focus:outline-none cursor-pointer"
                          title="Delete Image"
                        >
                          {isDeleting ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

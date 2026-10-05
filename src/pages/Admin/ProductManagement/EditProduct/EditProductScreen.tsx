import { COLORS, FONTS } from '../../../../constant/style';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';
import type { EditProductScreenProps } from './index';

export default function EditProductScreen({
  name,
  setName,
  sku,
  setSku,
  price,
  setPrice,
  comparePrice,
  setComparePrice,
  categoryId,
  setCategoryId,
  subCategoryId,
  setSubCategoryId,
  stock,
  setStock,
  description,
  setDescription,
  shortDescription,
  setShortDescription,
  brand,
  setBrand,
  material,
  setMaterial,
  finish,
  setFinish,
  dimensions,
  setDimensions,
  packQuantity,
  setPackQuantity,
  unitOfMeasure,
  setUnitOfMeasure,
  newImagesPreviews,
  isDragging,
  handleFileChange,
  handleRemoveNewImage,
  handleDeleteExistingImage,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleUploadAreaClick,
  handleSubmit,
  categories,
  subcategories,
  isCategoriesLoading,
  isSubCategoriesLoading,
  existingImages,
  videoUrl,
  setVideoUrl,
  videoUrls,
  handleAddVideoUrl,
  handleRemoveVideoUrl,
  isLoading,
  isProductLoading,
  loadError,
  error,
  success,
  fileInputRef,
  onBack,
}: EditProductScreenProps) {
  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-pink-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-semibold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 text-center max-w-md mx-auto" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 mb-4">
          Failed to load product details. Please try again.
        </div>
        <Button variant="primary" size="md" onClick={onBack}>Go to Products list</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold font-heading" style={{ fontFamily: FONTS.heading }}>Edit Product</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <h3 className="text-base font-bold" style={{ fontFamily: FONTS.heading }}>
            Edit Product Details
          </h3>
          <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>
            Update the product information below.
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-2xl text-sm font-semibold text-center w-full bg-rose-50 text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 px-4 py-3 rounded-2xl text-sm font-semibold text-center w-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <Input 
              label="Product Name" 
              placeholder="Enter product name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input 
              label="SKU" 
              placeholder="Enter SKU code" 
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input 
              label="Price (₹)" 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input 
              label="Compare at Price (₹)" 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              disabled={isLoading}
            />
            
            <div className="w-full">
              {isCategoriesLoading ? (
                <Input label="Category" placeholder="Loading categories..." disabled />
              ) : (
                <>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>
                    Category
                  </label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-sm"
                    style={{ borderColor: COLORS.border, backgroundColor: '#FFFFFF' }}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {categoryId && categories.length > 0 && (
              <div className="w-full">
                {isSubCategoriesLoading ? (
                  <Input label="Subcategory" placeholder="Loading subcategories..." disabled />
                ) : (
                  <>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>
                      Subcategory (Optional)
                    </label>
                    <select
                      className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-sm"
                      style={{ borderColor: COLORS.border, backgroundColor: '#FFFFFF' }}
                      value={subCategoryId}
                      onChange={(e) => setSubCategoryId(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="">-- None --</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            )}

            <Input 
              label="Stock Quantity" 
              type="number" 
              placeholder="0" 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input label="Brand / Manufacturer" placeholder="e.g. Bosch, sensai" value={brand} onChange={(e) => setBrand(e.target.value)} disabled={isLoading} />
            <Input label="Material" placeholder="e.g. Stainless Steel 304" value={material} onChange={(e) => setMaterial(e.target.value)} disabled={isLoading} />
            <Input label="Finish / Coating" placeholder="e.g. Zinc plated" value={finish} onChange={(e) => setFinish(e.target.value)} disabled={isLoading} />
            <Input label="Dimensions" placeholder="e.g. M4 × 20 mm" value={dimensions} onChange={(e) => setDimensions(e.target.value)} disabled={isLoading} />
            <Input label="Pack Quantity" type="number" min="1" value={packQuantity} onChange={(e) => setPackQuantity(e.target.value)} disabled={isLoading} />
            <div className="w-full">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>Unit of Measure</label>
              <select className="w-full px-5 py-4 rounded-2xl border-2 outline-none text-sm" style={{ borderColor: COLORS.border }} value={unitOfMeasure} onChange={(e) => setUnitOfMeasure(e.target.value)} disabled={isLoading}>
                <option value="piece">Piece</option><option value="pack">Pack</option><option value="box">Box</option><option value="set">Set</option><option value="meter">Meter</option><option value="kilogram">Kilogram</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>Short Description</label>
            <textarea className="w-full rounded-2xl border-2 px-5 py-4 text-sm outline-none" style={{ borderColor: COLORS.border, minHeight: '80px' }} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} disabled={isLoading} />
          </div>

          {/* Media / Images Section */}
          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-widest mb-3 px-1 text-gray-500">
              Product Images
            </label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 mb-2 px-1 uppercase tracking-wider">Currently Uploaded</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 rounded-2xl border bg-gray-50/50" style={{ borderColor: COLORS.border }}>
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="aspect-square rounded-xl overflow-hidden relative border group shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                      style={{ borderColor: COLORS.border }}
                    >
                      <img src={img.imageUrl} alt={img.altText || name} className="w-full h-full object-cover" />
                      
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 bg-pink-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-sm">
                          Primary
                        </span>
                      )}

                      {/* Hover overlay to delete */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingImage(img.id)}
                          className="w-8 h-8 rounded-full bg-white text-rose-600 shadow-md hover:scale-110 transition-transform flex items-center justify-center focus:outline-none cursor-pointer"
                          title="Delete Image"
                          disabled={isLoading}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drag and Drop Zone for New Uploads */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-gray-400 mb-2 px-1 uppercase tracking-wider">Upload New Images</h4>
              <div
                onClick={handleUploadAreaClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                  isDragging ? 'bg-pink-50 border-pink-400 pointer-events-none' : 'hover:border-pink-300 bg-gray-50/50'
                }`}
                style={{ 
                  borderColor: isDragging ? COLORS.primary : COLORS.border,
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={isLoading}
                />
                
                <div
                  className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: COLORS.primary + '12', color: COLORS.primary }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                
                <p className="text-sm font-bold mb-1" style={{ fontFamily: FONTS.heading }}>
                  Drag & drop new images, or <span style={{ color: COLORS.primary }}>browse files</span>
                </p>
                <p className="text-xs" style={{ color: COLORS.textLight }}>PNG, JPG, WEBP up to 5MB each</p>
              </div>
            </div>

            {/* Previews of newly selected images */}
            {newImagesPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 rounded-2xl border" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAFA' }}>
                {newImagesPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden relative border group shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                    style={{ borderColor: COLORS.border }}
                  >
                    <img src={preview} alt={`New Preview ${index + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Hover delete overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveNewImage(index);
                        }}
                        className="w-8 h-8 rounded-full bg-white text-rose-600 shadow-md hover:scale-110 transition-transform flex items-center justify-center focus:outline-none cursor-pointer"
                        title="Remove Image"
                        disabled={isLoading}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: COLORS.border }}>
            <label className="mb-3 block text-xs font-black uppercase tracking-widest" style={{ color: COLORS.textLight }}>Product Videos ({videoUrls.length})</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://example.com/product-video.mp4" className="min-w-0 flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none" style={{ borderColor: COLORS.border }} disabled={isLoading} />
              <Button type="button" variant="outline" size="md" onClick={handleAddVideoUrl} disabled={!videoUrl.trim() || isLoading}>Add Video</Button>
            </div>
            {videoUrls.length > 0 && <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{videoUrls.map((url, index) => <div key={url} className="relative overflow-hidden rounded-xl border bg-black"><video src={url} controls preload="metadata" className="aspect-video w-full object-contain" /><button type="button" onClick={() => handleRemoveVideoUrl(index)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-rose-600 shadow">×</button></div>)}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>
              Description
            </label>
            <textarea
              className="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none resize-none text-sm"
              style={{ borderColor: COLORS.border, minHeight: '120px' }}
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = COLORS.primary; }}
              onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div
          className="px-6 py-4 flex items-center justify-end gap-3"
          style={{ borderTop: `1px solid ${COLORS.border}`, backgroundColor: '#F9FAFB' }}
        >
          <Button variant="ghost" size="md" type="button" onClick={onBack} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}

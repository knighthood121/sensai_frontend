import { COLORS, FONTS } from '../../../../constant/style';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';
import type { AddProductScreenProps } from './index';

export default function AddProductScreen({
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
  newCategoryName,
  setNewCategoryName,
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
  images,
  imagesPreviews,
  imageUrl,
  setImageUrl,
  imageUrls,
  handleAddImageUrl,
  handleRemoveImageUrl,
  videoUrl,
  setVideoUrl,
  videoUrls,
  handleAddVideoUrl,
  handleRemoveVideoUrl,
  videoFiles,
  videoPreviews,
  handleVideoFileChange,
  handleRemoveVideoFile,
  videoFileInputRef,
  isDragging,
  handleFileChange,
  handleRemoveImage,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleUploadAreaClick,
  handleSubmit,
  categories,
  subcategories,
  isCategoriesLoading,
  isSubCategoriesLoading,
  isSaveDisabled,
  isLoading,
  error,
  fileInputRef,
  onCancel,
}: AddProductScreenProps) {
  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <div className="flex bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="w-full">
          <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <button
              type="button"
              onClick={onCancel}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
              style={{ borderColor: COLORS.border }}
              title="Go Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: COLORS.primary + '15', color: COLORS.primary }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ fontFamily: FONTS.heading }}>
                Add New Product
              </h3>
              <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                Fill in the details below to add a new product to your store.
              </p>
            </div>
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
                ) : categories.length === 0 ? (
                  <Input
                    label="Category Name (New)"
                    placeholder="Create a new category (e.g. T-Shirts)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
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
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="__new__">＋ Create a new mechanical category</option>
                    </select>
                    {categoryId === '__new__' && (
                      <div className="mt-3">
                        <Input label="New Category Name" placeholder="e.g. HSS Drill Bits, Masonry Drill Bits" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required disabled={isLoading} />
                      </div>
                    )}
                  </>
                )}
              </div>

              {categoryId && categoryId !== '__new__' && categories.length > 0 && (
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
              <Input label="Finish / Coating" placeholder="e.g. Zinc plated, Black oxide" value={finish} onChange={(e) => setFinish(e.target.value)} disabled={isLoading} />
              <Input label="Dimensions" placeholder="e.g. M4 × 20 mm" value={dimensions} onChange={(e) => setDimensions(e.target.value)} disabled={isLoading} />
              <Input label="Pack Quantity" type="number" min="1" placeholder="1" value={packQuantity} onChange={(e) => setPackQuantity(e.target.value)} disabled={isLoading} />
              <div className="w-full">
                <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>Unit of Measure</label>
                <select className="w-full px-5 py-4 rounded-2xl border-2 outline-none text-sm" style={{ borderColor: COLORS.border }} value={unitOfMeasure} onChange={(e) => setUnitOfMeasure(e.target.value)} disabled={isLoading}>
                  <option value="piece">Piece</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                  <option value="set">Set</option>
                  <option value="meter">Meter</option>
                  <option value="kilogram">Kilogram</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>
                Short Description
              </label>
              <textarea className="w-full rounded-2xl border-2 px-5 py-4 text-sm outline-none" style={{ borderColor: COLORS.border, minHeight: '80px' }} placeholder="Short summary shown near the product title" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} disabled={isLoading} />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.textLight }}>
                Product Images ({images.length + imageUrls.length})
              </label>

              <div className="mb-4 rounded-2xl border p-4" style={{ borderColor: COLORS.border }}>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.textLight }}>Add from image URL</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }} placeholder="https://example.com/product-image.jpg" className="min-w-0 flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none focus:border-violet-500" style={{ borderColor: COLORS.border }} disabled={isLoading} />
                  <Button type="button" variant="outline" size="md" onClick={handleAddImageUrl} disabled={isLoading || !imageUrl.trim()}>Add URL</Button>
                </div>
                <p className="mt-2 text-[11px]" style={{ color: COLORS.textLight }}>Paste a public HTTP or HTTPS image address, or upload a file from your computer below.</p>
              </div>

              <div
                onClick={handleUploadAreaClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer mb-4 flex flex-col items-center justify-center ${
                  isDragging ? 'bg-pink-50 border-pink-400' : 'hover:border-pink-300 bg-gray-50/50'
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
                  Drag & drop images here, or <span style={{ color: COLORS.primary }}>browse files</span>
                </p>
                <p className="text-xs" style={{ color: COLORS.textLight }}>PNG, JPG, WEBP up to 5MB each (Max 8 images)</p>
              </div>

              {imagesPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 rounded-2xl border mb-4" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAFA' }}>
                  {imagesPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl overflow-hidden relative border group shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                      style={{ borderColor: COLORS.border }}
                    >
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />

                      {index === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-pink-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-sm">
                          Primary
                        </span>
                      )}

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
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

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4 rounded-2xl border p-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8" style={{ borderColor: COLORS.border, backgroundColor: '#FAFAFA' }}>
                  {imageUrls.map((url, index) => (
                    <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border bg-white shadow-sm" style={{ borderColor: COLORS.border }}>
                      <img src={url} alt={`URL preview ${index + 1}`} className="h-full w-full object-cover" />
                      {images.length === 0 && index === 0 && <span className="absolute left-1.5 top-1.5 rounded-md bg-violet-600 px-1.5 py-0.5 text-[8px] font-black uppercase text-white">Primary</span>}
                      <button type="button" onClick={() => handleRemoveImageUrl(index)} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white text-rose-600 opacity-0 shadow group-hover:opacity-100" aria-label="Remove image URL">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: COLORS.border }}>
              <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: COLORS.textLight }}>
                Product Videos ({videoUrls.length + videoFiles.length})
              </label>
              <input ref={videoFileInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" multiple onChange={handleVideoFileChange} className="hidden" disabled={isLoading} />
              <button type="button" onClick={() => videoFileInputRef.current?.click()} className="mb-4 w-full rounded-xl border-2 border-dashed px-5 py-8 text-sm font-bold transition hover:border-violet-400 hover:bg-violet-50" style={{ borderColor: COLORS.border }} disabled={isLoading || videoFiles.length >= 5}>
                Upload MP4, WebM or MOV videos from your computer
                <span className="mt-1 block text-xs font-normal" style={{ color: COLORS.textLight }}>Up to 5 files, 100MB each</span>
              </button>
              {videoPreviews.length > 0 && (
                <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {videoPreviews.map((url, index) => (
                    <div key={url} className="relative overflow-hidden rounded-xl border bg-black" style={{ borderColor: COLORS.border }}>
                      <video src={url} controls preload="metadata" className="aspect-video w-full object-contain" />
                      <button type="button" onClick={() => handleRemoveVideoFile(index)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-rose-600 shadow" aria-label="Remove uploaded video">×</button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.textLight }}>Or add a public video URL</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVideoUrl(); } }} placeholder="https://example.com/product-demo.mp4" className="min-w-0 flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none focus:border-violet-500" style={{ borderColor: COLORS.border }} disabled={isLoading} />
                <Button type="button" variant="outline" size="md" onClick={handleAddVideoUrl} disabled={isLoading || !videoUrl.trim()}>Add Video</Button>
              </div>
              <p className="mt-2 text-[11px]" style={{ color: COLORS.textLight }}>Add up to 10 public MP4, WebM, Cloudinary, YouTube, or Vimeo URLs.</p>
              {videoUrls.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {videoUrls.map((url, index) => (
                    <div key={url} className="relative overflow-hidden rounded-xl border bg-black" style={{ borderColor: COLORS.border }}>
                      <video src={url} controls preload="metadata" className="aspect-video w-full object-contain" />
                      <button type="button" onClick={() => handleRemoveVideoUrl(index)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-rose-600 shadow" aria-label="Remove video">×</button>
                    </div>
                  ))}
                </div>
              )}
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
            <Button variant="ghost" size="md" type="button" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={isSaveDisabled}>
              {isLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

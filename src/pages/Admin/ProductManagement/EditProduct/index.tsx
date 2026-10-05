import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditProductScreen from './EditProductScreen';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
} from '../../../../service/productsApi';
import {
  useGetCategoriesDropdownQuery,
  useGetSubCategoriesDropdownQuery,
} from '../../../../service/dropdownApi';
import type { RefObject } from 'react';
import type { CategoryDropdownItem, SubCategoryDropdownItem } from '../../../../types/Dropdown.type';
import type { ProductImage } from '../../../../types/Product.type';

export interface EditProductScreenProps {
  productId: number;
  name: string;
  setName: (val: string) => void;
  sku: string;
  setSku: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  comparePrice: string;
  setComparePrice: (val: string) => void;
  categoryId: string;
  setCategoryId: (val: string) => void;
  subCategoryId: string;
  setSubCategoryId: (val: string) => void;
  stock: string;
  setStock: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  shortDescription: string;
  setShortDescription: (val: string) => void;
  brand: string;
  setBrand: (val: string) => void;
  material: string;
  setMaterial: (val: string) => void;
  finish: string;
  setFinish: (val: string) => void;
  dimensions: string;
  setDimensions: (val: string) => void;
  packQuantity: string;
  setPackQuantity: (val: string) => void;
  unitOfMeasure: string;
  setUnitOfMeasure: (val: string) => void;
  newImages: File[];
  newImagesPreviews: string[];
  isDragging: boolean;
  removedImageIds: number[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveNewImage: (index: number) => void;
  handleDeleteExistingImage: (imageId: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleUploadAreaClick: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  categories: CategoryDropdownItem[];
  subcategories: SubCategoryDropdownItem[];
  isCategoriesLoading: boolean;
  isSubCategoriesLoading: boolean;
  existingImages: ProductImage[];
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  videoUrls: string[];
  handleAddVideoUrl: () => void;
  handleRemoveVideoUrl: (index: number) => void;
  isLoading: boolean;
  isProductLoading: boolean;
  loadError: any;
  error?: string;
  success?: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onBack: () => void;
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch product data and categories list
  const { 
    data: productDetailsData, 
    isLoading: isProductLoading, 
    error: loadError
  } = useGetProductDetailsQuery(productId, { skip: !productId });

  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategoriesDropdownQuery();
  const categories = categoryData?.data || [];

  const [updateProduct, { isLoading: isProductUpdating }] = useUpdateProductMutation();
  const [uploadImages, { isLoading: isImagesUploading }] = useUploadProductImagesMutation();

  // Local Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('');
  const [finish, setFinish] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [packQuantity, setPackQuantity] = useState('1');
  const [unitOfMeasure, setUnitOfMeasure] = useState('piece');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  // Selected new images for upload
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagesPreviews, setNewImagesPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Track database image records slated for deletion on save
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch subcategories based on categoryId
  const { data: subCategoryData, isLoading: isSubCategoriesLoading } = useGetSubCategoriesDropdownQuery(
    categoryId ? { categoryId: Number(categoryId) } : undefined,
    { skip: !categoryId }
  );
  const subcategories = subCategoryData?.data || [];

  // Populate data when product is loaded
  useEffect(() => {
    if (productDetailsData?.data) {
      const product = productDetailsData.data.product;
      setName(product.name || '');
      setSku(product.sku || '');
      setPrice(String(product.basePrice || ''));
      setComparePrice(product.discountPrice ? String(product.discountPrice) : '');
      setCategoryId(String(product.categoryId || ''));
      setSubCategoryId(product.subCategoryId ? String(product.subCategoryId) : '');
      // Populate from variants if present
      const variants = productDetailsData.data.variants || [];
      const firstVariantStock = variants[0]?.stock ?? product.availableStock ?? 0;
      setStock(String(firstVariantStock));
      setDescription(product.description || '');
      setShortDescription(product.shortDescription || '');
      setBrand(product.brand || '');
      setMaterial(product.material || '');
      setFinish(product.finish || '');
      setDimensions(product.dimensions || '');
      setPackQuantity(String(product.packQuantity || 1));
      setUnitOfMeasure(product.unitOfMeasure || 'piece');
      setVideoUrls((product.videos || []).map((video) => video.videoUrl));
    }
  }, [productDetailsData]);

  // Ref to track preview URLs for cleanup on unmount
  const previewsRef = useRef<string[]>([]);
  useEffect(() => {
    previewsRef.current = newImagesPreviews;
  }, [newImagesPreviews]);

  // Clean up object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      previewsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    const files = Array.from(filesList).filter(file => file.type.startsWith('image/'));
    const previews = files.map(file => URL.createObjectURL(file));

    setNewImages(prev => [...prev, ...files]);
    setNewImagesPreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagesPreviews(prev => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDeleteExistingImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const filesList = e.dataTransfer.files;
    if (!filesList || filesList.length === 0) return;

    const files = Array.from(filesList).filter(file => file.type.startsWith('image/'));
    const previews = files.map(file => URL.createObjectURL(file));

    setNewImages(prev => [...prev, ...files]);
    setNewImagesPreviews(prev => [...prev, ...previews]);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddVideoUrl = () => {
    const value = videoUrl.trim();
    if (!value || videoUrls.includes(value)) return;
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      setError('Enter a valid HTTP or HTTPS video URL.');
      return;
    }
    setVideoUrls((current) => [...current, value].slice(0, 10));
    setVideoUrl('');
  };

  const handleRemoveVideoUrl = (index: number) => {
    setVideoUrls((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!categoryId) {
      setError('Product category is required.');
      return;
    }

    try {
      const existingVariants = productDetailsData?.data?.variants || [];
      let updatedVariants = [];
      
      if (existingVariants.length === 0) {
        updatedVariants = [
          {
            size: 'M',
            color: 'Default',
            sku: `${sku}-M`,
            price: parseFloat(price),
            stock: parseInt(stock),
          },
        ];
      } else {
        updatedVariants = existingVariants.map((v, i) => {
          if (i === 0) {
            return {
              id: v.id,
              size: v.size,
              color: v.color,
              sku: sku + '-' + (v.size || 'M'),
              price: parseFloat(price),
              stock: parseInt(stock),
            };
          }
          return {
            id: v.id,
            size: v.size,
            color: v.color,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
          };
        });
      }

      // Update product details
      await updateProduct({
        id: productId,
        data: {
          name,
          sku,
          basePrice: parseFloat(price),
          discountPrice: comparePrice ? parseFloat(comparePrice) : null,
          categoryId: parseInt(categoryId),
          subCategoryId: subCategoryId ? parseInt(subCategoryId) : null,
          description,
          shortDescription: shortDescription || null,
          brand: brand || null,
          material: material || null,
          finish: finish || null,
          dimensions: dimensions || null,
          packQuantity: Math.max(1, parseInt(packQuantity) || 1),
          unitOfMeasure: unitOfMeasure || 'piece',
          variants: updatedVariants,
          removeImageIds: removedImageIds,
          videos: videoUrls.map((url, index) => ({
            videoUrl: url,
            title: `${name} video ${index + 1}`,
            displayOrder: index,
          })),
        },
      }).unwrap();

      // If user selected new images, upload them
      if (newImages.length > 0) {
        const formData = new FormData();
        formData.append('productId', String(productId));
        newImages.forEach(file => {
          formData.append('images', file);
        });
        await uploadImages(formData).unwrap();
      }

      setSuccess('Product updated successfully!');
      setTimeout(() => {
        navigate('/admin/products/list');
      }, 1500);

    } catch (err: any) {
      console.error('Failed to update product details:', err);
      let errMsg = err?.data?.message || err?.message || 'Failed to update product. Please try again.';
      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        errMsg = `${errMsg}: ${err.data.errors.join(', ')}`;
      }
      setError(errMsg);
    }
  };

  const handleBack = () => {
    navigate('/admin/products/list');
  };

  const allExistingImages = productDetailsData?.data?.images || [];
  const existingImages = allExistingImages.filter((img) => !removedImageIds.includes(img.id));
  const isLoading = isProductLoading || isProductUpdating || isImagesUploading;

  return (
    <EditProductScreen
      productId={productId}
      name={name}
      setName={setName}
      sku={sku}
      setSku={setSku}
      price={price}
      setPrice={setPrice}
      comparePrice={comparePrice}
      setComparePrice={setComparePrice}
      categoryId={categoryId}
      setCategoryId={setCategoryId}
      subCategoryId={subCategoryId}
      setSubCategoryId={setSubCategoryId}
      stock={stock}
      setStock={setStock}
      description={description}
      setDescription={setDescription}
      shortDescription={shortDescription}
      setShortDescription={setShortDescription}
      brand={brand}
      setBrand={setBrand}
      material={material}
      setMaterial={setMaterial}
      finish={finish}
      setFinish={setFinish}
      dimensions={dimensions}
      setDimensions={setDimensions}
      packQuantity={packQuantity}
      setPackQuantity={setPackQuantity}
      unitOfMeasure={unitOfMeasure}
      setUnitOfMeasure={setUnitOfMeasure}
      newImages={newImages}
      newImagesPreviews={newImagesPreviews}
      isDragging={isDragging}
      removedImageIds={removedImageIds}
      handleFileChange={handleFileChange}
      handleRemoveNewImage={handleRemoveNewImage}
      handleDeleteExistingImage={handleDeleteExistingImage}
      handleDragOver={handleDragOver}
      handleDragLeave={handleDragLeave}
      handleDrop={handleDrop}
      handleUploadAreaClick={handleUploadAreaClick}
      handleSubmit={handleSubmit}
      categories={categories}
      subcategories={subcategories}
      isCategoriesLoading={isCategoriesLoading}
      isSubCategoriesLoading={isSubCategoriesLoading}
      existingImages={existingImages}
      videoUrl={videoUrl}
      setVideoUrl={setVideoUrl}
      videoUrls={videoUrls}
      handleAddVideoUrl={handleAddVideoUrl}
      handleRemoveVideoUrl={handleRemoveVideoUrl}
      isLoading={isLoading}
      isProductLoading={isProductLoading}
      loadError={loadError}
      error={error}
      success={success}
      fileInputRef={fileInputRef}
      onBack={handleBack}
    />
  );
}

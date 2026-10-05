import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductScreen from './AddProductScreen';
import { 
  useCreateProductMutation, 
  useCreateCategoryMutation,
  useUploadProductImagesMutation,
  useUploadProductVideosMutation,
} from '../../../../service/productsApi';
import {
  useGetCategoriesDropdownQuery,
  useGetSubCategoriesDropdownQuery,
} from '../../../../service/dropdownApi';
import { useToast } from '../../../../components/common/Toast';
import type { RefObject } from 'react';
import type { CategoryDropdownItem, SubCategoryDropdownItem } from '../../../../types/Dropdown.type';

export interface AddProductScreenProps {
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
  newCategoryName: string;
  setNewCategoryName: (val: string) => void;
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
  images: File[];
  imagesPreviews: string[];
  imageUrl: string;
  setImageUrl: (val: string) => void;
  imageUrls: string[];
  handleAddImageUrl: () => void;
  handleRemoveImageUrl: (index: number) => void;
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  videoUrls: string[];
  handleAddVideoUrl: () => void;
  handleRemoveVideoUrl: (index: number) => void;
  videoFiles: File[];
  videoPreviews: string[];
  handleVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveVideoFile: (index: number) => void;
  videoFileInputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleUploadAreaClick: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  categories: CategoryDropdownItem[];
  subcategories: SubCategoryDropdownItem[];
  isCategoriesLoading: boolean;
  isSubCategoriesLoading: boolean;
  isSaveDisabled: boolean;
  isLoading: boolean;
  error?: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onCancel: () => void;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [error, setError] = useState('');

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const [createProduct, { isLoading: isProductSaving }] = useCreateProductMutation();
  const [createCategory, { isLoading: isCategorySaving }] = useCreateCategoryMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation();
  const [uploadVideos, { isLoading: isVideoUploading }] = useUploadProductVideosMutation();

  // ─── Dropdowns ─────────────────────────────────────────────────────────────
  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategoriesDropdownQuery();
  const categories = categoryData?.data || [];

  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');

  const { data: subCategoryData, isLoading: isSubCategoriesLoading } = useGetSubCategoriesDropdownQuery(
    categoryId && categoryId !== '__new__' ? { categoryId: Number(categoryId) } : undefined,
    { skip: !categoryId || categoryId === '__new__' }
  );
  const subcategories = subCategoryData?.data || [];

  // ─── Form State ────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('');
  const [finish, setFinish] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [packQuantity, setPackQuantity] = useState('1');
  const [unitOfMeasure, setUnitOfMeasure] = useState('piece');
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // ─── Default Category ──────────────────────────────────────────────────────
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(String(categories[0].id));
    }
  }, [categories, categoryId]);

  // Clean up previews to prevent memory leaks
  useEffect(() => {
    return () => {
      imagesPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagesPreviews]);

  // ─── File Handlers ─────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    const newFiles = Array.from(filesList).filter((file) => file.type.startsWith('image/'));
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setImagesPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== index);
    });
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

    const newFiles = Array.from(filesList).filter((file) => file.type.startsWith('image/'));
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setImagesPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddImageUrl = () => {
    const value = imageUrl.trim();
    if (!value) return;

    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Unsupported URL protocol');
      }
    } catch {
      setError('Enter a valid HTTP or HTTPS image URL.');
      return;
    }

    if (imageUrls.includes(value)) {
      setError('That image URL is already in the list.');
      return;
    }

    if (imageUrls.length + images.length >= 20) {
      setError('A product can have up to 20 images.');
      return;
    }

    setImageUrls((current) => [...current, value]);
    setImageUrl('');
    setError('');
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleAddVideoUrl = () => {
    const value = videoUrl.trim();
    if (!value) return;
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      setError('Enter a valid HTTP or HTTPS video URL.');
      return;
    }
    if (videoUrls.includes(value)) {
      setError('That video URL is already in the list.');
      return;
    }
    if (videoUrls.length >= 10) {
      setError('A product can have up to 10 videos.');
      return;
    }
    setVideoUrls((current) => [...current, value]);
    setVideoUrl('');
    setError('');
  };

  const handleRemoveVideoUrl = (index: number) => {
    setVideoUrls((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith('video/'));
    if (!files.length) return;
    const remaining = Math.max(0, 5 - videoFiles.length);
    const accepted = files.slice(0, remaining);
    setVideoFiles((current) => [...current, ...accepted]);
    setVideoPreviews((current) => [...current, ...accepted.map((file) => URL.createObjectURL(file))]);
    e.target.value = '';
  };

  const handleRemoveVideoFile = (index: number) => {
    setVideoFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setVideoPreviews((current) => {
      const target = current[index];
      if (target) URL.revokeObjectURL(target);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  // ─── Form Submission ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let finalCategoryId: number | undefined;

      if (categoryId === '__new__') {
        if (!newCategoryName.trim()) {
          setError('Enter a name for the new mechanical category.');
          return;
        }
        const categoryResult = await createCategory({ name: newCategoryName.trim() }).unwrap();
        finalCategoryId = categoryResult.data.id;
      } else if (categories.length > 0) {
        if (!categoryId) return;
        finalCategoryId = parseInt(categoryId);
      } else {
        if (!newCategoryName.trim()) return;
        const categoryResult = await createCategory({ name: newCategoryName.trim() }).unwrap();
        finalCategoryId = categoryResult.data.id;
      }

      if (!finalCategoryId) {
        throw new Error('A category is required to create a product.');
      }

      const productResult = await createProduct({
        categoryId: finalCategoryId,
        subCategoryId: subCategoryId ? parseInt(subCategoryId) : null,
        name,
        sku,
        basePrice: parseFloat(price),
        discountPrice: comparePrice ? parseFloat(comparePrice) : null,
        description,
        shortDescription: shortDescription || undefined,
        brand: brand || undefined,
        material: material || undefined,
        finish: finish || undefined,
        dimensions: dimensions || undefined,
        packQuantity: Math.max(1, parseInt(packQuantity) || 1),
        unitOfMeasure: unitOfMeasure || 'piece',
        images: imageUrls.map((url, index) => ({
          imageUrl: url,
          altText: name,
          isPrimary: index === 0,
          displayOrder: index,
        })),
        videos: videoUrls.map((url, index) => ({
          videoUrl: url,
          title: `${name} video ${index + 1}`,
          displayOrder: index,
        })),
        variants: [
          {
            size: dimensions || 'Standard',
            color: finish || material || 'Default',
            sku: `${sku}-STD`,
            price: parseFloat(price),
            stock: parseInt(stock),
          },
        ],
      }).unwrap();

      const productId = productResult.data.id;

      // Upload images if any are selected
      if (images.length > 0 && productId) {
        const uploadFormData = new FormData();
        uploadFormData.append('productId', String(productId));
        images.forEach((file) => {
          uploadFormData.append('images', file);
        });
        await uploadImages(uploadFormData).unwrap();
      }

      if (videoFiles.length > 0 && productId) {
        const videoFormData = new FormData();
        videoFormData.append('productId', String(productId));
        videoFiles.forEach((file) => videoFormData.append('videos', file));
        await uploadVideos(videoFormData).unwrap();
      }

      showToast('Product added successfully!', 'success');
      navigate('/admin/products/list');
    } catch (err: any) {
      console.error('Failed to create product or upload images:', err);
      let errMsg = err?.message || 'Failed to save product. Please try again.';
      if (err?.data) {
        if (err.data.message) {
          errMsg = err.data.message;
        }
        if (err.data.errors && Array.isArray(err.data.errors)) {
          errMsg = `${errMsg}: ${err.data.errors.join(', ')}`;
        }
      }
      setError(errMsg);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products/list');
  };

  const isLoading = isProductSaving || isCategorySaving || isUploading || isVideoUploading;
  const isSaveDisabled =
    isLoading ||
    isCategoriesLoading ||
    (categories.length > 0
      ? !categoryId || (categoryId === '__new__' && !newCategoryName.trim())
      : !newCategoryName.trim());

  return (
    <AddProductScreen
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
      newCategoryName={newCategoryName}
      setNewCategoryName={setNewCategoryName}
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
      images={images}
      imagesPreviews={imagesPreviews}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
      imageUrls={imageUrls}
      handleAddImageUrl={handleAddImageUrl}
      handleRemoveImageUrl={handleRemoveImageUrl}
      videoUrl={videoUrl}
      setVideoUrl={setVideoUrl}
      videoUrls={videoUrls}
      handleAddVideoUrl={handleAddVideoUrl}
      handleRemoveVideoUrl={handleRemoveVideoUrl}
      videoFiles={videoFiles}
      videoPreviews={videoPreviews}
      handleVideoFileChange={handleVideoFileChange}
      handleRemoveVideoFile={handleRemoveVideoFile}
      videoFileInputRef={videoFileInputRef}
      isDragging={isDragging}
      handleFileChange={handleFileChange}
      handleRemoveImage={handleRemoveImage}
      handleDragOver={handleDragOver}
      handleDragLeave={handleDragLeave}
      handleDrop={handleDrop}
      handleUploadAreaClick={handleUploadAreaClick}
      handleSubmit={handleSubmit}
      categories={categories}
      subcategories={subcategories}
      isCategoriesLoading={isCategoriesLoading}
      isSubCategoriesLoading={isSubCategoriesLoading}
      isSaveDisabled={isSaveDisabled}
      isLoading={isLoading}
      error={error}
      fileInputRef={fileInputRef}
      onCancel={handleCancel}
    />
  );
}

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductImageUploadScreen from './ProductImageUploadScreen';
import {
  useListProductsQuery,
  useGetProductDetailsQuery,
  useUploadProductImagesMutation,
  useAddProductImageUrlsMutation,
  useUpdateProductMutation,
} from '../../../../service/productsApi';
import type { RefObject } from 'react';

export interface ProductImageUploadScreenProps {
  selectedProductId: string;
  error?: string;
  success?: string;
  products: any[];
  images: any[];
  currentProduct: any;
  isProductsLoading: boolean;
  isDetailsLoading: boolean;
  isDetailsFetching: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  handleAddImageUrl: () => Promise<void>;
  handleProductChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleUploadAreaClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteClick: (imageId: number) => Promise<void>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onBack: () => void;
}

export default function ProductImageUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Fetch list of products for the dropdown select
  const { data: productsData, isLoading: isProductsLoading } = useListProductsQuery();
  const products = productsData?.data || [];

  // Fetch selected product details (including images)
  const {
    data: productDetails,
    isLoading: isDetailsLoading,
    isFetching: isDetailsFetching,
    refetch,
  } = useGetProductDetailsQuery(Number(selectedProductId), {
    skip: !selectedProductId,
  });

  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation();
  const [addImageUrls, { isLoading: isAddingUrl }] = useAddProductImageUrlsMutation();
  const [updateProduct, { isLoading: isDeleting }] = useUpdateProductMutation();

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleUploadAreaClick = () => {
    if (!selectedProductId) {
      setError('Please select a product first before uploading images.');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProductId) return;

    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('productId', selectedProductId);

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      await uploadImages(formData).unwrap();
      setSuccess('Product images uploaded successfully.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      refetch();
    } catch (err: any) {
      console.error('Upload failed:', err);
      const errMsg = err?.data?.message || 'Failed to upload images. Please try again.';
      setError(errMsg);
    }
  };

  const handleAddImageUrl = async () => {
    if (!selectedProductId) {
      setError('Please select a product first.');
      return;
    }

    const value = imageUrl.trim();
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      setError('Enter a valid HTTP or HTTPS image URL.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await addImageUrls({
        productId: Number(selectedProductId),
        images: [{ imageUrl: value, altText: currentProduct?.name }],
      }).unwrap();
      setImageUrl('');
      setSuccess('Image URL added successfully.');
      refetch();
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Failed to add image URL.';
      setError(errMsg);
    }
  };

  const handleDeleteClick = async (imageId: number) => {
    if (!selectedProductId) return;
    setError('');
    setSuccess('');

    try {
      await updateProduct({
        id: Number(selectedProductId),
        data: { removeImageIds: [imageId] },
      }).unwrap();
      setSuccess('Image deleted successfully.');
      refetch();
    } catch (err: any) {
      console.error('Delete failed:', err);
      const errMsg = err?.data?.message || 'Failed to delete image. Please try again.';
      setError(errMsg);
    }
  };

  const handleBack = () => {
    navigate('/admin/products');
  };

  const images = productDetails?.data?.images || [];
  const currentProduct = productDetails?.data?.product;

  return (
    <ProductImageUploadScreen
      selectedProductId={selectedProductId}
      error={error}
      success={success}
      products={products}
      images={images}
      currentProduct={currentProduct}
      isProductsLoading={isProductsLoading}
      isDetailsLoading={isDetailsLoading}
      isDetailsFetching={isDetailsFetching}
      isUploading={isUploading || isAddingUrl}
      isDeleting={isDeleting}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
      handleAddImageUrl={handleAddImageUrl}
      handleProductChange={handleProductChange}
      handleUploadAreaClick={handleUploadAreaClick}
      handleFileChange={handleFileChange}
      handleDeleteClick={handleDeleteClick}
      fileInputRef={fileInputRef}
      onBack={handleBack}
    />
  );
}

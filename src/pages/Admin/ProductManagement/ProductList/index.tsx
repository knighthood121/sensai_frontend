import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductListScreen from './ProductListScreen';
import { useListProductsQuery, useDeleteProductMutation } from '../../../../service/productsApi';
import type { Product } from '../../../../types/Product.type';

export interface ProductListScreenProps {
  products: Product[];
  isLoading: boolean;
  productToDelete: Product | null;
  setProductToDelete: (product: Product | null) => void;
  deleteError: string;
  setDeleteError: (val: string) => void;
  handleDeleteConfirm: () => Promise<void>;
  isDeleting: boolean;
  onAddProduct: () => void;
  onEditProduct: (productId: number) => void;
  onBack: () => void;
}

export default function ProductList() {
  const navigate = useNavigate();
  const { data, isLoading } = useListProductsQuery();
  const products = data?.data || [];

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleteError('');
    try {
      await deleteProduct(productToDelete.id).unwrap();
      setProductToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      const errMsg = err?.data?.message || err?.message || 'Failed to delete product. Please try again.';
      setDeleteError(errMsg);
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleBack = () => {
    navigate('/admin/products');
  };

  return (
    <ProductListScreen
      products={products}
      isLoading={isLoading}
      productToDelete={productToDelete}
      setProductToDelete={setProductToDelete}
      deleteError={deleteError}
      setDeleteError={setDeleteError}
      handleDeleteConfirm={handleDeleteConfirm}
      isDeleting={isDeleting}
      onAddProduct={handleAddProduct}
      onEditProduct={handleEditProduct}
      onBack={handleBack}
    />
  );
}

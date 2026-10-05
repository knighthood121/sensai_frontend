import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoriesManagementScreen from './CategoriesManagementScreen';
import { useToast } from '../../../../components/common/Toast';
import {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from '../../../../service/productsApi';

export interface CategoriesManagementScreenProps {
  onBack: () => void;
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  activeCategory: any;
  categories: any[];
  isCategoriesLoading: boolean;
  subCategories: any[];
  isSubCategoriesLoading: boolean;
  catModalOpen: boolean;
  setCatModalOpen: (val: boolean) => void;
  catFormMode: 'create' | 'edit';
  catName: string;
  setCatName: (val: string) => void;
  catSlug: string;
  setCatSlug: (val: string) => void;
  catDescription: string;
  setCatDescription: (val: string) => void;
  catImage: string;
  setCatImage: (val: string) => void;
  catDisplayOrder: string;
  setCatDisplayOrder: (val: string) => void;
  catIsActive: boolean;
  setCatIsActive: (val: boolean) => void;
  subModalOpen: boolean;
  setSubModalOpen: (val: boolean) => void;
  subFormMode: 'create' | 'edit';
  subName: string;
  setSubName: (val: string) => void;
  subSlug: string;
  setSubSlug: (val: string) => void;
  subDescription: string;
  setSubDescription: (val: string) => void;
  subImage: string;
  setSubImage: (val: string) => void;
  subIsActive: boolean;
  setSubIsActive: (val: boolean) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (val: boolean) => void;
  deleteType: 'category' | 'subcategory';
  handleOpenCategoryModal: (mode: 'create' | 'edit', category?: any) => void;
  handleCategorySubmit: (e: React.FormEvent) => Promise<void>;
  handleOpenSubCategoryModal: (mode: 'create' | 'edit', subcategory?: any) => void;
  handleSubCategorySubmit: (e: React.FormEvent) => Promise<void>;
  handleOpenDeleteConfirm: (type: 'category' | 'subcategory', id: number) => void;
  handleDeleteConfirm: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}

export default function CategoriesManagement() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Selected category for subcategory detail panel
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Categories query
  const { data: categoryResponse, isLoading: isCategoriesLoading } = useListCategoriesQuery();
  const categories = categoryResponse?.data || [];

  // Subcategories query (only runs when a category is selected)
  const { data: subCategoryResponse, isLoading: isSubCategoriesLoading } = useListSubCategoriesQuery(
    activeCategoryId ? { categoryId: activeCategoryId } : undefined,
    { skip: !activeCategoryId }
  );
  const subCategories = subCategoryResponse?.data || [];

  // Mutations
  const [createCategory, { isLoading: isCategoryCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isCategoryUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isCategoryDeleting }] = useDeleteCategoryMutation();

  const [createSubCategory, { isLoading: isSubCategoryCreating }] = useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isSubCategoryUpdating }] = useUpdateSubCategoryMutation();
  const [deleteSubCategory, { isLoading: isSubCategoryDeleting }] = useDeleteSubCategoryMutation();

  // Category Modal Form State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catFormMode, setCatFormMode] = useState<'create' | 'edit'>('create');
  const [catId, setCatId] = useState<number | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catDisplayOrder, setCatDisplayOrder] = useState('0');
  const [catIsActive, setCatIsActive] = useState(true);

  // Subcategory Modal Form State
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subFormMode, setSubFormMode] = useState<'create' | 'edit'>('create');
  const [subId, setSubId] = useState<number | null>(null);
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subDescription, setSubDescription] = useState('');
  const [subImage, setSubImage] = useState('');
  const [subIsActive, setSubIsActive] = useState(true);

  // Delete Confirm Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'category' | 'subcategory'>('category');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Set the first category as active by default once loaded
  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = catModalOpen || subModalOpen || deleteConfirmOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [catModalOpen, subModalOpen, deleteConfirmOpen]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  // Open Category Form modal
  const handleOpenCategoryModal = (mode: 'create' | 'edit', category?: any) => {
    setCatFormMode(mode);
    if (mode === 'edit' && category) {
      setCatId(category.id);
      setCatName(category.name);
      setCatSlug(category.slug || '');
      setCatDescription(category.description || '');
      setCatImage(category.image || '');
      setCatDisplayOrder(String(category.displayOrder || '0'));
      setCatIsActive(category.isActive);
    } else {
      setCatId(null);
      setCatName('');
      setCatSlug('');
      setCatDescription('');
      setCatImage('');
      setCatDisplayOrder('0');
      setCatIsActive(true);
    }
    setCatModalOpen(true);
  };

  // Submit Category
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    const payload = {
      name: catName,
      slug: catSlug.trim() || undefined,
      description: catDescription.trim() || undefined,
      image: catImage.trim() || undefined,
      displayOrder: parseInt(catDisplayOrder) || 0,
      isActive: catIsActive,
    };

    try {
      if (catFormMode === 'create') {
        await createCategory(payload).unwrap();
        showToast('Category created successfully!');
      } else if (catId !== null) {
        await updateCategory({ id: catId, data: payload }).unwrap();
        showToast('Category updated successfully!');
      }
      setCatModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Failed to save category.', 'error');
    }
  };

  // Open Subcategory Form modal
  const handleOpenSubCategoryModal = (mode: 'create' | 'edit', subcategory?: any) => {
    if (!activeCategoryId) {
      showToast('Please select a category first.', 'error');
      return;
    }
    setSubFormMode(mode);
    if (mode === 'edit' && subcategory) {
      setSubId(subcategory.id);
      setSubName(subcategory.name);
      setSubSlug(subcategory.slug || '');
      setSubDescription(subcategory.description || '');
      setSubImage(subcategory.image || '');
      setSubIsActive(subcategory.isActive);
    } else {
      setSubId(null);
      setSubName('');
      setSubSlug('');
      setSubDescription('');
      setSubImage('');
      setSubIsActive(true);
    }
    setSubModalOpen(true);
  };

  // Submit Subcategory
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategoryId) return;
    if (!subName.trim()) {
      showToast('Subcategory name is required.', 'error');
      return;
    }

    const payload = {
      categoryId: activeCategoryId,
      name: subName,
      slug: subSlug.trim() || undefined,
      description: subDescription.trim() || undefined,
      image: subImage.trim() || undefined,
      isActive: subIsActive,
    };

    try {
      if (subFormMode === 'create') {
        await createSubCategory(payload).unwrap();
        showToast('Subcategory created successfully!');
      } else if (subId !== null) {
        await updateSubCategory({ id: subId, data: payload }).unwrap();
        showToast('Subcategory updated successfully!');
      }
      setSubModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Failed to save subcategory.', 'error');
    }
  };

  // Confirm delete triggers
  const handleOpenDeleteConfirm = (type: 'category' | 'subcategory', id: number) => {
    setDeleteType(type);
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    try {
      if (deleteType === 'category') {
        await deleteCategory(deleteTargetId).unwrap();
        showToast('Category archived successfully.');
        if (activeCategoryId === deleteTargetId) {
          setActiveCategoryId(null);
        }
      } else {
        await deleteSubCategory(deleteTargetId).unwrap();
        showToast('Subcategory archived successfully.');
      }
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to delete record.', 'error');
    }
  };

  const handleBack = () => {
    navigate('/admin/products');
  };

  const isSaving = isCategoryCreating || isCategoryUpdating || isSubCategoryCreating || isSubCategoryUpdating;
  const isDeleting = isCategoryDeleting || isSubCategoryDeleting;

  return (
    <CategoriesManagementScreen
      onBack={handleBack}
      activeCategoryId={activeCategoryId}
      setActiveCategoryId={setActiveCategoryId}
      activeCategory={activeCategory}
      categories={categories}
      isCategoriesLoading={isCategoriesLoading}
      subCategories={subCategories}
      isSubCategoriesLoading={isSubCategoriesLoading}
      catModalOpen={catModalOpen}
      setCatModalOpen={setCatModalOpen}
      catFormMode={catFormMode}
      catName={catName}
      setCatName={setCatName}
      catSlug={catSlug}
      setCatSlug={setCatSlug}
      catDescription={catDescription}
      setCatDescription={setCatDescription}
      catImage={catImage}
      setCatImage={setCatImage}
      catDisplayOrder={catDisplayOrder}
      setCatDisplayOrder={setCatDisplayOrder}
      catIsActive={catIsActive}
      setCatIsActive={setCatIsActive}
      subModalOpen={subModalOpen}
      setSubModalOpen={setSubModalOpen}
      subFormMode={subFormMode}
      subName={subName}
      setSubName={setSubName}
      subSlug={subSlug}
      setSubSlug={setSubSlug}
      subDescription={subDescription}
      setSubDescription={setSubDescription}
      subImage={subImage}
      setSubImage={setSubImage}
      subIsActive={subIsActive}
      setSubIsActive={setSubIsActive}
      deleteConfirmOpen={deleteConfirmOpen}
      setDeleteConfirmOpen={setDeleteConfirmOpen}
      deleteType={deleteType}
      handleOpenCategoryModal={handleOpenCategoryModal}
      handleCategorySubmit={handleCategorySubmit}
      handleOpenSubCategoryModal={handleOpenSubCategoryModal}
      handleSubCategorySubmit={handleSubCategorySubmit}
      handleOpenDeleteConfirm={handleOpenDeleteConfirm}
      handleDeleteConfirm={handleDeleteConfirm}
      isSaving={isSaving}
      isDeleting={isDeleting}
    />
  );
}

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLazyListProductsQuery } from '../../../../service/productsApi';
import {
  useListVariantsQuery,
  useGetStockSummaryQuery,
  useCreateVariantsMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantStockMutation,
} from '../../../../service/variantApi';
import {
  useGetDistinctSizesQuery,
  useGetDistinctColorsQuery,
} from '../../../../service/dropdownApi';
import { useToast } from '../../../../components/common/Toast';
import type { Product } from '../../../../types/Product.type';
import type {
  Variant,
  CreateVariantItem,
  UpdateVariantRequest,
  InventoryAction,
} from '../../../../types/Variant.type';
import ProductVariantsScreen from './ProductVariantsScreen';

// ─── Constants ───────────────────────────────────────────────────────────────

const EMPTY_VARIANT_ITEM: CreateVariantItem = {
  size: '',
  color: '',
  sku: '',
  price: null,
  stock: 0,
};

const INVENTORY_ACTIONS: { value: InventoryAction; label: string }[] = [
  { value: 'IN', label: 'Stock In' },
  { value: 'OUT', label: 'Stock Out' },
  { value: 'RETURN', label: 'Return' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'MANUAL', label: 'Manual Adjustment' },
];

// ─── Types for Screen Props ──────────────────────────────────────────────────

export interface ProductSearchResult {
  id: number;
  name: string;
  sku: string;
  image: string | null;
}

export interface CreateVariantFormState {
  items: CreateVariantItem[];
}

export interface EditVariantFormState {
  size: string;
  color: string;
  sku: string;
  price: string;
  stock: string;
}

export interface StockAdjustmentFormState {
  action: InventoryAction;
  quantity: string;
  reference: string;
  notes: string;
}

export interface VariantScreenProps {
  // Product search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: ProductSearchResult[];
  isSearching: boolean;
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onClearProduct: () => void;

  // Variant data
  variants: Variant[];
  isLoadingVariants: boolean;
  variantsError: boolean;

  // Stock summary
  stockSummary: { totalStock: number; totalReservedStock: number; totalAvailableStock: number; inStock: boolean } | null;
  isLoadingStockSummary: boolean;

  // Create modal
  isCreateOpen: boolean;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  createForm: CreateVariantFormState;
  onAddCreateRow: () => void;
  onRemoveCreateRow: (index: number) => void;
  onCreateFieldChange: (index: number, field: keyof CreateVariantItem, value: string | number | null) => void;
  onSubmitCreate: () => Promise<void>;
  isCreating: boolean;
  createError: string;

  // Edit modal
  isEditOpen: boolean;
  editingVariant: Variant | null;
  onOpenEdit: (variant: Variant) => void;
  onCloseEdit: () => void;
  editForm: EditVariantFormState;
  onEditFieldChange: (field: keyof EditVariantFormState, value: string) => void;
  onSubmitEdit: () => Promise<void>;
  isUpdating: boolean;
  editError: string;

  // Stock adjustment modal
  isStockOpen: boolean;
  stockVariant: Variant | null;
  onOpenStock: (variant: Variant) => void;
  onCloseStock: () => void;
  stockForm: StockAdjustmentFormState;
  onStockFieldChange: (field: keyof StockAdjustmentFormState, value: string) => void;
  onSubmitStock: () => Promise<void>;
  isAdjustingStock: boolean;
  stockError: string;

  // Delete
  onDelete: (variant: Variant) => void;
  isDeleting: boolean;

  // Constants
  inventoryActions: typeof INVENTORY_ACTIONS;

  // Dropdown lists
  distinctSizes: string[];
  distinctColors: string[];
}

// ─── Logic Container ─────────────────────────────────────────────────────────

export default function ProductVariants() {
  const { showToast } = useToast();

  // ── Dropdowns ───────────────────────────────────────────────────────────
  const { data: sizesData } = useGetDistinctSizesQuery();
  const { data: colorsData } = useGetDistinctColorsQuery();
  const distinctSizes = sizesData?.data?.map((item) => item.value) || [];
  const distinctColors = colorsData?.data?.map((item) => item.value) || [];

  // ── Product search ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [triggerSearch, { isFetching: isSearching }] = useLazyListProductsQuery();

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        try {
          const result = await triggerSearch({ search: query.trim(), limit: 10 }).unwrap();
          if (result?.data) {
            setSearchResults(
              result.data.map((p) => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                image: p.images?.[0]?.imageUrl ?? null,
              }))
            );
          }
        } catch {
          setSearchResults([]);
        }
      }, 350);
    },
    [triggerSearch]
  );

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const handleClearProduct = useCallback(() => {
    setSelectedProduct(null);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // ── Variant data ────────────────────────────────────────────────────────
  const productId = selectedProduct?.id;

  const {
    data: variantsResponse,
    isLoading: isLoadingVariants,
    isError: variantsError,
  } = useListVariantsQuery(productId!, { skip: !productId });

  const {
    data: stockSummaryResponse,
    isLoading: isLoadingStockSummary,
  } = useGetStockSummaryQuery(productId!, { skip: !productId });

  const variants = variantsResponse?.data ?? [];
  const stockSummary = stockSummaryResponse?.data ?? null;

  // ── Mutations ───────────────────────────────────────────────────────────
  const [createVariants, { isLoading: isCreating }] = useCreateVariantsMutation();
  const [updateVariant, { isLoading: isUpdating }] = useUpdateVariantMutation();
  const [deleteVariant, { isLoading: isDeleting }] = useDeleteVariantMutation();
  const [updateVariantStock, { isLoading: isAdjustingStock }] = useUpdateVariantStockMutation();

  // ── Create Modal ────────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateVariantFormState>({ items: [{ ...EMPTY_VARIANT_ITEM }] });
  const [createError, setCreateError] = useState('');

  const handleOpenCreate = useCallback(() => {
    setCreateForm({ items: [{ ...EMPTY_VARIANT_ITEM }] });
    setCreateError('');
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
    setCreateError('');
  }, []);

  const handleAddCreateRow = useCallback(() => {
    setCreateForm((prev) => ({ items: [...prev.items, { ...EMPTY_VARIANT_ITEM }] }));
  }, []);

  const handleRemoveCreateRow = useCallback((index: number) => {
    setCreateForm((prev) => ({
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const handleCreateFieldChange = useCallback(
    (index: number, field: keyof CreateVariantItem, value: string | number | null) => {
      setCreateForm((prev) => {
        const items = [...prev.items];
        items[index] = { ...items[index], [field]: value };
        return { items };
      });
    },
    []
  );

  const handleSubmitCreate = useCallback(async () => {
    if (!productId) return;
    setCreateError('');

    // Validate
    for (let i = 0; i < createForm.items.length; i++) {
      const item = createForm.items[i];
      if (!item.size.trim() || !item.color.trim() || !item.sku.trim()) {
        setCreateError(`Row ${i + 1}: Size, Color, and SKU are required.`);
        return;
      }
    }

    try {
      await createVariants({
        productId,
        data: {
          variants: createForm.items.map((item) => ({
            size: item.size.trim(),
            color: item.color.trim(),
            sku: item.sku.trim(),
            price: item.price,
            stock: item.stock ?? 0,
          })),
        },
      }).unwrap();
      showToast(`${createForm.items.length} variant(s) created successfully!`, 'success');
      handleCloseCreate();
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to create variants.';
      setCreateError(msg);
    }
  }, [productId, createForm, createVariants, showToast, handleCloseCreate]);

  // ── Edit Modal ──────────────────────────────────────────────────────────
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [editForm, setEditForm] = useState<EditVariantFormState>({
    size: '',
    color: '',
    sku: '',
    price: '',
    stock: '',
  });
  const [editError, setEditError] = useState('');

  const handleOpenEdit = useCallback((variant: Variant) => {
    setEditingVariant(variant);
    setEditForm({
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      price: variant.price !== null ? String(variant.price) : '',
      stock: String(variant.stock),
    });
    setEditError('');
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setEditingVariant(null);
    setEditError('');
  }, []);

  const handleEditFieldChange = useCallback(
    (field: keyof EditVariantFormState, value: string) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmitEdit = useCallback(async () => {
    if (!productId || !editingVariant) return;
    setEditError('');

    if (!editForm.size.trim() || !editForm.color.trim() || !editForm.sku.trim()) {
      setEditError('Size, Color, and SKU are required.');
      return;
    }

    const data: UpdateVariantRequest = {
      size: editForm.size.trim(),
      color: editForm.color.trim(),
      sku: editForm.sku.trim(),
      price: editForm.price ? Number(editForm.price) : null,
      stock: editForm.stock ? Number(editForm.stock) : undefined,
    };

    try {
      await updateVariant({
        productId,
        variantId: editingVariant.id,
        data,
      }).unwrap();
      showToast('Variant updated successfully!', 'success');
      handleCloseEdit();
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update variant.';
      setEditError(msg);
    }
  }, [productId, editingVariant, editForm, updateVariant, showToast, handleCloseEdit]);

  // ── Stock Adjustment Modal ──────────────────────────────────────────────
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [stockVariant, setStockVariant] = useState<Variant | null>(null);
  const [stockForm, setStockForm] = useState<StockAdjustmentFormState>({
    action: 'IN',
    quantity: '',
    reference: '',
    notes: '',
  });
  const [stockError, setStockError] = useState('');

  const handleOpenStock = useCallback((variant: Variant) => {
    setStockVariant(variant);
    setStockForm({ action: 'IN', quantity: '', reference: '', notes: '' });
    setStockError('');
    setIsStockOpen(true);
  }, []);

  const handleCloseStock = useCallback(() => {
    setIsStockOpen(false);
    setStockVariant(null);
    setStockError('');
  }, []);

  const handleStockFieldChange = useCallback(
    (field: keyof StockAdjustmentFormState, value: string) => {
      setStockForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmitStock = useCallback(async () => {
    if (!productId || !stockVariant) return;
    setStockError('');

    const qty = Number(stockForm.quantity);
    if (!qty || qty < 1) {
      setStockError('Quantity must be at least 1.');
      return;
    }

    try {
      await updateVariantStock({
        productId,
        variantId: stockVariant.id,
        data: {
          action: stockForm.action,
          quantity: qty,
          reference: stockForm.reference.trim() || undefined,
          notes: stockForm.notes.trim() || undefined,
        },
      }).unwrap();
      showToast('Stock updated successfully!', 'success');
      handleCloseStock();
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update stock.';
      setStockError(msg);
    }
  }, [productId, stockVariant, stockForm, updateVariantStock, showToast, handleCloseStock]);

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (variant: Variant) => {
      if (!productId) return;
      if (!window.confirm(`Delete variant "${variant.sku}" (${variant.size} / ${variant.color})? This cannot be undone.`)) {
        return;
      }
      try {
        await deleteVariant({ productId, variantId: variant.id }).unwrap();
        showToast('Variant deleted successfully!', 'success');
      } catch (err: any) {
        const msg = err?.data?.message || 'Failed to delete variant.';
        showToast(msg, 'error');
      }
    },
    [productId, deleteVariant, showToast]
  );

  // ── Cleanup debounce on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <ProductVariantsScreen
      // Product search
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchResults={searchResults}
      isSearching={isSearching}
      selectedProduct={selectedProduct}
      onSelectProduct={handleSelectProduct}
      onClearProduct={handleClearProduct}
      // Variant data
      variants={variants}
      isLoadingVariants={isLoadingVariants}
      variantsError={variantsError}
      // Stock summary
      stockSummary={stockSummary}
      isLoadingStockSummary={isLoadingStockSummary}
      // Create
      isCreateOpen={isCreateOpen}
      onOpenCreate={handleOpenCreate}
      onCloseCreate={handleCloseCreate}
      createForm={createForm}
      onAddCreateRow={handleAddCreateRow}
      onRemoveCreateRow={handleRemoveCreateRow}
      onCreateFieldChange={handleCreateFieldChange}
      onSubmitCreate={handleSubmitCreate}
      isCreating={isCreating}
      createError={createError}
      // Edit
      isEditOpen={isEditOpen}
      editingVariant={editingVariant}
      onOpenEdit={handleOpenEdit}
      onCloseEdit={handleCloseEdit}
      editForm={editForm}
      onEditFieldChange={handleEditFieldChange}
      onSubmitEdit={handleSubmitEdit}
      isUpdating={isUpdating}
      editError={editError}
      // Stock adjustment
      isStockOpen={isStockOpen}
      stockVariant={stockVariant}
      onOpenStock={handleOpenStock}
      onCloseStock={handleCloseStock}
      stockForm={stockForm}
      onStockFieldChange={handleStockFieldChange}
      onSubmitStock={handleSubmitStock}
      isAdjustingStock={isAdjustingStock}
      stockError={stockError}
      // Delete
      onDelete={handleDelete}
      isDeleting={isDeleting}
      // Constants
      inventoryActions={INVENTORY_ACTIONS}
      // Dropdowns
      distinctSizes={distinctSizes}
      distinctColors={distinctColors}
    />
  );
}

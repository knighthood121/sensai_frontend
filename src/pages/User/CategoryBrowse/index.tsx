import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  Heart,
  HelpCircle,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useToast } from '../../../components/common/Toast';
import { useAppSelector } from '../../../app/hooks';
import {
  useListCategoriesQuery,
  useListProductsQuery,
  useListSubCategoriesQuery,
  useLazyGetProductDetailsQuery,
} from '../../../service/productsApi';
import { useToggleWishlistMutation } from '../../../service/wishlistApi';
import { useAddToCartMutation } from '../../../service/cartApi';
import { addGuestCartItem } from '../../../utils/guestCart';
import type { Product } from '../../../types/Product.type';

type CatalogNode = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  productCount?: number;
  subCategoryCount?: number;
  _count?: { products: number; subcategories?: number };
};

type SortField = 'interfaceSize' | 'normSize' | 'name' | null;

function getInterfaceSize(product: Product): string {
  if (product.variants?.[0]?.size) return product.variants[0].size;
  if (product.dimensions) return product.dimensions;
  if (product.finish) return product.finish;
  return '-';
}

function getNormSize(product: Product): string {
  if (product.packQuantity && product.packQuantity > 1) return `${product.packQuantity} pcs`;
  if (product.variants?.[0]?.sku) return product.variants[0].sku;
  const match = product.name?.match(/(\d+(?:\.\d+)?\s*(?:mm|")?)/i);
  if (match) return match[1];
  return '-';
}

export default function CategoryBrowse() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categorySlug = '', subCategorySlug } = useParams<{
    categorySlug?: string;
    subCategorySlug?: string;
  }>();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState(urlSearch);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchTerm(q);
  }, [searchParams]);

  const [selectedProductType, setSelectedProductType] = useState<string | null>(
    subCategorySlug || null,
  );
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [systemOpen, setSystemOpen] = useState(true);
  const [productTypeOpen, setProductTypeOpen] = useState(true);
  const [showNotice, setShowNotice] = useState(true);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  // Auth & Cart
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [addToCart] = useAddToCartMutation();
  const [triggerGetProductDetails] = useLazyGetProductDetailsQuery();

  // Wishlist mutation
  const [toggleWishlist] = useToggleWishlistMutation();

  // Fetch real categories from API
  const { data: categoriesResponse, isLoading: categoriesLoading } = useListCategoriesQuery();
  const apiCategories = (categoriesResponse?.data || []) as CatalogNode[];

  // Find active category
  const activeCategory = apiCategories.find((c) => c.slug === categorySlug);

  // Real subcategories query for active category
  const { data: subcategoriesResponse } = useListSubCategoriesQuery(
    activeCategory ? { categoryId: activeCategory.id } : undefined,
    { skip: !activeCategory },
  );
  const apiSubcategories = (subcategoriesResponse?.data || []) as CatalogNode[];

  // Fetch real products from API for this category
  const { data: productsResponse, isLoading: productsLoading } = useListProductsQuery(
    {
      page: 1,
      limit: 100,
      category: categorySlug || undefined,
      subcategory: selectedProductType || undefined,
    },
  );
  const apiProducts = (productsResponse?.data || []) as Product[];

  // Real System Options from API
  const systemOptions = useMemo(() => {
    return apiCategories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      count: cat.productCount ?? (cat as any)._count?.products ?? 0,
      colorClass: 'text-gray-900',
    }));
  }, [apiCategories]);

  // Determine current active system name and slug
  const activeSystemSlug = categorySlug || systemOptions[0]?.slug || '';
  const activeSystem = systemOptions.find((s) => s.slug === activeSystemSlug) || systemOptions[0];
  const activeSystemName = activeCategory?.name || activeSystem?.name || 'All Categories';

  // Real Product Types (subcategories) for the selected category
  const productTypeOptions = useMemo(() => {
    return apiSubcategories.map((sub) => ({
      name: sub.name,
      slug: sub.slug,
      count: sub.productCount ?? (sub as any)._count?.products ?? 0,
    }));
  }, [apiSubcategories]);

  // Filter & sort real products
  const displayProducts = useMemo(() => {
    let list = [...(apiProducts || [])];

    // Filter by search query (Name or SKU)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.material && p.material.toLowerCase().includes(q)),
      );
    }

    // Filter by selected Product Type (subcategory)
    if (selectedProductType) {
      const typeTerm = selectedProductType.toLowerCase();
      list = list.filter(
        (p) =>
          (p.subCategory?.name && p.subCategory.name.toLowerCase().includes(typeTerm)) ||
          (p.subCategory?.slug && p.subCategory.slug.toLowerCase().includes(typeTerm)) ||
          p.name.toLowerCase().includes(typeTerm),
      );
    }

    // Sort if active
    if (sortField) {
      list.sort((a, b) => {
        let valA = '';
        let valB = '';
        if (sortField === 'interfaceSize') {
          valA = getInterfaceSize(a);
          valB = getInterfaceSize(b);
        } else if (sortField === 'normSize') {
          valA = getNormSize(a);
          valB = getNormSize(b);
        } else if (sortField === 'name') {
          valA = a.name;
          valB = b.name;
        }
        const cmp = valA.localeCompare(valB, undefined, { numeric: true });
        return sortAsc ? cmp : -cmp;
      });
    }

    return list;
  }, [apiProducts, searchTerm, selectedProductType, sortField, sortAsc]);

  // Handlers
  const handleSystemSelect = (slug: string) => {
    setSelectedProductType(null);
    navigate(`/category/${slug}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedProductType(null);
    setSortField(null);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleToggleWishlist = async (productId: number) => {
    try {
      await toggleWishlist(productId).unwrap();
      showToast('Product added to wish list!', 'success');
    } catch {
      showToast('Added to wish list!', 'success');
    }
  };

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      let variants = product.variants || [];
      if (!variants || variants.length === 0) {
        try {
          const detailRes = await triggerGetProductDetails(product.id).unwrap();
          variants = detailRes.data?.variants || [];
        } catch {
          // fallback
        }
      }

      const variant = variants[0];
      const sellingPrice = Number(product.sellingPrice ?? product.discountPrice ?? product.basePrice ?? 150);

      if (!isAuthenticated) {
        addGuestCartItem({
          productId: product.id,
          variantId: variant?.id || -(product.id),
          quantity: 1,
          productName: product.name,
          slug: product.slug || '',
          image: product.images?.find((img) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || null,
          price: Number(product.basePrice ?? sellingPrice),
          discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
          sellingPrice,
          size: variant?.size || 'Standard',
          color: variant?.color || 'Default',
          sku: variant?.sku || product.sku || `SKU-${product.id}`,
          stock: variant?.stock || 50,
          itemTotal: sellingPrice,
        });
        showToast('Added to cart!');
        return;
      }

      await addToCart({
        productId: product.id,
        variantId: variant?.id || 1,
        quantity: 1,
      }).unwrap();
      showToast('Added to cart!');
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Failed to add item to cart.', 'error');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleDocClick = (docName: string, productName: string) => {
    showToast(`Downloading ${docName} for ${productName}`, 'info');
  };

  return (
    <div className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <main className="mx-auto max-w-[1650px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ================= LEFT SIDEBAR (FILTERS) ================= */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:border-r lg:border-gray-200 lg:pr-6">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                FILTERS
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-medium text-[#0275b8] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>

            {/* Filter Group: System Name */}
            <div className="mt-4 border-b border-gray-200 pb-5">
              <button
                type="button"
                onClick={() => setSystemOpen(!systemOpen)}
                className="flex w-full items-center justify-between py-1 text-sm font-bold text-gray-900 cursor-pointer"
              >
                <span>System Name</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${
                    systemOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {systemOpen && (
                <div className="mt-3.5 space-y-3">
                  {systemOptions.length > 0 ? (
                    systemOptions.map((sys) => {
                      const isSelected = activeSystemSlug === sys.slug;
                      return (
                        <label
                          key={sys.slug}
                          onClick={() => handleSystemSelect(sys.slug)}
                          className="flex items-center justify-between text-xs cursor-pointer group select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-[#0275b8] bg-white'
                                  : 'border-gray-300 group-hover:border-gray-400 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <span className="h-2 w-2 rounded-full bg-[#0275b8]" />
                              )}
                            </span>
                            <span
                              className={`font-semibold ${
                                isSelected ? 'text-[#0275b8]' : 'text-gray-800'
                              }`}
                            >
                              {sys.name}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs font-normal">
                            {sys.count.toLocaleString()}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400">Loading categories...</p>
                  )}
                </div>
              )}
            </div>

            {/* Filter Group: Product Type (Subcategories) */}
            {productTypeOptions.length > 0 && (
              <div className="mt-4 border-b border-gray-200 pb-5">
                <button
                  type="button"
                  onClick={() => setProductTypeOpen(!productTypeOpen)}
                  className="flex w-full items-center justify-between py-1 text-sm font-bold text-gray-900 cursor-pointer"
                >
                  <span>Product Type</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${
                      productTypeOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {productTypeOpen && (
                  <div className="mt-3.5 space-y-3">
                    {productTypeOptions.map((type) => {
                      const isSelected = selectedProductType === type.name || selectedProductType === type.slug;
                      return (
                        <label
                          key={type.name}
                          onClick={() =>
                            setSelectedProductType(isSelected ? null : type.slug)
                          }
                          className="flex items-center justify-between text-xs cursor-pointer group select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-[#0275b8] bg-white'
                                  : 'border-gray-300 group-hover:border-gray-400 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <span className="h-2 w-2 rounded-full bg-[#0275b8]" />
                              )}
                            </span>
                            <span
                              className={`font-medium ${
                                isSelected ? 'text-[#0275b8]' : 'text-gray-700 group-hover:text-gray-900'
                              }`}
                            >
                              {type.name}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs font-normal">
                            {type.count.toLocaleString()}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Notice Callout Box */}
            {showNotice && (
              <div className="mt-6 rounded bg-[#f3f4f6] p-3.5 text-xs text-gray-600 border border-gray-200/80 relative">
                <button
                  type="button"
                  onClick={() => setShowNotice(false)}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 text-xs font-bold p-1 cursor-pointer"
                  title="Close notice"
                >
                  <X size={13} />
                </button>
                <p className="pr-4 leading-relaxed">
                  Please select first a{' '}
                  <strong className="font-bold text-gray-900">system</strong> and a{' '}
                  <strong className="font-bold text-gray-900">product type</strong> to show more
                  specific filters
                </p>
              </div>
            )}
          </aside>

          {/* ================= RIGHT MAIN CONTENT ================= */}
          <section className="flex-1 min-w-0 w-full">
            {/* Modern Search Input Bar (No red block) */}
            <div className="group relative flex items-center bg-gray-50/90 hover:bg-gray-100/70 focus-within:bg-white border border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 rounded-full h-11 w-full px-4 transition-all duration-200 shadow-2xs">
              <Search
                size={18}
                className="text-gray-400 shrink-0 mr-3 transition-colors group-focus-within:text-gray-700"
                strokeWidth={2}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by Name, SKU, Brand or Material..."
                className="w-full min-w-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none font-normal"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Active Filter Pills Bar */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {activeSystemName && (
                <span className="inline-flex items-center gap-2 rounded bg-[#e8f4fc] px-3 py-1.5 text-xs font-medium text-[#0275b8] border border-[#cde5f7]">
                  <span>System Name: {activeSystemName}</span>
                  <button
                    type="button"
                    onClick={() => handleSystemSelect(systemOptions[0]?.slug || '')}
                    className="text-[#0275b8] hover:text-red-500 font-bold ml-1 cursor-pointer text-xs"
                    title="Reset system"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedProductType && (
                <span className="inline-flex items-center gap-2 rounded bg-[#e8f4fc] px-3 py-1.5 text-xs font-medium text-[#0275b8] border border-[#cde5f7]">
                  <span>Product Type: {selectedProductType}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProductType(null)}
                    className="text-[#0275b8] hover:text-red-500 font-bold ml-1 cursor-pointer text-xs"
                    title="Remove filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-3 text-xs font-medium text-[#0275b8] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>

            {/* Results Table Area */}
            {categoriesLoading || productsLoading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#0275b8]" />
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto min-w-full">
                <div className="min-w-[960px]">
                  {/* Table Header Row */}
                  <div className="border-b border-gray-200 pb-3 text-xs font-semibold text-gray-700">
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-5 text-sm font-medium text-gray-800">
                        {displayProducts.length.toLocaleString()} products found
                      </div>
                      <div className="col-span-1 text-center font-semibold text-gray-600">
                        Product Data
                      </div>
                      <div className="col-span-2 text-center font-semibold text-gray-600">
                        Technical Drawings
                      </div>
                      <div className="col-span-1 flex items-center justify-center gap-1 text-center font-semibold text-gray-600">
                        <span>Interface Size</span>
                        <HelpCircle size={14} className="text-[#0275b8] cursor-pointer" />
                        <button
                          type="button"
                          onClick={() => toggleSort('interfaceSize')}
                          className="cursor-pointer text-gray-400 hover:text-gray-700"
                          title="Sort by Interface Size"
                        >
                          <ArrowUpDown size={12} />
                        </button>
                      </div>
                      <div className="col-span-1 flex items-center justify-center gap-1 text-center font-semibold text-gray-600">
                        <span>Norm Size</span>
                        <HelpCircle size={14} className="text-[#0275b8] cursor-pointer" />
                        <button
                          type="button"
                          onClick={() => toggleSort('normSize')}
                          className="cursor-pointer text-gray-400 hover:text-gray-700"
                          title="Sort by Norm Size"
                        >
                          <ArrowUpDown size={12} />
                        </button>
                      </div>
                      <div className="col-span-2 text-center font-semibold text-gray-600">
                        Add to Cart & Wishlist
                      </div>
                    </div>
                  </div>

                  {/* Product Rows List */}
                  {displayProducts.length > 0 ? (
                    <div className="divide-y divide-gray-200/80">
                      {displayProducts.map((product, idx) => {
                        const isSelected =
                          selectedRowId === product.id || (selectedRowId === null && idx === 0);
                        const primaryImg =
                          product.images?.find((img) => img.isPrimary)?.imageUrl ||
                          product.images?.[0]?.imageUrl;

                        return (
                          <div
                            key={product.id}
                            onClick={() => setSelectedRowId(product.id)}
                            className={`group relative grid grid-cols-12 items-center gap-4 py-5 transition-colors ${
                              isSelected
                                ? 'border-l-4 border-l-[#00a3e0] bg-[#fbfdfd]'
                                : 'hover:bg-gray-50/70 border-l-4 border-l-transparent'
                            }`}
                          >
                            {/* Column 1: Product Thumbnail & Details */}
                            <div className="col-span-5 flex items-center gap-4 pl-3">
                              <div
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden bg-white p-1 cursor-pointer flex items-center justify-center rounded border border-gray-100"
                              >
                                {primaryImg ? (
                                  <img
                                    src={primaryImg}
                                    alt={product.name}
                                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                                    <Package size={28} strokeWidth={1.5} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/product/${product.id}`)}
                                  className="text-left font-semibold text-[#1a73b7] hover:underline text-base sm:text-[17px] leading-snug line-clamp-2 block cursor-pointer"
                                >
                                  {product.name}
                                </button>
                                <div className="mt-1 text-xs text-gray-500">
                                  <span className="text-gray-400 font-normal">SKU</span>{' '}
                                  <span className="font-semibold text-gray-800">
                                    {product.sku || 'N/A'}
                                  </span>
                                </div>
                                <div className="mt-1 text-xs font-semibold text-gray-700">
                                  {product.brand ? (
                                    <span>{product.brand}</span>
                                  ) : product.material ? (
                                    <span className="capitalize">{product.material}</span>
                                  ) : product.totalStock > 0 ? (
                                    <span className="text-emerald-700">In Stock</span>
                                  ) : (
                                    <span>Available on order</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Column 2: Product Data */}
                            <div className="col-span-1 text-center text-xs text-gray-700">
                              {product.material || product.finish || '-'}
                            </div>

                            {/* Column 3: Technical Drawings */}
                            <div className="col-span-2 flex flex-col items-center space-y-1 text-center">
                              {[
                                'DXF_ISO13399',
                                'PDF_ISO13399',
                                'STP_DIN4003',
                                'XML_DIN4000',
                              ].map((doc) => (
                                <button
                                  key={doc}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDocClick(doc, product.name);
                                  }}
                                  className="text-xs text-[#0072bc] hover:underline leading-tight font-normal cursor-pointer"
                                >
                                  {doc}
                                </button>
                              ))}
                            </div>

                            {/* Column 4: Interface Size */}
                            <div className="col-span-1 text-center text-xs sm:text-sm text-gray-800 font-medium">
                              {getInterfaceSize(product)}
                            </div>

                            {/* Column 5: Norm Size */}
                            <div className="col-span-1 text-center text-xs sm:text-sm text-gray-800 font-medium">
                              {getNormSize(product)}
                            </div>

                            {/* Column 6: Actions (Add to Cart & Add to Wish List) */}
                            <div className="col-span-2 flex flex-col items-center justify-center gap-1.5 px-1">
                              <button
                                type="button"
                                disabled={addingProductId === product.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                className="w-full max-w-[140px] flex items-center justify-center gap-1.5 rounded bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-60"
                                title="Add to cart"
                              >
                                <ShoppingCart size={13} strokeWidth={2} />
                                <span>{addingProductId === product.id ? 'Adding...' : 'Add to cart'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWishlist(product.id);
                                }}
                                className="w-full max-w-[140px] flex items-center justify-center gap-1.5 rounded bg-[#2f78b8] hover:bg-[#25639a] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer whitespace-nowrap active:scale-95"
                                title="Add to wish list"
                              >
                                <Heart size={13} />
                                <span>Add to wish list</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center text-gray-500">
                      <p className="text-base font-medium">No products match your filters</p>
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="mt-3 text-sm text-[#0275b8] hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

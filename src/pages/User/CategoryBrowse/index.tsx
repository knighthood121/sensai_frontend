import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Heart, Loader2, Package, Search, ShoppingCart, X } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import ProductImage from '../../../components/common/ProductImage';
import { useToast } from '../../../components/common/Toast';
import { useAppSelector } from '../../../app/hooks';
import { useListCategoriesQuery, useListProductsQuery, useListSubCategoriesQuery, useLazyGetProductDetailsQuery } from '../../../service/productsApi';
import { useToggleWishlistMutation } from '../../../service/wishlistApi';
import { useAddToCartMutation } from '../../../service/cartApi';
import { addGuestCartItem, getGuestCart } from '../../../utils/guestCart';
import { getCartUnitPrice, getCatalogImage, getCatalogPrice, getCatalogStock, getVariantStock } from '../../../utils/catalogProduct';
import type { Product } from '../../../types/Product.type';

type CatalogNode = {
  id: number; name: string; slug: string; description?: string | null;
  isActive?: boolean; productCount?: number; _count?: { products: number };
};
const sorts = [
  { value: 'name_asc', label: 'Name: A–Z' }, { value: 'name_desc', label: 'Name: Z–A' },
  { value: 'price_asc', label: 'Price: low to high' }, { value: 'price_desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest first' },
] as const;
type CatalogSort = typeof sorts[number]['value'];
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

export default function CategoryBrowse() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categorySlug = '', subCategorySlug = '' } = useParams<{ categorySlug?: string; subCategorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search')?.trim() || '';
  const requestedPage = Number(searchParams.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const sort: CatalogSort = sorts.find((item) => item.value === searchParams.get('sort'))?.value || 'name_asc';
  const [searchDraft, setSearchDraft] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [wishlistProductId, setWishlistProductId] = useState<number | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [addToCart] = useAddToCartMutation();
  const [getProductDetails] = useLazyGetProductDetailsQuery();
  const [toggleWishlist] = useToggleWishlistMutation();
  useEffect(() => { setSearchDraft(search); }, [search]);

  const { data: categoryResponse, isLoading: categoriesLoading, isError: categoriesError, refetch: reloadCategories } = useListCategoriesQuery();
  const categories = ((categoryResponse?.data || []) as CatalogNode[]).filter((category) => category.isActive !== false);
  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const { currentData: subcategoryResponse, isLoading: subcategoriesLoading, isError: subcategoriesError } = useListSubCategoriesQuery(
    activeCategory ? { categoryId: activeCategory.id } : undefined, { skip: !activeCategory },
  );
  const subcategories = ((subcategoryResponse?.data || []) as CatalogNode[]).filter((category) => category.isActive !== false);
  const activeSubcategory = subcategories.find((category) => category.slug === subCategorySlug);
  const { currentData: productsResponse, isFetching: productsLoading, isError: productsError, refetch: reloadProducts } = useListProductsQuery({
    page, limit: 24, search: search || undefined, sort,
    category: categorySlug || undefined, subcategory: subCategorySlug || undefined,
  });
  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const title = !categorySlug ? 'All products' : activeSubcategory?.name || activeCategory?.name || (categoriesLoading ? 'Product catalog' : 'Category unavailable');

  const updateQuery = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value); else next.delete(key);
    }
    setSearchParams(next);
  };
  const categoryPath = (slug: string, subslug?: string) => {
    const path = slug ? '/category/' + encodeURIComponent(slug) + (subslug ? '/' + encodeURIComponent(subslug) : '') : '/catalog';
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (sort !== 'name_asc') query.set('sort', sort);
    return path + (query.size ? '?' + query : '');
  };
  const searchCatalog = (event: FormEvent) => {
    event.preventDefault();
    updateQuery({ search: searchDraft.trim() || null, page: null });
  };

  const handleWishlist = async (productId: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to manage your wishlist.' } });
      return;
    }
    setWishlistProductId(productId);
    try {
      const response = await toggleWishlist(productId).unwrap();
      if (!response.success) throw new Error('Wishlist update failed');
      showToast(response.data.action === 'removed' ? 'Removed from wishlist.' : 'Added to wishlist.', 'success');
    } catch {
      showToast('Unable to update your wishlist. Please try again.', 'error');
    } finally { setWishlistProductId(null); }
  };

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      const response = await getProductDetails(product.id).unwrap();
      const currentProduct = response.data.product;
      const variants = response.data.variants || currentProduct.variants || [];
      if (variants.length > 1) { navigate('/product/' + product.id); return; }
      const variant = variants[0];
      if (!variant?.id) { showToast('Product options are unavailable. Please contact us for this item.', 'error'); return; }
      const stock = getVariantStock(variant);
      if (stock === null || stock < 1) { showToast('This option is currently unavailable.', 'error'); return; }
      const price = getCartUnitPrice(currentProduct, variant);
      if (price === null) { showToast('Pricing is unavailable. Please request a quote.', 'error'); return; }
      if (!isAuthenticated) {
        const existing = getGuestCart().find((item) => item.productId === product.id && item.variantId === variant.id);
        if ((existing?.quantity || 0) >= stock) { showToast('Your cart already contains the available quantity.', 'error'); return; }
        addGuestCartItem({
          productId: product.id, variantId: variant.id, quantity: 1, productName: currentProduct.name,
          slug: currentProduct.slug, image: getCatalogImage(currentProduct), price: Number(currentProduct.basePrice),
          discountPrice: currentProduct.discountPrice == null ? null : Number(currentProduct.discountPrice),
          sellingPrice: price, size: variant.size || '', color: variant.color || '', sku: variant.sku || currentProduct.sku,
          stock, itemTotal: price,
        });
      } else {
        const result = await addToCart({ productId: product.id, variantId: variant.id, quantity: 1 }).unwrap();
        if (!result.success) throw new Error('Cart update failed');
      }
      showToast('Added to cart.', 'success');
    } catch {
      showToast('Unable to add this item to your cart. Please try again.', 'error');
    } finally { setAddingProductId(null); }
  };

  return (
    <div className="min-h-screen bg-[#f2f3f4] text-[#101114]">
      <Navbar />
      <header className="border-b-4 border-[#e30613] bg-[#151619] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#ff5963]">Precision cutting solutions</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">{activeCategory?.description || 'Explore our cutting tools, compare specifications, and find the right product for your operation.'}</p>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <aside className="w-full shrink-0 rounded-xl border border-gray-200 bg-white p-5 lg:w-64" aria-label="Catalog filters">
            <button type="button" aria-expanded={filtersOpen} aria-controls="catalog-filter-options" onClick={() => setFiltersOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 text-sm font-bold lg:hidden"><span>Filter products{categorySlug ? ' · ' + (activeCategory?.name || 'Category') : ''}</span><ChevronDown size={18} className={filtersOpen ? 'rotate-180' : ''} /></button>
            <div id="catalog-filter-options" className={(filtersOpen ? 'mt-5 block' : 'hidden') + ' lg:mt-0 lg:block'}>
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wide">Categories</h2>
              <Link to="/catalog" className="text-xs font-semibold text-red-700 hover:underline">Reset all</Link>
            </div>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Product categories">
              <Link to={categoryPath('')} onClick={() => setFiltersOpen(false)} aria-current={!categorySlug ? 'page' : undefined} className={'flex items-center justify-between px-3 py-3 text-sm font-bold ' + (!categorySlug ? 'bg-red-50 text-red-700' : 'hover:bg-gray-100')}>All products <ArrowRight size={15} /></Link>
              {categoriesLoading && <p role="status" className="p-3 text-sm text-gray-600">Loading categories…</p>}
              {categoriesError && <p role="alert" className="p-3 text-sm text-red-700">Categories could not load. <button onClick={() => reloadCategories()} className="underline">Retry</button></p>}
              {!categoriesLoading && !categoriesError && categories.length === 0 && <p className="p-3 text-sm text-gray-600">No categories are available.</p>}
              {categories.map((category) => {
                const count = category.productCount ?? category._count?.products;
                return <Link key={category.id} to={categoryPath(category.slug)} onClick={() => setFiltersOpen(false)} aria-current={categorySlug === category.slug ? 'page' : undefined} className={'flex items-center justify-between gap-3 px-3 py-3 text-sm ' + (categorySlug === category.slug ? 'bg-red-50 font-bold text-red-700' : 'text-gray-700 hover:bg-gray-100')}><span>{category.name}</span>{count !== undefined && <span className="text-xs">{count}</span>}</Link>;
              })}
            </nav>
            {activeCategory && (subcategories.length > 0 || subcategoriesLoading || subcategoriesError) && <div className="mt-5 border-t border-gray-200 pt-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wide">Product type</h3>
              {subcategoriesLoading && <p className="mt-3 text-sm text-gray-600">Loading product types…</p>}
              {subcategoriesError && <p className="mt-3 text-sm text-red-700">Product types are unavailable.</p>}
              <nav className="mt-3 flex flex-col gap-1" aria-label="Product types">
                {subcategories.map((subcategory) => <Link key={subcategory.id} to={categoryPath(categorySlug, subcategory.slug)} onClick={() => setFiltersOpen(false)} aria-current={subCategorySlug === subcategory.slug ? 'page' : undefined} className={'px-3 py-2.5 text-sm ' + (subCategorySlug === subcategory.slug ? 'bg-red-50 font-bold text-red-700' : 'text-gray-700 hover:bg-gray-100')}>{subcategory.name}</Link>)}
              </nav>
            </div>}
            <div className="mt-6 border-t border-gray-200 pt-5">
              <p className="text-sm font-bold">Need help choosing?</p><p className="mt-2 text-xs leading-6 text-gray-600">Share your application and tooling requirements with our team.</p>
              <Link to="/bulk-inquiry#inquiry-form" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-700">Get solutions <ArrowRight size={16} /></Link>
            </div>
            </div>
          </aside>
          <section className="min-w-0 flex-1 self-stretch" aria-label="Product results">
            <div className="flex flex-col gap-3 sm:flex-row">
              <form onSubmit={searchCatalog} role="search" className="flex min-w-0 flex-1 border border-gray-300 bg-white">
                <label htmlFor="catalog-search" className="sr-only">Search the catalog</label>
                <input id="catalog-search" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} type="search" placeholder="Search names, SKU or keywords" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-red-600" />
                <button type="submit" aria-label="Search products" className="bg-[#e30613] px-4 text-white hover:bg-red-800"><Search size={19} /></button>
              </form>
              <label className="flex items-center gap-2 border border-gray-300 bg-white px-3 text-sm"><span className="sr-only">Sort products</span><select aria-label="Sort products" value={sort} onChange={(event) => updateQuery({ sort: event.target.value, page: null })} className="w-full bg-white py-3 outline-none">{sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600" aria-live="polite">{productsLoading ? 'Loading products…' : productsError ? 'Products unavailable' : pagination ? pagination.total.toLocaleString() + ' products found' : products.length.toLocaleString() + ' products found'}</p>
              <div className="flex flex-wrap gap-2">
                {categorySlug && <Link to={categoryPath('')} className="inline-flex items-center gap-2 border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">{activeCategory?.name || 'Category'} <X size={12} /></Link>}
                {subCategorySlug && <Link to={categoryPath(categorySlug)} className="inline-flex items-center gap-2 border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">{activeSubcategory?.name || 'Product type'} <X size={12} /></Link>}
                {search && <button onClick={() => { setSearchDraft(''); updateQuery({ search: null, page: null }); }} className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 text-xs">“{search}” <X size={12} /></button>}
              </div>
            </div>
            {productsError ? <div role="alert" className="mt-6 border border-gray-200 bg-white p-10 text-center"><Package className="mx-auto text-gray-400" size={36} /><h2 className="mt-4 font-bold">We couldn't load the catalog.</h2><p className="mt-2 text-sm text-gray-600">Please try again in a moment.</p><button onClick={() => reloadProducts()} className="mt-5 bg-red-600 px-5 py-3 text-sm font-bold text-white">Try again</button></div>
              : productsLoading && !productsResponse ? <div role="status" className="flex min-h-[320px] items-center justify-center gap-3"><Loader2 className="animate-spin text-red-600" /><span className="text-sm">Loading products…</span></div>
              : products.length === 0 ? <div className="mt-6 border border-gray-200 bg-white p-12 text-center"><Package className="mx-auto text-gray-400" size={40} /><h2 className="mt-4 text-xl font-bold">{search || categorySlug ? 'No products match your selection.' : 'No products are available yet.'}</h2><p className="mt-2 text-sm text-gray-600">Adjust your filters or ask our team about your requirements.</p><Link to="/catalog" className="mt-5 inline-block font-bold text-red-700">View all products</Link></div>
              : <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy={productsLoading}>
                {products.map((product) => {
                  const price = getCatalogPrice(product);
                  const stock = getCatalogStock(product);
                  const image = getCatalogImage(product);
                  return <article key={product.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
                    <Link to={'/product/' + product.id} className="flex aspect-[4/3] items-center justify-center border-b border-gray-100 bg-[#f9f9fa] p-6">
                      <ProductImage src={image} alt={product.name} className="h-full w-full object-contain" />
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      {product.category?.name && <p className="text-[10px] font-extrabold uppercase tracking-wide text-red-700">{product.category.name}</p>}
                      <h2 className="mt-2 text-base font-bold leading-6"><Link to={'/product/' + product.id} className="hover:text-red-700">{product.name}</Link></h2>
                      {product.sku && <p className="mt-2 break-words text-xs text-gray-500">SKU: {product.sku}</p>}
                      {(product.material || product.dimensions) && <p className="mt-2 text-xs leading-5 text-gray-600">{[product.material, product.dimensions].filter(Boolean).join(' · ')}</p>}
                      <div className="mt-auto pt-5"><p className="text-lg font-extrabold">{price === null ? 'Price on request' : money(price)}</p><p className={'mt-1 text-xs ' + (stock === 0 ? 'text-red-700' : 'text-gray-600')}>{stock === null ? 'Availability on request' : stock > 0 ? stock + ' available' : 'Out of stock'}</p></div>
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={() => handleAddToCart(product)} disabled={addingProductId === product.id || stock === 0} className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 bg-[#e30613] px-3 py-3 text-xs font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600">{addingProductId === product.id ? <Loader2 size={15} className="animate-spin" /> : <ShoppingCart size={15} />}{addingProductId === product.id ? 'Adding…' : stock === 0 ? 'Out of stock' : product.variants?.length > 1 ? 'Choose options' : 'Add to cart'}</button>
                        <button type="button" aria-label={'Save ' + product.name + ' to wishlist'} disabled={wishlistProductId === product.id} onClick={() => handleWishlist(product.id)} className="border border-gray-300 px-3 text-gray-800 hover:border-red-600 hover:text-red-700 disabled:opacity-50">{wishlistProductId === product.id ? <Loader2 className="animate-spin" size={17} /> : <Heart size={17} />}</button>
                      </div>
                    </div>
                  </article>;
                })}
              </div>}
            {!productsError && pagination && pagination.totalPages > 1 && <nav aria-label="Catalog pages" className="mt-8 flex items-center justify-between gap-3 border-t border-gray-300 pt-5"><button disabled={!pagination.hasPreviousPage || productsLoading} onClick={() => updateQuery({ page: String(page - 1) })} className="inline-flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft size={16} /> Previous</button><span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span><button disabled={!pagination.hasNextPage || productsLoading} onClick={() => updateQuery({ page: String(page + 1) })} className="inline-flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-40">Next <ChevronRight size={16} /></button></nav>}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Loader2, Package, Search, SlidersHorizontal, X } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import CatalogProductRow from './CatalogProductRow';
import './CatalogList.css';
import { useToast } from '../../../components/common/Toast';
import { useAppSelector } from '../../../app/hooks';
import { useListCategoriesQuery, useListProductsQuery, useListSubCategoriesQuery, useLazyGetProductDetailsQuery } from '../../../service/productsApi';
import { useGetWishlistQuery, useToggleWishlistMutation } from '../../../service/wishlistApi';
import { useAddToCartMutation } from '../../../service/cartApi';
import { addGuestCartItem, getGuestCart } from '../../../utils/guestCart';
import { getCartUnitPrice, getCatalogImage, getVariantStock } from '../../../utils/catalogProduct';
import type { Product } from '../../../types/Product.type';
import { getCategoryColorStyle } from '../../../utils/categoryColors';

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
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const savedProducts = new Set(wishlist?.data.map((item) => item.productId) ?? []);
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

  const selectFilter = (path: string) => { setFiltersOpen(false); navigate(path); };

  return <div className="catalog-page">
    <Navbar />
    <main className="catalog-page__inner" style={getCategoryColorStyle(activeCategory?.id)}>
      <nav className="catalog-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} aria-hidden="true" /><Link to="/catalog" aria-current={!categorySlug ? 'page' : undefined}>Products</Link>{activeCategory && <><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">{title}</span></>}</nav>
      <header className="catalog-page__heading"><div><p>Precision cutting solutions</p><h1>{title}</h1></div><Link to="/bulk-inquiry#inquiry-form">Need help selecting a tool? <ArrowRight size={16} aria-hidden="true" /></Link></header>
      <div className="catalog-layout">
        <aside className="catalog-filters" aria-label="Catalog filters">
          <div className="catalog-filters__heading"><h2>Filters</h2><Link to="/catalog" onClick={() => setFiltersOpen(false)}>Clear all filters</Link></div>
          <button type="button" className="catalog-filters__toggle" aria-expanded={filtersOpen} aria-controls="catalog-filter-options" onClick={() => setFiltersOpen(open => !open)}><span><SlidersHorizontal size={16} aria-hidden="true" />Filter products</span><ChevronDown size={17} aria-hidden="true" className={filtersOpen ? 'is-open' : ''} /></button>
          <div id="catalog-filter-options" className={`catalog-filters__options${filtersOpen ? ' is-open' : ''}`}>
            <details className="catalog-filter-group" open>
              <summary>Category <ChevronDown size={16} aria-hidden="true" /></summary>
              <fieldset><legend className="sr-only">Product category</legend>
                <label className={`catalog-filter-option${!categorySlug ? ' is-selected' : ''}`}><input type="radio" name="category" checked={!categorySlug} onChange={() => selectFilter(categoryPath(''))} /><span>All products</span></label>
                {categoriesLoading && <p className="catalog-filters__status" role="status">Loading categories...</p>}
                {categoriesError && <p className="catalog-filters__status" role="alert">Categories could not load. <button type="button" onClick={() => void reloadCategories()}>Retry</button></p>}
                {!categoriesLoading && !categoriesError && categories.length === 0 && <p className="catalog-filters__status">No categories available.</p>}
                {categories.map(category => {
                  const count = category.productCount ?? category._count?.products;
                  return <label key={category.id} style={getCategoryColorStyle(category.id)} className={`catalog-filter-option catalog-filter-option--category${categorySlug === category.slug ? ' is-selected' : ''}`}><input type="radio" name="category" checked={categorySlug === category.slug} onChange={() => selectFilter(categoryPath(category.slug))} /><span>{category.name}</span>{count !== undefined && <small>{count.toLocaleString()}</small>}</label>;
                })}
              </fieldset>
            </details>
            {activeCategory && <details className="catalog-filter-group" open>
              <summary>Product type <ChevronDown size={16} aria-hidden="true" /></summary>
              {subcategoriesLoading ? <p className="catalog-filters__status" role="status">Loading product types...</p> : subcategoriesError ? <p className="catalog-filters__status">Product types could not load.</p> : subcategories.length ? <fieldset><legend className="sr-only">Product type</legend>
                <label className={`catalog-filter-option${!subCategorySlug ? ' is-selected' : ''}`}><input type="radio" name="subcategory" checked={!subCategorySlug} onChange={() => selectFilter(categoryPath(categorySlug))} /><span>All product types</span></label>
                {subcategories.map(subcategory => <label key={subcategory.id} className={`catalog-filter-option${subCategorySlug === subcategory.slug ? ' is-selected' : ''}`}><input type="radio" name="subcategory" checked={subCategorySlug === subcategory.slug} onChange={() => selectFilter(categoryPath(categorySlug, subcategory.slug))} /><span>{subcategory.name}</span>{(subcategory.productCount ?? subcategory._count?.products) !== undefined && <small>{subcategory.productCount ?? subcategory._count?.products}</small>}</label>)}
              </fieldset> : <p className="catalog-filters__status">No product types in this category.</p>}
            </details>}
            <div className="catalog-filters__help"><p>Find your cutting solution.</p><span>Select a category and product type to narrow your search.</span><Link to="/bulk-inquiry#inquiry-form">Talk to our team <ArrowRight size={14} aria-hidden="true" /></Link></div>
          </div>
        </aside>
        <section className="catalog-results" aria-label="Product results" aria-busy={productsLoading}>
          <div className="catalog-toolbar">
            <form className="catalog-search" role="search" onSubmit={searchCatalog}><Search size={21} aria-hidden="true" /><label htmlFor="catalog-search" className="sr-only">Search by name or SKU</label><input id="catalog-search" type="search" placeholder="Search by Name or by SKU" value={searchDraft} onChange={event => setSearchDraft(event.target.value)} /><button type="submit">Search</button></form>
            <label className="catalog-sort"><span className="sr-only">Sort products</span><select aria-label="Sort products" value={sort} onChange={event => updateQuery({ sort: event.target.value, page: null })}>{sorts.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
          </div>
          <div className="catalog-active-filters" aria-label="Active filters">
            {categorySlug && <Link to={categoryPath('')} aria-label="Remove category filter">Category: {activeCategory?.name || categorySlug}<X size={13} aria-hidden="true" /></Link>}
            {subCategorySlug && <Link to={categoryPath(categorySlug)} aria-label="Remove product type filter">Type: {activeSubcategory?.name || subCategorySlug}<X size={13} aria-hidden="true" /></Link>}
            {search && <button type="button" onClick={() => { setSearchDraft(''); updateQuery({ search: null, page: null }); }} aria-label="Remove search filter">Search: {search}<X size={13} aria-hidden="true" /></button>}
            {(categorySlug || search) && <Link to="/catalog" className="catalog-active-filters__clear">Clear all filters</Link>}
          </div>
          <div className="catalog-list__heading">
            <p className="catalog-list__count" aria-live="polite">{productsLoading ? 'Loading products...' : productsError ? 'Products unavailable' : (pagination?.total ?? products.length).toLocaleString() + ' products found'}</p>
            <div aria-hidden="true">Product data</div><div aria-hidden="true">Specifications</div><div aria-hidden="true">Price &amp; availability</div><div aria-hidden="true">Wishlist &amp; cart</div>
          </div>
          {productsError ? <div className="catalog-state" role="alert"><Package size={35} aria-hidden="true" /><h2>We couldn't load the catalog.</h2><p>Please try again in a moment.</p><button type="button" onClick={() => void reloadProducts()}>Try again</button></div>
            : productsLoading && !productsResponse ? <div className="catalog-state" role="status"><Loader2 size={28} className="animate-spin" aria-hidden="true" /><p>Loading products...</p></div>
            : products.length === 0 ? <div className="catalog-state"><Package size={40} aria-hidden="true" /><h2>{search || categorySlug ? 'No products match your selection.' : 'No products are available yet.'}</h2><p>Adjust your filters or ask our team about your requirements.</p><Link to="/catalog">View all products</Link></div>
            : <div className="catalog-product-list">{products.map(product => <CatalogProductRow key={product.id} product={product} saved={savedProducts.has(product.id)} saving={wishlistProductId === product.id} adding={addingProductId === product.id} onAddToCart={() => void handleAddToCart(product)} onWishlist={() => void handleWishlist(product.id)} />)}</div>}
          {!productsError && pagination && pagination.totalPages > 1 && <nav aria-label="Catalog pages" className="catalog-pagination"><button type="button" disabled={!pagination.hasPreviousPage || productsLoading} onClick={() => updateQuery({ page: String(page - 1) })}><ChevronLeft size={16} aria-hidden="true" />Previous</button><span>Page {pagination.page} of {pagination.totalPages}</span><button type="button" disabled={!pagination.hasNextPage || productsLoading} onClick={() => updateQuery({ page: String(page + 1) })}>Next<ChevronRight size={16} aria-hidden="true" /></button></nav>}
        </section>
      </div>
    </main>
    <Footer />
  </div>;
}

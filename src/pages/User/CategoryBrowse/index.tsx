import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Hexagon, Loader2, Star, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import {
  useListCategoriesQuery,
  useListProductsQuery,
  useListSubCategoriesQuery,
} from '../../../service/productsApi';
import type { Product } from '../../../types/Product.type';

type CatalogNode = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  productCount?: number;
};

type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'name';


const money = (value: number) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const titleFromSlug = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const productImage = (product: Product) =>
  product.images?.find((image) => image.isPrimary)?.imageUrl ||
  product.images?.[0]?.imageUrl ||
  'https://placehold.co/700x700/f6f6f6/222?text=Drill+Bit';

const productPrice = (product: Product) =>
  Number(product.variants?.[0]?.price ?? product.sellingPrice ?? product.basePrice ?? 0);

const productComparePrice = (product: Product) =>
  Number(product.basePrice ?? 0);

const productStock = (product: Product) => {
  if (typeof product.totalStock === 'number') return product.totalStock;
  return (product.variants || []).reduce(
    (total, variant) => total + Number(variant.stock || 0),
    0,
  );
};

function ShippingStrip() {
  return (
    <div className="flex h-14 items-center justify-between bg-[#111] px-[max(24px,10.5vw)] text-white">
      <ChevronLeft className="h-5 w-5 text-white/50" strokeWidth={1.5} />
      <p className="text-center text-[15px] tracking-[0.07em] sm:text-[19px]">
        FREE Standard Shipping on all orders above Rs.799 🤑
      </p>
      <ChevronRight className="h-5 w-5 text-white/50" strokeWidth={1.5} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[480px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#7226ff]" />
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto flex min-h-[420px] max-w-7xl flex-col items-center justify-center px-6 text-center">
      <Hexagon className="mb-5 h-14 w-14 text-[#7226ff]" strokeWidth={1.4} />
      <h2 className="text-3xl font-normal text-[#171717]">{title}</h2>
      <p className="mt-3 max-w-xl text-base text-[#666]">{message}</p>
    </div>
  );
}

function SubcategoryView({
  category,
  subcategories,
}: {
  category: CatalogNode;
  subcategories: CatalogNode[];
}) {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-[620px] max-w-[1510px] px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
      <h1 className="mb-12 text-[44px] font-normal leading-tight tracking-[-0.035em] text-[#111] sm:text-[58px]">
        {category.name}
      </h1>

      <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            type="button"
            onClick={() => navigate(`/category/${category.slug}/${subcategory.slug}`)}
            className="group text-left"
          >
            <div className="aspect-square w-full overflow-hidden bg-[#fafafa]">
              {subcategory.image ? (
                <img
                  src={subcategory.image}
                  alt={subcategory.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.035]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white to-[#f0f0f0]">
                  <Wrench className="h-24 w-24 text-[#252525]" strokeWidth={1.15} />
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center gap-3 text-[25px] leading-tight text-[#202020]">
              <span className="underline decoration-1 underline-offset-4">{subcategory.name}</span>
              <span aria-hidden="true">→</span>
            </div>
            {!!subcategory.productCount && (
              <p className="mt-2 text-sm text-[#777]">
                {subcategory.productCount} product{subcategory.productCount === 1 ? '' : 's'}
              </p>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}

function ProductCard({
  product,
  quantity,
  setQuantity,
}: {
  product: Product;
  quantity: number;
  setQuantity: (value: number) => void;
}) {
  const navigate = useNavigate();
  const price = productPrice(product);
  const compareAt = productComparePrice(product);
  const soldOut = productStock(product) <= 0;
  const onSale = compareAt > price;
  const rating = Math.max(0, Math.min(5, Math.round(Number(product.averageRating || 0))));

  const openProduct = () => navigate(`/product/${product.id}`);

  return (
    <article className="flex min-w-0 flex-col">
      <button
        type="button"
        onClick={openProduct}
        className="group relative aspect-square w-full overflow-hidden bg-[#fafafa] text-left"
      >
        <img
          src={productImage(product)}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {(soldOut || onSale) && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#161616] px-4 py-1.5 text-xs tracking-[0.08em] text-white">
            {soldOut ? 'Sold out' : 'Sale'}
          </span>
        )}
      </button>

      <button type="button" onClick={openProduct} className="mt-5 text-left">
        <h2 className="line-clamp-4 text-[17px] leading-[1.42] text-[#252525] hover:underline">
          {product.name}
        </h2>
      </button>

      {Number(product.averageRating || 0) > 0 && (
        <div className="mt-2 flex items-center gap-1" aria-label={`${product.averageRating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={`h-3.5 w-3.5 ${index < rating ? 'fill-black text-black' : 'text-[#bbb]'}`}
              strokeWidth={1.3}
            />
          ))}
          <span className="ml-1 text-xs text-[#555]">({product.reviewCount || 0})</span>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px]">
        {onSale && <span className="text-[#777] line-through">{money(compareAt)}</span>}
        <span className="text-[#222]">{money(price)}</span>
      </div>

      <div className="mt-auto pt-5">
        {soldOut ? (
          <div className="flex h-12 items-center justify-center border border-[#aaa] text-sm text-[#999]">
            Sold out
          </div>
        ) : (
          <div className="grid h-12 grid-cols-3 items-center border border-[#8d8d8d] text-[#292929]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="h-full text-xl text-[#777] hover:bg-[#f4f4f4]"
              aria-label={`Remove one ${product.name}`}
            >
              −
            </button>
            <span className="text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="h-full text-xl hover:bg-[#f4f4f4]"
              aria-label={`Add one ${product.name}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function ProductGridView({
  category,
  subcategory,
  products,
}: {
  category: CatalogNode;
  subcategory?: CatalogNode;
  products: Product[];
}) {
  const [sort, setSort] = useState<SortMode>('featured');
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const visibleProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sort === 'price-asc') return productPrice(a) - productPrice(b);
      if (sort === 'price-desc') return productPrice(b) - productPrice(a);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
    });
  }, [products, sort]);

  const title = subcategory?.name || category.name;

  return (
    <main className="mx-auto min-h-[700px] max-w-[1570px] px-6 py-12 sm:px-9 lg:px-12">
      <h1 className="text-[44px] font-normal leading-tight tracking-[-0.035em] text-[#111] sm:text-[58px]">
        {title}
      </h1>

      <div className="mt-9 flex justify-end text-sm text-[#333]">
        <div className="flex items-center gap-5">
          <label htmlFor="catalog-sort">Sort by:</label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="min-w-32 border-0 bg-transparent py-2 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="name">Alphabetically</option>
          </select>
          <span>{visibleProducts.length} products</span>
        </div>
      </div>


      {visibleProducts.length ? (
        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-6">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantities[product.id] || 0}
              setQuantity={(value) =>
                setQuantities((current) => ({ ...current, [product.id]: value }))
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products found"
          message="Try clearing a filter, or add products to this category from the admin dashboard."
        />
      )}
    </main>
  );
}

export default function CategoryBrowse() {
  const { categorySlug = '', subCategorySlug } = useParams<{
    categorySlug: string;
    subCategorySlug?: string;
  }>();

  const { data: categoriesResponse, isLoading: categoriesLoading } = useListCategoriesQuery();
  const categories = (categoriesResponse?.data || []) as CatalogNode[];
  const category = categories.find((item) => item.slug === categorySlug);

  const {
    data: subcategoriesResponse,
    isLoading: subcategoriesLoading,
  } = useListSubCategoriesQuery(category ? { categoryId: category.id } : undefined, {
    skip: !category,
  });
  const subcategories = (subcategoriesResponse?.data || []) as CatalogNode[];
  const subcategory = subcategories.find((item) => item.slug === subCategorySlug);

  const shouldShowProducts =
    Boolean(category) &&
    (Boolean(subCategorySlug) || (!subcategoriesLoading && subcategories.length === 0));

  const {
    data: productsResponse,
    isLoading: productsLoading,
  } = useListProductsQuery(
    {
      page: 1,
      limit: 100,
      category: categorySlug,
      ...(subCategorySlug ? { subcategory: subCategorySlug } : {}),
    },
    { skip: !shouldShowProducts },
  );

  const products = (productsResponse?.data || []) as Product[];
  const fallbackCategory: CatalogNode = {
    id: 0,
    name: titleFromSlug(categorySlug),
    slug: categorySlug,
  };

  return (
    <div className="min-h-screen bg-white text-[#181818]">
      <Navbar />
      <ShippingStrip />

      {categoriesLoading || subcategoriesLoading || (shouldShowProducts && productsLoading) ? (
        <LoadingState />
      ) : !category ? (
        <EmptyState
          title={fallbackCategory.name || 'Category not found'}
          message="This category is not available yet. Create it in the admin dashboard, then add its subcategories and products."
        />
      ) : shouldShowProducts ? (
        <ProductGridView
          category={category}
          subcategory={subcategory}
          products={products}
        />
      ) : (
        <SubcategoryView category={category} subcategories={subcategories} />
      )}

      <Footer />
    </div>
  );
}

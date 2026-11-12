import { useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, Building2, CarFront, ChevronRight, Headphones, Pill, Plane, ShieldCheck, Truck } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import ProductImage from '../../../components/common/ProductImage';
import { useGetHomeQuery } from '../../../service/homeApi';
import { useListProductsQuery } from '../../../service/productsApi';
import type { Product } from '../../../types/Product.type';
import { getCatalogPrice } from '../../../utils/catalogProduct';
import PrecisionHero from './PrecisionHero';
import './PrecisionHome.css';

const benefits = [
  { icon: ShieldCheck, title: 'Uncompromising Quality', description: 'We deliver high-quality cutting tools engineered for precision and long service life.' },
  { icon: Truck, title: 'Fast & Reliable Delivery', description: 'We ensure your order reaches you on time, keeping your operations running without downtime.' },
  { icon: Headphones, title: 'Customer Support', description: 'Our knowledgeable team is always ready to help you choose the right solution for your machining needs.' },
];
const industries = [
  { icon: CarFront, name: 'Automobile' }, { icon: Plane, name: 'Aviation' },
  { icon: Pill, name: 'Pharmaceutical' }, { icon: Building2, name: 'Construction' },
];

function productPrice(product: Product) {
  const price = getCatalogPrice(product);
  return price === null ? 'Price on request' : price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
}

function ToolDrawing() {
  return <svg className="precision-cta__drawing" viewBox="0 0 600 360" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.2">
    <circle cx="355" cy="242" r="118" /><circle cx="355" cy="242" r="105" /><circle cx="355" cy="242" r="86" /><circle cx="355" cy="242" r="66" /><circle cx="355" cy="242" r="27" />
    <path d="m-40 350 294-124m187-125 192-85M460 173l173-82M343 124l16-114 59-32 63 72-22 133-72 35-9-79-35-15ZM365 122l15-78 28-14 33 32-16 104-29 12-1-44-30-12Z" />
    <path d="M237 242h236M355 124v236m-19-117 38-2m-20-19 2 40m-81-110 23 21m117 140 21 21M254 300l28-18m148-98 28-17" />
    <path strokeDasharray="7 7" d="M355 66v294M174 242h362M260 162l185 160" /><path d="m260 154-18-26 50-29 10 30M234 223l-23-4-1 42 25-2m18 50-18 18 36 31 15-23M430 326l15 19 30-42-18-12" />
  </g></svg>;
}

export default function LandingPageScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const home = useGetHomeQuery(undefined, { refetchOnMountOrArgChange: true, refetchOnFocus: true, pollingInterval: 60000 });
  const categories = home.data?.data?.categories ?? [];
  const requestedCategory = searchParams.get('operation');
  const category = categories.find((item) => item.slug === requestedCategory) ?? categories[0];
  const productQuery = useListProductsQuery({ categoryId: category?.id, page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }, { skip: home.isLoading, refetchOnMountOrArgChange: true, refetchOnFocus: true });
  const products = productQuery.currentData?.data ?? [];
  const [featured, ...remaining] = products;
  const categoryPath = category ? `/category/${category.slug}` : '/catalog';
  const [horizontalTabs, setHorizontalTabs] = useState(() => window.matchMedia('(max-width: 680px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 680px)');
    const update = () => setHorizontalTabs(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  const selectCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('operation', slug);
    setSearchParams(next, { replace: true, preventScrollReset: true });
  };
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + categories.length - 1) % categories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categories.length - 1;
    else return;
    event.preventDefault();
    selectCategory(categories[next].slug);
    document.getElementById(`operation-${categories[next].id}`)?.focus();
  };
  const productImage = (product: Product) => product.images?.find((image) => image.isPrimary) ?? product.images?.[0];
  const renderProduct = (product: Product) => <Link className="precision-product-card" key={product.id} to={`/product/${product.id}`}>
    <div className="precision-product-card__image"><ProductImage src={productImage(product)?.imageUrl} alt={productImage(product)?.altText || product.name} /></div>
    <div className="precision-product-card__label"><h3>{product.name}</h3><ArrowRight size={22} aria-hidden="true" /></div>
    <p className="precision-product-card__price">{productPrice(product)}</p>
  </Link>;

  return <div className="precision-home" id="top">
    <a className="precision-skip-link" href="#main-content">Skip to content</a>
    <Navbar />
    <main id="main-content">
      <PrecisionHero banners={home.data?.data?.banners ?? []} loading={home.isLoading} error={home.isError} onRetry={() => void home.refetch()} />
      <section className="precision-statement" aria-labelledby="precision-statement-heading"><div className="precision-container">
        <h2 id="precision-statement-heading">Precision. <span>Durability.</span> Reliability.</h2><p>Dependable cutting tools for demanding machining operations.</p>
      </div></section>
      <section className="precision-products" id="products" aria-labelledby="precision-products-heading"><div className="precision-container">
        <div className="precision-products__heading"><div><p className="precision-eyebrow">Our Products</p><h2 id="precision-products-heading" className="precision-section-heading">The right tool. Every operation.</h2></div><Link to="/catalog" className="precision-text-link">All products <ArrowRight size={18} /></Link></div>
        <div className={`precision-showcase${categories.length ? '' : ' precision-showcase--no-tabs'}`}>
          {categories.length > 0 && <div className="precision-operation-tabs" role="tablist" aria-label="Product categories" aria-orientation={horizontalTabs ? 'horizontal' : 'vertical'}>
            {categories.map((item, index) => <button type="button" role="tab" id={`operation-${item.id}`} key={item.id} aria-selected={category?.id === item.id} aria-controls="precision-product-panel" tabIndex={category?.id === item.id ? 0 : -1} className={category?.id === item.id ? 'is-selected' : ''} onClick={() => selectCategory(item.slug)} onKeyDown={(event) => handleTabKey(event, index)}>{item.name}<ChevronRight size={19} aria-hidden="true" /></button>)}
          </div>}
          <div className="precision-product-panel" id="precision-product-panel" role={category ? 'tabpanel' : undefined} aria-labelledby={category ? `operation-${category.id}` : 'precision-products-heading'} tabIndex={0} aria-busy={home.isLoading || productQuery.isFetching}>
            {home.isLoading || productQuery.isFetching ? <div className="precision-products__state" role="status">Loading products?</div> : productQuery.isError ? <div className="precision-products__state" role="alert"><h3>Products could not be loaded.</h3><p>Please try again.</p><button className="precision-button" type="button" onClick={() => void productQuery.refetch()}>Retry products</button></div> : featured ? <>
              <Link className="precision-featured-product" to={`/product/${featured.id}`}>
                <div className="precision-featured-product__image"><ProductImage src={productImage(featured)?.imageUrl} alt={productImage(featured)?.altText || featured.name} /></div>
                <div className="precision-featured-product__copy"><h3>{featured.name}</h3>{featured.shortDescription && <p>{featured.shortDescription}</p>}<p className="precision-product-card__price">{productPrice(featured)}</p><span className="precision-featured-product__link">View product <ArrowRight size={17} aria-hidden="true" /></span></div>
              </Link>
              {remaining.length > 0 && <div className="precision-product-grid" style={{ '--product-count': Math.min(4, remaining.length) } as CSSProperties} aria-label={`${category?.name ?? 'Latest'} products`}>{remaining.map(renderProduct)}</div>}
            </> : <div className="precision-products__state" role="status"><h3>No products available{category ? ` in ${category.name}` : ''}.</h3><p>Explore the catalog or contact our team for help finding a tool.</p><Link to="/bulk-inquiry#inquiry-form" className="precision-text-link">Talk to our team <ArrowRight size={18} /></Link></div>}
          </div>
        </div>
        <div className="precision-products__more"><Link to={categoryPath} className="precision-button">View {category ? category.name : 'all products'} <ArrowRight size={18} /></Link></div>
      </div></section>
      <section className="precision-benefits" aria-labelledby="precision-benefits-heading"><div className="precision-container">
        <h2 className="precision-eyebrow" id="precision-benefits-heading">Why Choose SANSEI</h2><div className="precision-benefit-list">{benefits.map(({ icon: Icon, title, description }) => <article className="precision-benefit" key={title}><Icon className="precision-benefit__icon" size={56} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div>
      </div></section>
      <section className="precision-industries" aria-labelledby="precision-industries-heading"><div className="precision-container">
        <h2 className="precision-eyebrow" id="precision-industries-heading">Industries We Serve</h2><div className="precision-industry-grid">{industries.map(({ icon: Icon, name }) => <div className="precision-industry" key={name}><Icon size={43} strokeWidth={1.6} aria-hidden="true" /><h3>{name}</h3></div>)}</div>
      </div></section>
      <section className="precision-cta" aria-labelledby="precision-cta-heading"><ToolDrawing /><div className="precision-container precision-cta__content"><h2 id="precision-cta-heading">Ready to improve your<br />machining performance?</h2><Link to="/bulk-inquiry#inquiry-form" className="precision-button">Get Solutions</Link></div></section>
    </main>
    <Footer />
  </div>;
}

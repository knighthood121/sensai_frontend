import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import ProductImage from '../../../components/common/ProductImage';
import { useCreateBulkInquiryMutation } from '../../../service/bulkInquiryApi';
import { useListCategoriesQuery, useListProductsQuery } from '../../../service/productsApi';
import { getInitialInquiryRequirements } from '../../../utils/inquiryContext';
import { getCatalogImage, getCatalogPrice, getCatalogStock, makeProductInquiry } from '../../../utils/catalogProduct';
import type { Product } from '../../../types/Product.type';

type CatalogCategory = { id: number; name: string; isActive?: boolean };
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

export default function BulkInquiry() {
  const { search, hash } = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  // Seed once; incoming catalog data never replaces the user's inquiry draft.
  const [requirements, setRequirements] = useState(() => getInitialInquiryRequirements(search));
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [createInquiry, { isLoading }] = useCreateBulkInquiryMutation();
  const { data: categoriesResponse, isLoading: categoriesLoading, isError: categoriesError } = useListCategoriesQuery();
  const categories = ((categoriesResponse?.data || []) as CatalogCategory[]).filter((category) => category.isActive !== false);
  const { currentData: productsResponse, isFetching: productsLoading, isError: productsError, refetch: reloadProducts } = useListProductsQuery({ page, limit: 12, categoryId, sort: 'name_asc' });
  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  useEffect(() => {
    if (hash !== '#inquiry-form') return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('inquiry-form')?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  const handleInquireProduct = (product: Product) => {
    setRequirements(makeProductInquiry(product));
    setSubmitted(false);
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitted(false);
    setSubmissionError('');
    try {
      const response = await createInquiry({
        name: String(data.get('name')), email: String(data.get('email')),
        phone: String(data.get('phone')), company: String(data.get('company')),
        inquiryType: String(data.get('inquiryType')),
        requirements: requirements || String(data.get('requirements')),
      }).unwrap();
      if (!response.success) throw new Error('Inquiry was not accepted');
      setSubmitted(true);
      setRequirements('');
      form.reset();
    } catch {
      setSubmissionError("We couldn't send your request. Your details have been kept. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#101114]">
      <Navbar />
      <main>
        <header className="border-b-4 border-[#e30613] bg-[#151619] text-white">
          <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#ff5963]">The right solution starts here</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Let's talk tooling.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">Tell us about your application, required quantities, and specifications. Our team can help you find the right cutting solution.</p>
            <a href="#inquiry-form" className="mt-6 inline-flex items-center gap-3 bg-[#e30613] px-6 py-3 text-sm font-bold text-white hover:bg-red-800">Send an inquiry <ArrowRight size={17} /></a>
          </div>
        </header>

        <section id="bulk-products" className="bg-[#f2f3f4] py-12">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-red-700">Explore the catalog</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Tools for your next operation.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">Select a product to include it in your inquiry. Volume pricing and delivery requirements can be discussed with our team.</p>
              </div>
              <div className="shrink-0">
                <label htmlFor="inquiry-category" className="mb-2 block text-xs font-bold uppercase tracking-wide">Product category</label>
                <select id="inquiry-category" value={categoryId ?? ''} disabled={categoriesLoading || categoriesError} onChange={(event) => { setCategoryId(event.target.value ? Number(event.target.value) : undefined); setPage(1); }} className="w-full border border-gray-300 bg-white px-3 py-3 text-sm focus:border-red-600">
                  <option value="">All products</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                {categoriesError && <p className="mt-2 text-xs text-red-700">Category filters are unavailable.</p>}
              </div>
            </div>

            {productsError ? <div role="alert" className="border border-gray-200 bg-white p-10 text-center"><Package className="mx-auto text-gray-400" size={36} /><h3 className="mt-4 text-lg font-bold">Products couldn't be loaded.</h3><p className="mt-2 text-sm text-gray-600">You can still send your requirements using the form below.</p><button onClick={() => reloadProducts()} className="mt-5 border border-gray-300 px-5 py-2 text-sm font-bold hover:border-red-600">Try again</button></div>
              : productsLoading && !productsResponse ? <div role="status" className="flex min-h-64 items-center justify-center gap-3"><Loader2 className="animate-spin text-red-600" /><span className="text-sm">Loading products…</span></div>
              : products.length === 0 ? <div className="border border-gray-200 bg-white p-10 text-center"><Package className="mx-auto text-gray-400" size={36} /><h3 className="mt-4 text-lg font-bold">No products are available in this selection.</h3><p className="mt-2 text-sm text-gray-600">Tell us what you need in the inquiry form below.</p></div>
              : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy={productsLoading}>
                {products.map((product) => {
                  const price = getCatalogPrice(product);
                  const stock = getCatalogStock(product);
                  const image = getCatalogImage(product);
                  return <article key={product.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
                    <Link to={'/product/' + product.id} className="flex aspect-[4/3] items-center justify-center border-b border-gray-100 bg-[#fafafa] p-6">
                      <ProductImage src={image} alt={product.name} className="h-full w-full object-contain" />
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      {product.category?.name && <p className="text-[10px] font-extrabold uppercase tracking-wide text-red-700">{product.category.name}</p>}
                      <h3 className="mt-2 text-base font-bold leading-6"><Link to={'/product/' + product.id} className="hover:text-red-700">{product.name}</Link></h3>
                      {product.material && <p className="mt-2 text-xs leading-5 text-gray-600">{product.material}</p>}
                      {product.sku && <p className="mt-2 break-words text-xs text-gray-500">SKU: {product.sku}</p>}
                      <div className="mt-auto border-b border-gray-100 pb-4 pt-5">
                        <p className="text-xs text-gray-500">Catalog price</p>
                        <p className="mt-1 text-lg font-extrabold">{price === null ? 'Price on request' : money(price)}</p>
                        {product.packQuantity > 0 && <p className="mt-2 text-xs text-gray-600">Pack quantity: {product.packQuantity}{product.unitOfMeasure ? ' ' + product.unitOfMeasure : ''}</p>}
                        <p className={'mt-2 text-xs ' + (stock === 0 ? 'text-red-700' : 'text-gray-600')}>{stock === null ? 'Availability on request' : stock === 0 ? 'Out of stock — ask about availability' : stock + ' available'}</p>
                      </div>
                      <button type="button" onClick={() => handleInquireProduct(product)} className="mt-4 inline-flex items-center justify-center gap-2 bg-[#e30613] px-4 py-3 text-xs font-bold text-white hover:bg-red-800"><Package size={15} />Request a quote</button>
                      <Link to={'/product/' + product.id} className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-semibold text-gray-700 hover:text-red-700">View specifications <ChevronRight size={13} /></Link>
                    </div>
                  </article>;
                })}
              </div>}
            {!productsError && pagination && pagination.totalPages > 1 && <nav aria-label="Inquiry product pages" className="mt-7 flex items-center justify-between gap-3"><button disabled={!pagination.hasPreviousPage || productsLoading} onClick={() => setPage((value) => value - 1)} className="inline-flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft size={16} />Previous</button><span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span><button disabled={!pagination.hasNextPage || productsLoading} onClick={() => setPage((value) => value + 1)} className="inline-flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-40">Next<ChevronRight size={16} /></button></nav>}
          </div>
        </section>

        <section id="inquiry-form" className="scroll-mt-6 px-5 py-14 sm:px-8 sm:py-20">
          <form onSubmit={submit} className="mx-auto max-w-4xl border-t-4 border-[#e30613] bg-[#f5f5f6] p-6 sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-wide text-red-700">Get in touch</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Share your requirements.</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">Tell us about your tooling, quantities and application. Our team will get in touch to help with your request.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone number" name="phone" type="tel" required />
              <Field label="Company name" name="company" required />
              <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wide">Inquiry type</span>
                <select name="inquiryType" defaultValue={new URLSearchParams(search).get('request') === 'catalog' ? 'Catalog request' : 'Bulk order inquiry'} className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600">
                  <option>Bulk order inquiry</option><option>Custom size inquiry</option><option>Dealer inquiry</option><option>Catalog request</option>
                </select>
              </label>
              <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wide">Requirements <span className="text-red-600">*</span></span>
                <textarea name="requirements" required rows={7} value={requirements} onChange={(event) => setRequirements(event.target.value)} placeholder="Product names, sizes, quantities and specifications" className="w-full border border-gray-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-red-600" />
              </label>
            </div>
            <button disabled={isLoading} className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#e30613] px-6 py-3.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-60">{isLoading && <Loader2 className="animate-spin" size={17} />}{isLoading ? 'Submitting…' : 'Submit request'}</button>
            {submissionError && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{submissionError}</p>}
            {submitted && <p role="status" className="mt-4 text-sm font-medium text-gray-800">Your inquiry has been submitted successfully. Our team will be in touch.</p>}
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label><span className="mb-2 block text-xs font-bold uppercase tracking-wide">{label}{required && <span className="text-red-600"> *</span>}</span><input name={name} type={type} required={required} className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600" /></label>;
}

import { useState, useMemo, type FormEvent } from 'react';
import { Mail, MapPin, Phone, Package, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useCreateBulkInquiryMutation } from '../../../service/bulkInquiryApi';
import { useListProductsQuery } from '../../../service/productsApi';
import { FONTS } from '../../../constant/style';

interface BulkProductItem {
  id: number;
  name: string;
  category: string;
  categoryType: 'drill-bits' | 'taps' | 'specialty';
  price: number;
  oldPrice?: number;
  bulkPrice: number;
  minQty: string;
  image: string;
  badge?: string;
  material: string;
}

const FALLBACK_BULK_PRODUCTS: BulkProductItem[] = [
  {
    id: 101,
    name: '8mm HSS Parallel Shank Drill Bit (Pack of 50)',
    category: 'HSS Drill Bits',
    categoryType: 'drill-bits',
    price: 295,
    oldPrice: 350,
    bulkPrice: 220,
    minQty: '50 pcs',
    image: '/images/drill-bits/hss-drill-bit.png',
    badge: 'BESTSELLER',
    material: 'High Speed Steel M2 Fully Ground',
  },
  {
    id: 102,
    name: 'M6 x 1.0 HSS Hand Tap Set (Pack of 20 Sets)',
    category: 'Hand Taps',
    categoryType: 'taps',
    price: 290,
    oldPrice: 340,
    bulkPrice: 215,
    minQty: '20 sets',
    image: '/images/drill-bits/hand-taps.png',
    badge: 'BULK PACK',
    material: 'HSS Precision Ground Thread',
  },
  {
    id: 103,
    name: '6mm Masonry Hammer Drill Bit (Pack of 100)',
    category: 'Masonry Bits',
    categoryType: 'specialty',
    price: 185,
    oldPrice: 230,
    bulkPrice: 135,
    minQty: '100 pcs',
    image: '/images/drill-bits/masonry-drill-bit.png',
    badge: 'INDUSTRIAL',
    material: 'Tungsten Carbide Cross Tip',
  },
  {
    id: 104,
    name: '12mm Flat Wood Spade Drill Bit (Pack of 40)',
    category: 'Woodworking',
    categoryType: 'specialty',
    price: 240,
    oldPrice: 290,
    bulkPrice: 175,
    minQty: '40 pcs',
    image: '/images/drill-bits/flat-wood-drill-bit.png',
    badge: 'HIGH DEMAND',
    material: 'High Carbon Steel Polished',
  },
  {
    id: 105,
    name: '10mm Glass & Ceramic Tile Drill Bit (Pack of 30)',
    category: 'Specialty Bits',
    categoryType: 'specialty',
    price: 320,
    oldPrice: 380,
    bulkPrice: 240,
    minQty: '30 pcs',
    image: '/images/drill-bits/glass-tile-drill-bits.png',
    badge: 'PRO SERIES',
    material: 'Titanium Coated Carbide Spear',
  },
  {
    id: 106,
    name: 'M8 x 1.25 HSS Hand Tap 3-Piece Set (Pack of 25)',
    category: 'Hand Taps',
    categoryType: 'taps',
    price: 380,
    oldPrice: 450,
    bulkPrice: 285,
    minQty: '25 sets',
    image: '/images/drill-bits/hand-taps.png',
    badge: 'FACTORY DIRECT',
    material: 'HSS-E Cobalt Alloy Ground',
  },
  {
    id: 107,
    name: '5mm HSS Parallel Shank Drill Bit (Pack of 50)',
    category: 'HSS Drill Bits',
    categoryType: 'drill-bits',
    price: 142,
    oldPrice: 180,
    bulkPrice: 105,
    minQty: '50 pcs',
    image: '/images/drill-bits/hss-drill-bit.png',
    badge: 'POPULAR',
    material: 'HSS 118° Point Angle',
  },
  {
    id: 108,
    name: '2.5mm HSS Parallel Shank Drill Bit (Pack of 100)',
    category: 'HSS Drill Bits',
    categoryType: 'drill-bits',
    price: 44,
    oldPrice: 60,
    bulkPrice: 32,
    minQty: '100 pcs',
    image: '/images/drill-bits/hss-drill-bit.png',
    badge: 'MICRO DRILL',
    material: 'HSS M2 Jobber Length',
  },
];

const money = (val: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);

export default function BulkInquiry() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'drill-bits' | 'taps' | 'specialty'>('all');
  const [createInquiry, { isLoading }] = useCreateBulkInquiryMutation();

  // Fetch live products from database
  const { data: productsResponse } = useListProductsQuery({ limit: 16 });
  const liveDbProducts = productsResponse?.data || [];

  const bulkProducts = useMemo(() => {
    if (liveDbProducts && liveDbProducts.length > 0) {
      // Map API products and supplement with default pack quantities
      const mapped = liveDbProducts.map((p: any) => {
        const nameLower = (p.name || '').toLowerCase();
        let categoryType: 'drill-bits' | 'taps' | 'specialty' = 'drill-bits';
        if (nameLower.includes('tap')) categoryType = 'taps';
        else if (nameLower.includes('wood') || nameLower.includes('masonry') || nameLower.includes('tile') || nameLower.includes('glass')) {
          categoryType = 'specialty';
        }

        const basePrice = Number(p.basePrice || p.sellingPrice || 250);
        const sellingPrice = Number(p.sellingPrice ?? p.discountPrice ?? basePrice);
        const bulkPrice = Math.round(sellingPrice * 0.75);

        return {
          id: p.id,
          name: p.name.includes('Pack') ? p.name : `${p.name} (Bulk Pack)`,
          category: p.category?.name || 'Tooling',
          categoryType,
          price: sellingPrice,
          oldPrice: basePrice > sellingPrice ? basePrice : undefined,
          bulkPrice,
          minQty: p.packQuantity && p.packQuantity > 1 ? `${p.packQuantity} pcs` : '50 pcs',
          image: p.images?.find((img: any) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || '/images/drill-bits/hss-drill-bit.png',
          badge: p.isBestSeller ? 'BESTSELLER' : p.isNewArrival ? 'NEW' : 'BULK SUPPLY',
          material: p.material || p.finish || 'High Speed Tool Steel',
        } as BulkProductItem;
      });

      return mapped;
    }
    return FALLBACK_BULK_PRODUCTS;
  }, [liveDbProducts]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return bulkProducts;
    return bulkProducts.filter((p) => p.categoryType === activeTab);
  }, [bulkProducts, activeTab]);

  const handleInquireProduct = (product: BulkProductItem) => {
    setRequirements(
      `Product: ${product.name}\nQuantity Needed: ${product.minQty}\nRequired Specifications: ${product.material}\nTarget Delivery Date: `,
    );
    const formElement = document.getElementById('inquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await createInquiry({
      name: String(data.get('name')),
      email: String(data.get('email')),
      phone: String(data.get('phone')),
      company: String(data.get('company')),
      inquiryType: String(data.get('inquiryType')),
      requirements: requirements || String(data.get('requirements')),
    }).unwrap();
    setSubmitted(true);
    setRequirements('');
    form.reset();
  };

  return (
    <div className="min-h-screen bg-white text-[#181818]" style={{ fontFamily: FONTS.main }}>
      <Navbar />

      <main>
        {/* ─── Featured Products for Bulk & B2B Purchase ─── */}
        <section id="bulk-products" className="bg-[#f9fafb] py-14 sm:py-16">
          <div className="mx-auto max-w-[1500px] px-5 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5">
                  <Sparkles size={14} /> Factory Volume Supply
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                  Products Available for Bulk Purchase
                </h2>
                <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                  Order high-precision cutting tools in workshop packs with volume tier discounts. Select any item to auto-populate your inquiry request below.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: 'all', label: 'All Items' },
                  { key: 'drill-bits', label: 'HSS Drill Bits' },
                  { key: 'taps', label: 'Hand Taps' },
                  { key: 'specialty', label: 'Specialty Bits' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 text-xs font-semibold rounded-none transition-all cursor-pointer ${
                      activeTab === tab.key
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group flex flex-col bg-white border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
                >
                  {/* Card Image Area */}
                  <div
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4f4f5] flex items-center justify-center p-6 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
                        {product.badge}
                      </span>
                    )}

                    {/* Min Order Qty Tag */}
                    <span className="absolute top-2.5 right-2.5 bg-black/80 text-white text-[10px] font-medium px-2 py-0.5">
                      Min: {product.minQty}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      {product.category}
                    </p>

                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="mt-1.5 text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[40px] hover:text-red-600 cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                      {product.material}
                    </p>

                    {/* Pricing Block */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-gray-400">Unit Price:</span>
                          <p className="text-sm font-bold text-gray-900">
                            {money(product.price)}
                            {product.oldPrice && (
                              <span className="ml-1.5 text-xs text-gray-400 line-through font-normal">
                                {money(product.oldPrice)}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase text-emerald-600">Bulk Tier</span>
                          <p className="text-sm font-black text-emerald-700">
                            {money(product.bulkPrice)}
                            <span className="text-[10px] font-normal text-gray-500">/pc</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex flex-col gap-2">
                      <button
                        onClick={() => handleInquireProduct(product)}
                        className="w-full bg-[#17171a] hover:bg-red-600 text-white py-2.5 px-4 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Package size={14} /> Request Bulk Quote
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="w-full text-center text-xs font-semibold text-gray-600 hover:text-red-600 py-1 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        View specifications <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom Banner inside products section */}
            <div className="mt-12 bg-white border border-gray-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="hidden sm:grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    Need Custom Diameters, Flute Lengths, or OEM Branding?
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600">
                    We manufacture tailored drill bits, extra-length parallel shanks, and custom carbide tooling to your engineering drawings.
                  </p>
                </div>
              </div>
              <a
                href="#inquiry-form"
                className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-xs font-bold transition-colors cursor-pointer"
              >
                Send Custom Specs ↓
              </a>
            </div>
          </div>
        </section>

        {/* ─── Quote Request Form ─── */}
        <section id="inquiry-form" className="bg-[#f5f5f5] px-5 py-16">
          <form onSubmit={submit} className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-normal">Request a bulk quote</h2>
            <p className="mt-3 text-sm text-gray-600">
              Complete the form and the request will appear immediately in the sensai admin dashboard.
            </p>
            <div className="mt-9 grid gap-6 md:grid-cols-2">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone number" name="phone" type="tel" required />
              <Field label="Company name" name="company" required />
              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide">
                  Inquiry type
                </span>
                <select
                  name="inquiryType"
                  className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
                >
                  <option>Bulk order inquiry</option>
                  <option>Custom size inquiry</option>
                  <option>Dealer inquiry</option>
                </select>
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide">
                  Requirements
                </span>
                <textarea
                  name="requirements"
                  required
                  rows={6}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Product names, sizes, quantities and specifications"
                  className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
                />
              </label>
            </div>
            <button
              disabled={isLoading}
              className="mt-6 w-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {isLoading ? 'Submitting…' : 'Submit request'}
            </button>
            {submitted && (
              <p className="mt-4 text-sm font-medium text-emerald-700">
                Your inquiry has been submitted successfully. The sensai team can now review it in the dashboard.
              </p>
            )}
          </form>
        </section>

        {/* Reach out section */}
        <section className="px-5 py-16 text-center">
          <h2 className="text-5xl font-normal">Reach out</h2>
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-5 text-gray-600">
            <a href="tel:+919000000000" className="flex items-center gap-3 hover:text-red-600 transition-colors">
              <Phone size={19} className="text-red-600" />
              +91 90000 00000
            </a>
            <a href="mailto:sales@sensai.in" className="flex items-center gap-3 hover:text-red-600 transition-colors">
              <Mail size={19} className="text-red-600" />
              sales@sensai.in
            </a>
            <p className="flex items-center gap-3">
              <MapPin size={19} className="text-red-600" />
              sensai, India
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-600"
      />
    </label>
  );
}

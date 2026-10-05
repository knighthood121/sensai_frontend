/* eslint-disable @typescript-eslint/no-explicit-any, no-constant-binary-expression -- catalog data is shared with the existing API layer */
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Bolt, Boxes, Check, ChevronRight, CircleDot,
  Drill, Gauge, Headphones, Heart, Hexagon, Nut, PackageCheck,
  ShieldCheck, Sparkles, Star, Truck, Wrench, X,
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import type { LandingPageScreenProps } from './index';

type CatalogItem = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  kind: 'bolt' | 'screw' | 'nut' | 'washer' | 'bearing' | 'tool' | 'kit';
  badge?: string;
  rating?: number;
  image?: string;
};

const testimonials = [
  ['Harish M.', 'Super fast delivery and each size was labelled clearly. The quality is excellent.'],
  ['Akash R.', 'Exactly the fasteners I needed for my workshop project. Great assortment and value.'],
  ['Nitin S.', 'The dimensions are accurate and the finish is clean. I will order again.'],
  ['Priya K.', 'Helpful support, secure packing and no missing pieces in the kit.'],
];

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const categorySlug = (name: string) =>
  name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const kindFromName = (value: string): CatalogItem['kind'] => {
  const name = value.toLowerCase();
  if (/tool|drill|grinder|abrasive|brush|tap/.test(name)) return 'tool';
  if (/bearing/.test(name)) return 'bearing';
  if (/washer|spring|circlip|clamp/.test(name)) return 'washer';
  if (/nut|insert|spacer|coupler|fitting/.test(name)) return 'nut';
  if (/bolt|pin|rod|profile/.test(name)) return 'bolt';
  if (/pack|kit|box|storage|safety|glue|tape|paint/.test(name)) return 'kit';
  return 'screw';
};

const heroSlides = [
  { image: '/images/hand-tools-hero-v2.png', type: 'tools' as const },
  { image: '/images/brass-inserts-hero-v2.png', type: 'brass' as const },
];

export default function LandingPageScreen(p: LandingPageScreenProps) {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const hero = heroSlides[p.carouselIndex % heroSlides.length];
  const visibleCategories = (p.categories || []).map((category) => ({
    name: category.name,
    slug: category.slug || categorySlug(category.name),
    kind: kindFromName(category.name),
    image: category.image || undefined,
  }));

  const liveItems: CatalogItem[] = (p.displayProducts || [])
    .filter((product) => Number(product.id) < 9990)
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.sellingPrice ?? product.discountPrice ?? product.basePrice ?? 0),
      oldPrice:
        Number(product.basePrice || 0) >
        Number(product.sellingPrice ?? product.discountPrice ?? product.basePrice ?? 0)
          ? Number(product.basePrice)
          : undefined,
      kind: kindFromName(`${product.category?.name || ''} ${product.name}`),
      badge: product.isBestSeller ? 'BESTSELLER' : product.isNewArrival ? 'NEW' : undefined,
      rating: Number(product.averageRating || 0),
      image: product.images?.find((image: any) => image.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl,
    }));

  const productsFor = (matcher: RegExp, count: number) => {
    const matches = liveItems.filter((item) => matcher.test(`${item.name} ${item.kind}`));
    return matches.slice(0, count);
  };
  const homepageHssBits = productsFor(/hss|parallel shank/i, 8);
  const homepageSpecialtyBits = productsFor(/flat wood|masonry|glass|tile|tap/i, 8);
  const openCatalogItem = (item: CatalogItem) => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#17171a]">
      <Navbar onLoginClick={p.onLoginClick} />
      <main>
        <div className="relative flex h-[58px] items-center justify-center bg-[#121212] px-12 text-center text-xs font-medium tracking-[.08em] text-white sm:text-lg">
          <ChevronRight className="absolute left-[10%] rotate-180 text-gray-500" size={20} />
          <span>{hero.type === 'tools' ? 'Cash on Delivery is available on orders above ₹450 and below ₹800' : 'FREE Standard Shipping on all orders above Rs.799'}</span>
          <ChevronRight className="absolute right-[10%] text-gray-500" size={20} />
        </div>

        <section className="relative h-[430px] overflow-hidden bg-[#e9e9e9] sm:h-[520px] lg:h-[640px]">
          <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative z-10 flex h-full items-center justify-center px-5 text-center">
            {hero.type === 'tools' ? (
              <div className="-mt-2">
                <h1 className="text-[66px] font-black leading-[.72] tracking-[-.08em] text-violet-600 sm:text-[110px] lg:text-[170px]">Hand</h1>
                <p className="ml-16 text-[62px] font-black leading-none tracking-[-.07em] text-transparent sm:ml-28 sm:text-[105px] lg:ml-44 lg:text-[160px]" style={{ WebkitTextStroke: '4px #8b4bf8' }}>Tools</p>
                <p className="ml-auto mr-[12%] -mt-2 w-max text-sm font-black text-violet-600 sm:text-2xl">Are here</p>
              </div>
            ) : (
              <div className="relative text-[#946029]">
                <span className="absolute -right-10 -top-16 text-[78px] font-black text-transparent sm:-right-20 sm:-top-28 sm:text-[130px] lg:text-[175px]" style={{ WebkitTextStroke: '3px #bd9858' }}>M3</span>
                <h1 className="text-[52px] font-black leading-[.8] tracking-[-.06em] sm:text-[90px] lg:text-[125px]">3D Printing</h1>
                <p className="text-[43px] font-black leading-none tracking-[-.06em] text-transparent sm:text-[76px] lg:text-[105px]" style={{ WebkitTextStroke: '3px #bd9858' }}>Brass Inserts</p>
                <p className="ml-auto mr-[5%] w-max text-sm font-black text-[#bd9858] sm:text-2xl">Are back</p>
              </div>
            )}
            <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className={`absolute bottom-8 px-10 py-4 text-sm font-medium tracking-wide sm:bottom-12 sm:text-lg ${hero.type === 'tools' ? 'bg-violet-700 text-white' : 'bg-white text-gray-900'}`}>Buy Now!</button>
          </div>
        </section>

        <div className="relative flex h-[58px] items-center justify-center gap-5 border-b border-gray-200 bg-white">
          <button onClick={() => p.setCarouselIndex((p.carouselIndex - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-[40%] hidden text-2xl text-gray-500 sm:block">‹</button>
          {heroSlides.map((_, index) => <button key={index} onClick={() => p.setCarouselIndex(index)} className={`h-3 w-3 rounded-full border border-gray-500 ${index === p.carouselIndex % heroSlides.length ? 'bg-black' : 'bg-white'}`} aria-label={`Show slide ${index + 1}`} />)}
          <button onClick={() => p.setCarouselIndex((p.carouselIndex + 1) % heroSlides.length)} className="absolute right-[40%] hidden text-2xl text-gray-500 sm:block">›</button>
        </div>

        <section className="border-b border-gray-200 bg-white py-14 sm:py-20">
          <div className="mx-auto grid max-w-[1600px] grid-cols-3 items-center gap-10 px-6 text-center font-black text-gray-500 sm:grid-cols-6">
            {['DELHIVERY', 'adomberg', 'PHILIPS', 'ZOHO', 'ULTRAVIOLETTE', 'ATHER'].map((brand, index) => <span key={brand} className={`${index === 0 ? 'font-mono' : ''} text-base tracking-tight sm:text-xl lg:text-3xl`}>{brand}</span>)}
          </div>
        </section>

        <section id="categories-grid" className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1500px] px-6 lg:px-8">
            <h2 className="text-4xl font-normal tracking-tight sm:text-5xl lg:text-[58px]">Drill Bits and Taps</h2>
            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-20 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-24">
              {visibleCategories.map((category, index) => (
                <button key={category.slug} onClick={() => navigate(`/category/${category.slug}`)} className="group text-center">
                  <span className="mx-auto block h-40 w-full overflow-hidden bg-white transition group-hover:-translate-y-1 sm:h-44">{category.image ? <img src={category.image} alt={category.name} className="h-full w-full object-contain" /> : <CategorySymbol kind={category.kind} index={index} />}</span>
                  <b className="mt-6 block text-lg font-medium leading-7 underline underline-offset-4 sm:text-xl">{category.name}</b>
                  <small className="mt-5 block text-sm tracking-wide text-gray-800 sm:text-base">Click here →</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        {false && <>
        <section className="relative min-h-[390px] overflow-hidden bg-[#f4f2fb] sm:min-h-[470px]">
          <img src="/images/mechanical-hero.png" alt="Mechanical fasteners and a cordless drill" className="absolute inset-0 h-full w-full object-cover object-[66%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/72 to-transparent" />
          <div className="relative mx-auto flex min-h-[390px] max-w-7xl items-center px-5 py-14 sm:min-h-[470px] lg:px-8">
            <div className="max-w-xl">
              <p className="text-[11px] font-black uppercase tracking-[.22em] text-violet-700">India's fastener & tools store</p>
              <h1 className="mt-4 text-4xl font-black leading-[.96] tracking-[-.04em] sm:text-6xl">Built to hold.<br /><span className="text-violet-700">Made to last.</span></h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-gray-600 sm:text-base">Precision screws, nuts, bolts, bearings and workshop tools—carefully selected and delivered across India.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 bg-violet-700 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-violet-800">Shop fasteners <ArrowRight size={16} /></button>
                <button onClick={() => document.getElementById('categories-grid')?.scrollIntoView({ behavior: 'smooth' })} className="border border-gray-900 bg-white/80 px-6 py-3 text-sm font-extrabold">Explore categories</button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-gray-200 bg-white py-7">
          <p className="text-center text-[9px] font-black uppercase tracking-[.22em] text-gray-400">Trusted by industry leaders</p>
          <div className="mx-auto mt-5 grid max-w-5xl grid-cols-3 items-center gap-5 px-5 text-center text-sm font-black tracking-tight text-gray-400 sm:grid-cols-6">
            {['UST', 'METRIX', 'hyperpure', 'DELHIVERY', 'adember', 'PHILIPS'].map((brand) => <span key={brand}>{brand}</span>)}
          </div>
        </section>

        <section id="categories-grid" className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Drill Bits and Taps</h2>
            <p className="mt-2 text-sm text-gray-500">Everything for making, fixing and building—organized so you can find it fast.</p>
            <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
              {visibleCategories.map((category) => (
                <button key={category.slug} onClick={() => navigate(`/category/${category.slug}`)} className="group text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gray-200 bg-[#fafafa] text-gray-700 transition group-hover:-translate-y-1 group-hover:border-violet-400 group-hover:text-violet-700 group-hover:shadow-md sm:h-20 sm:w-20"><HardwareIcon kind={category.kind} size={30} /></span>
                  <b className="mt-2.5 block text-[11px] leading-4">{category.name}</b>
                  <small className="text-[8px] text-gray-400">Click here →</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        </>}
        <section className="bg-gray-50 py-14">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="text-center"><h2 className="text-xl font-black">Let customers speak for us</h2><p className="mt-1 text-xs text-gray-400">from 1,200+ verified reviews</p></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.map(([name, copy]) => <article key={name} className="bg-white p-5 shadow-sm"><div className="flex text-violet-600">{[0, 1, 2, 3, 4].map(i => <Star key={i} size={12} fill="currentColor" />)}</div><p className="mt-3 text-xs leading-5 text-gray-600">“{copy}”</p><b className="mt-4 block text-xs">{name}</b><small className="flex items-center gap-1 text-[9px] text-emerald-600"><BadgeCheck size={11} /> Verified buyer</small></article>)}
            </div>
          </div>
        </section>

        <ProductSection id="shop" dark title="HSS Drill Bits" eyebrow="PRECISION FOR EVERY HOLE" items={homepageHssBits} onOpen={openCatalogItem} />
        <ProductSection title="Specialty Drill Bits & Taps" eyebrow="BUILT FOR EVERY MATERIAL" items={homepageSpecialtyBits} onOpen={openCatalogItem} />

        <section className="bg-[#111214] py-14 text-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 className="text-2xl font-black">Blog posts</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {[
                ['Choose the right bit', 'How to Select the Right Drill Bit', 'Match the drill bit to metal, wood, masonry, glass or tile.', '/images/drill-bits/hss-drill-bit.png'],
                ['Drill wood cleanly', 'A Practical Guide to Flat Wood Bits', 'Choose the correct spade-bit size and make cleaner holes in wood.', '/images/drill-bits/flat-wood-drill-bit.png'],
                ['Drill tough surfaces', 'Tips for Masonry, Glass and Tile', 'Use the right tip, speed and pressure for brittle or abrasive materials.', '/images/drill-bits/masonry-drill-bit.png'],
              ].map(([tag, title, copy, image]) => <article key={title} className="overflow-hidden border border-white/10 bg-[#1b1c20]"><div className="aspect-[16/8] overflow-hidden bg-white"><img src={image} alt={title} className="h-full w-full object-contain" /></div><div className="p-5"><small className="font-black uppercase tracking-widest text-violet-400">{tag}</small><h3 className="mt-2 text-lg font-extrabold leading-6">{title}</h3><p className="mt-3 text-xs leading-5 text-gray-400">{copy}</p><button className="mt-5 flex items-center gap-2 text-xs font-bold text-violet-400">Read article <ArrowRight size={13} /></button></div></article>)}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-2 border-x border-gray-200 md:grid-cols-4">
          {[[ShieldCheck, 'Best price'], [PackageCheck, 'No MOQ'], [Truck, 'Fast shipping'], [Sparkles, 'Best quality']].map(([Icon, title]: any) => <div key={title} className="border-b border-r border-gray-200 py-9 text-center"><Icon className="mx-auto text-violet-700" size={31} /><b className="mt-3 block text-xs">{title}</b></div>)}
        </section>

        <section id="bulk-inquiry" className="bg-[#252936] py-16 text-white">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
            <div><p className="text-xs font-black tracking-[.2em] text-violet-400">FOR BULK ORDERS</p><h2 className="mt-3 text-3xl font-black">Found your part?<br />Tell us the quantity.</h2><p className="mt-4 text-sm leading-7 text-gray-300">Share your specifications or bill of materials and our team will reply with availability and pricing.</p><p className="mt-6 flex gap-3 text-sm text-gray-300"><Headphones className="text-violet-400" size={20} /> Real support from product specialists</p></div>
            <form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); event.currentTarget.reset(); }} className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Your full name" className="bg-white/10 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-violet-400" />
              <input required type="email" placeholder="Email address" className="bg-white/10 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-violet-400" />
              <input placeholder="Phone number" className="bg-white/10 px-4 py-3 text-sm outline-none sm:col-span-2" />
              <textarea required rows={4} placeholder="Part, size, material and quantity required" className="bg-white/10 px-4 py-3 text-sm outline-none sm:col-span-2" />
              <button className="bg-violet-700 px-5 py-3 text-sm font-extrabold sm:col-span-2">Send requirement</button>
              {sent && <p className="flex gap-2 text-xs text-emerald-300 sm:col-span-2"><Check size={15} /> Thanks—your requirement has been recorded.</p>}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProductSection({ id, dark = false, title, eyebrow, items, onOpen, compact = false }: { id?: string; dark?: boolean; title: string; eyebrow: string; items: CatalogItem[]; onOpen: (item: CatalogItem) => void; compact?: boolean }) {
  return (
    <section id={id} className={dark ? 'bg-[#111214] py-14 text-white' : 'bg-white py-14'}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[9px] font-black tracking-[.22em] text-violet-500">{eyebrow}</p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
          <button className="flex items-center gap-1 text-xs font-bold text-violet-500">View all <ChevronRight size={14} /></button>
        </div>
        <div className={`mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}>
          {items.map(item => <ProductCard key={item.id} item={item} dark={dark} onOpen={onOpen} compact={compact} />)}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item, dark, onOpen, compact }: { item: CatalogItem; dark: boolean; onOpen: (item: CatalogItem) => void; compact: boolean }) {
  return (
    <article className="group">
      <button onClick={() => onOpen(item)} className={`relative grid w-full place-items-center overflow-hidden ${compact ? 'aspect-[4/3]' : 'aspect-square'} ${dark ? 'bg-[#f4f4f5]' : 'bg-gray-50'}`}>
        <div className="absolute inset-3 border border-gray-200/70" />
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.035]" />
        ) : (
          <ProductVisual kind={item.kind} />
        )}
        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-gray-500 shadow-sm"><Heart size={13} /></span>
        {item.badge && <small className="absolute left-2 top-2 bg-violet-700 px-2 py-1 text-[7px] font-black text-white">{item.badge}</small>}
        <span className="absolute inset-x-2 bottom-2 translate-y-10 bg-black/90 py-2 text-[10px] font-bold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">Quick view</span>
      </button>
      <button onClick={() => onOpen(item)} className={`mt-3 line-clamp-2 min-h-10 text-left text-xs font-bold leading-5 ${dark ? 'text-gray-100' : 'text-gray-900'}`}>{item.name}</button>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-400"><Star size={10} fill="currentColor" /> {item.rating || '4.8'} <span className="text-gray-500">(verified)</span></p>
      <p className="mt-1.5 text-sm"><b>{money(item.price)}</b>{item.oldPrice && <small className="ml-2 text-gray-500 line-through">{money(item.oldPrice)}</small>}</p>
      <div className={`mt-3 flex h-7 items-center justify-between border text-[10px] ${dark ? 'border-white/15' : 'border-gray-200'}`}><button className="h-full px-3">−</button><span>1</span><button className="h-full px-3">+</button></div>
    </article>
  );
}

function CategorySymbol({ kind, index }: { kind: CatalogItem['kind']; index: number }) {
  if (index === 0) return <span className="relative block h-24 w-24 rounded-full border-[6px] border-[#202020]"><span className="absolute left-0 top-1/2 h-[14px] w-full -translate-y-1/2 bg-[#202020]" /></span>;
  if (index === 1) return <span className="grid h-24 w-24 place-items-center rounded-full border-[6px] border-[#202020]"><X size={66} strokeWidth={6} /></span>;
  if (index === 2) return <span className="grid h-24 w-24 place-items-center rounded-full border-[6px] border-[#202020]"><Hexagon size={52} fill="currentColor" /></span>;
  if (index === 3) return <span className="relative block h-24 w-24 rounded-full border-[6px] border-[#202020]"><span className="absolute left-1/2 top-0 h-full w-[12px] -translate-x-1/2 bg-[#202020]" /><span className="absolute left-1/2 top-1/2 h-[12px] w-14 -translate-x-1/2 -translate-y-1/2 bg-[#202020]" /></span>;
  if (index === 4) return <span className="grid h-24 w-24 place-items-center rounded-full border-[6px] border-[#202020]"><Star size={58} fill="currentColor" strokeWidth={2} /></span>;
  if (index === 5) return <Hexagon size={108} fill="currentColor" strokeWidth={1} />;
  return <HardwareIcon kind={kind} size={88} />;
}

function ProductVisual({ kind }: { kind: CatalogItem['kind'] }) {
  if (kind === 'kit') return <div className="relative grid h-28 w-36 grid-cols-4 gap-1 rounded-lg border-4 border-gray-700 bg-slate-100 p-2 shadow-xl">{Array.from({ length: 12 }, (_, i) => <span key={i} className="grid place-items-center rounded-sm border border-gray-300 bg-white"><Nut size={11} className="text-gray-600" /></span>)}</div>;
  if (kind === 'tool') return <div className="relative -rotate-6 text-blue-600 drop-shadow-xl"><Drill size={92} strokeWidth={1.45} /><span className="absolute -bottom-2 right-0 h-5 w-10 rounded bg-gray-900" /></div>;
  if (kind === 'bearing') return <div className="relative grid h-24 w-24 place-items-center rounded-full border-[13px] border-slate-400 bg-white shadow-xl before:absolute before:inset-1 before:rounded-full before:border before:border-slate-300"><div className="h-9 w-9 rounded-full border-[7px] border-slate-500" /></div>;
  return <div className="text-gray-600 drop-shadow-lg"><HardwareIcon kind={kind} size={86} /></div>;
}

function HardwareIcon({ kind, size = 24 }: { kind: CatalogItem['kind']; size?: number }) {
  const props = { size, strokeWidth: 1.45 };
  if (kind === 'bolt') return <Bolt {...props} />;
  if (kind === 'screw') return <Wrench {...props} />;
  if (kind === 'nut') return <Hexagon {...props} />;
  if (kind === 'washer') return <CircleDot {...props} />;
  if (kind === 'bearing') return <Gauge {...props} />;
  if (kind === 'tool') return <Drill {...props} />;
  return <Boxes {...props} />;
}


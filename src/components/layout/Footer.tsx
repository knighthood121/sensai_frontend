import { Mail, MapPin, Phone } from 'lucide-react';
import { FONTS } from '../../constant/style';
import logo from '../../assets/logo.png';

const groups = {
  'Shop with us': ['HSS drill bits', 'Wood drill bits', 'Masonry drill bits', 'Glass & tile drill bits'],
  'Help & support': ['FAQs', 'Order tracking', 'Returns & refunds', 'Bulk enquiries'],
};

export default function Footer() {
  return <footer style={{fontFamily:FONTS.main}}>
    <div className="border-t border-gray-200 bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
      <div><a href="/" className="inline-block" aria-label="sensai Home"><img src={logo} alt="sensai" className="h-16 w-auto object-contain transition-opacity hover:opacity-90" /></a><p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">Precision drill bits and hand taps supplied to workshops, tradespeople and DIY customers across India.</p><div className="mt-5 flex gap-2">{['IG','FB','IN'].map(label=><a key={label} href="#" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-[10px] font-black text-gray-500 hover:border-violet-300 hover:text-violet-600">{label}</a>)}</div></div>
      {Object.entries(groups).map(([title,links])=><div key={title}><h3 className="text-sm font-extrabold">{title}</h3><ul className="mt-4 space-y-3 text-sm text-gray-500">{links.map(link=><li key={link}><a href="#" className="hover:text-violet-600">{link}</a></li>)}</ul></div>)}
      <div><h3 className="text-sm font-extrabold">Get in touch</h3><div className="mt-4 space-y-3 text-sm text-gray-500"><p className="flex gap-3"><Mail size={17} className="text-violet-600"/>support@sensai.in</p><p className="flex gap-3"><Phone size={17} className="text-violet-600"/>+91 90000 00000</p><p className="flex gap-3"><MapPin size={17} className="text-violet-600"/>Serving customers across India</p></div><form className="mt-5 flex overflow-hidden rounded-md border border-gray-300"><input aria-label="Email address" type="email" placeholder="Your email" className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none"/><button className="bg-violet-600 px-4 text-sm font-bold text-white">Join</button></form></div>
    </div></div>
    <div className="border-t border-gray-200 bg-gray-50"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-gray-400 sm:flex-row sm:justify-between lg:px-8"><p>© {new Date().getFullYear()} sensai. All rights reserved.</p><div className="flex gap-5"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Sitemap</a></div></div></div>
  </footer>;
}

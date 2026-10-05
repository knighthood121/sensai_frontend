import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export function FaqPage() {
  const items = [
    ['Which drill bit should I use for metal?', 'Use an HSS drill bit with a suitable cutting speed and lubricant for tougher metals.'],
    ['Which bit is suitable for concrete?', 'Use a carbide-tipped masonry drill bit with a hammer-capable drill where appropriate.'],
    ['Do you accept bulk and custom orders?', 'Yes. Use the Bulk/Custom Inquiry page to email specifications and quantities to sensai.'],
    ['How can I track my order?', 'Open Your Order in the header and select Track your Order after signing in.'],
  ];
  return <Page title="Frequently asked questions"><div className="divide-y divide-gray-200">{items.map(([question, answer]) => <details key={question} className="py-5"><summary className="cursor-pointer text-lg font-semibold">{question}</summary><p className="mt-3 max-w-3xl leading-7 text-gray-600">{answer}</p></details>)}</div></Page>;
}

export function AboutPage() {
  return <Page title="About sensai"><div className="max-w-3xl space-y-6 text-lg leading-8 text-gray-600"><p>sensai supplies dependable drill bits and hand taps for workshops, tradespeople and DIY customers across India.</p><p>Our catalog focuses on practical cutting tools for metal, wood, masonry, glass and tile, backed by clear specifications and responsive bulk-order support.</p><a href="/bulk-inquiry" className="inline-block bg-violet-700 px-6 py-3 text-sm font-bold text-white">Work with sensai</a></div></Page>;
}

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-white"><Navbar /><main className="mx-auto min-h-[560px] max-w-6xl px-6 py-16"><h1 className="mb-12 text-5xl font-normal tracking-tight">{title}</h1>{children}</main><Footer /></div>;
}

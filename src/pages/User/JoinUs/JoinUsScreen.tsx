import { useState, type FormEvent } from 'react';
import {
  Handshake,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Truck,
  Wrench,
  Award,
  Users,
  Phone,
  Mail,
  Building2,
  Factory,
  Store,
  ChevronRight,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useCreateBulkInquiryMutation } from '../../../service/bulkInquiryApi';
import { FONTS } from '../../../constant/style';

export default function JoinUsScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    cityState: '',
    businessType: 'Industrial Tool Dealer / Stockist',
    monthlyRequirement: '₹50,000 - ₹2 Lakhs',
    gstin: '',
    message: '',
  });

  const [createInquiry, { isLoading }] = useCreateBulkInquiryMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requirements = `
[SENSAI PARTNERSHIP APPLICATION]
Business Type: ${formData.businessType}
City & State: ${formData.cityState}
Estimated Monthly Volume: ${formData.monthlyRequirement}
GSTIN: ${formData.gstin || 'Not Provided'}
Partner Message / Areas of Interest: ${formData.message || 'General inquiry for partnership and dealer onboarding.'}
    `.trim();

    try {
      await createInquiry({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        inquiryType: 'Partner / Dealer Network Application',
        requirements,
      }).unwrap();

      setSubmitted(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        cityState: '',
        businessType: 'Industrial Tool Dealer / Stockist',
        monthlyRequirement: '₹50,000 - ₹2 Lakhs',
        gstin: '',
        message: '',
      });
    } catch (err) {
      console.error('Failed to submit partner application', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#17171a]" style={{ fontFamily: FONTS.main }}>
      <Navbar />

      <main>
        {/* ─── Hero Section ─── */}
        <section className="relative overflow-hidden bg-[#111214] text-white py-18 sm:py-24 lg:py-28 border-b border-neutral-800">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-5xl px-5 text-center lg:px-8">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400 mb-6 tracking-wide">
              <Handshake size={16} className="text-red-500" />
              <span>JOIN THE SENSAI NETWORK</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
              Grow Your Business with India's <br className="hidden sm:inline" />
              <span className="text-red-600">Trusted Tooling Partner</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Whether you are an industrial distributor, hardware retailer, manufacturing workshop, or CNC contractor, partner with Sensai to access precision-engineered HSS drill bits, taps, and custom tooling solutions with factory-direct margins and guaranteed nationwide fulfillment.
            </p>

            {/* Quick CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#partner-form"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 text-sm font-bold transition-all shadow-lg shadow-red-600/20 cursor-pointer"
              >
                Apply for Partnership ↓
              </a>
              <a
                href="https://wa.me/9654996005?text=Hello%20Sensai%20Team%2C%20I%20would%20like%20to%20partner%20with%20the%20Sensai%20Network."
                target="_blank"
                rel="noreferrer"
                className="border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 hover:border-gray-500 text-white px-7 py-3.5 text-sm font-bold transition-all"
              >
                Chat on WhatsApp ↗
              </a>
            </div>

            {/* Key Metrics / Highlights */}
            <div className="mt-14 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-10 sm:grid-cols-4 lg:gap-8">
              {[
                ['1,200+', 'Active Workshop Partners'],
                ['99.4%', 'Order Accuracy & Dispatch'],
                ['30%+', 'Higher Stockist Margins'],
                ['PAN India', 'Fast Regional Logistics'],
              ].map(([stat, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-white sm:text-3xl lg:text-4xl">{stat}</div>
                  <p className="mt-1.5 text-xs text-gray-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why Partner with Sensai? (Pillars) ─── */}
        <section className="py-16 sm:py-22 bg-[#fafafa]">
          <div className="mx-auto max-w-[1500px] px-5 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">Built for Enduring Success</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Why Industry Leaders Choose Sensai
              </h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                We combine Swiss manufacturing precision with Indian manufacturing agility, providing partners with the competitive edge required in today's demanding metalworking market.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  title: 'Factory-Direct Margins',
                  desc: 'Skip middleman markups. Access tier-1 pricing structures, transparent volume rebates, and special project discounts that maximize your bottom-line profitability.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Guaranteed Precision & Quality',
                  desc: 'All drill bits, ground taps, and specialty cutters adhere strictly to DIN/ISO standards with M2/M35/M42 high-speed steel and specialized heat treatments.',
                },
                {
                  icon: Truck,
                  title: 'Rapid Dispatches & Buffer Stock',
                  desc: 'Eliminate client downtime. Our automated central warehouses keep comprehensive buffer stocks ready for dispatch within 24 to 48 hours across India.',
                },
                {
                  icon: Wrench,
                  title: 'Custom Engineering & Drawings',
                  desc: 'Have a client with non-standard dimensions? Our technical design team produces custom diameters, flute geometries, and coatings to engineering blueprints.',
                },
                {
                  icon: Award,
                  title: 'Marketing & Territory Support',
                  desc: 'Receive branded demo cases, point-of-sale display stands, technical datasheets, and direct customer inquiry referrals routed for your local city.',
                },
                {
                  icon: Users,
                  title: 'Dedicated Partner Support Desk',
                  desc: 'Direct access to senior tooling engineers and account managers who assist with rapid quotations, technical feasibility, and priority logistics.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="bg-white p-7 border border-gray-200/80 transition-all duration-300 hover:shadow-lg hover:border-red-500/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-12 w-12 rounded-lg bg-red-50 text-red-600 grid place-items-center mb-5">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-6 text-gray-600">{desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Partnership Profiles (Who Can Join) ─── */}
        <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
          <div className="mx-auto max-w-[1500px] px-5 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">Tailored For Your Business Model</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Who Can Join the Sensai Network?
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We offer structured partnership programs aligned with your business structure and market demands:
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Store,
                  role: 'Industrial Dealers & Stockists',
                  forWhom: 'Hardware retailers, machinery store owners, and regional industrial distributors.',
                  benefits: [
                    'Exclusive regional territory protection for qualified stockists',
                    'High retail margin structures with volume tier rebates',
                    'Free branded display units and technical product catalogs',
                    'Priority warranty replacements with zero hassle',
                  ],
                },
                {
                  icon: Factory,
                  role: 'Manufacturing & CNC Workshops',
                  forWhom: 'Automotive vendors, aerospace subcontractors, tool & die makers, and metal fabricators.',
                  benefits: [
                    'Contractual batch pricing with fixed quarterly rate cards',
                    'Custom tool manufacture based on component drawings',
                    'On-site tooling optimization and feed/speed advice',
                    'Scheduled standing delivery orders to prevent stock-outs',
                  ],
                },
                {
                  icon: Building2,
                  role: 'Institutions & Corporate Buyers',
                  forWhom: 'Infrastructure conglomerates, defense contractors, railway suppliers, and technical universities.',
                  benefits: [
                    'Comprehensive GST invoicing & formal compliance documentation',
                    'Material Test Certificates (MTC) and QA inspection reports',
                    'Tender supply support and verified vendor onboarding',
                    'Structured 30-day payment terms for approved corporate accounts',
                  ],
                },
              ].map((program) => (
                <div
                  key={program.role}
                  className="border border-gray-200 bg-[#fbfbfb] p-7 flex flex-col justify-between hover:border-gray-400 transition-colors"
                >
                  <div>
                    <div className="h-11 w-11 rounded-md bg-[#17171a] text-white grid place-items-center mb-5">
                      <program.icon size={22} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{program.role}</h3>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed min-h-[36px]">{program.forWhom}</p>

                    <div className="mt-6 border-t border-gray-200 pt-5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-3">Key Advantages:</p>
                      <ul className="space-y-2.5">
                        {program.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href="#partner-form"
                    className="mt-8 flex items-center justify-center gap-1.5 border border-gray-300 bg-white hover:border-red-600 hover:text-red-600 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply for this category <ChevronRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Application Form ─── */}
        <section id="partner-form" className="py-16 sm:py-24 bg-[#17171a] text-white">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">Fast Track Onboarding</span>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Partner Application Form
              </h2>
              <p className="mt-3 text-sm text-gray-300">
                Complete the details below and our Partner Development Desk will get in touch with product catalogs, price lists, and onboarding documentation within 24 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#222328] border border-emerald-500/40 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Application Received Successfully!</h3>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  Thank you for applying to join the Sensai Network. Our partner development manager will review your submission and connect with you shortly on WhatsApp / Phone.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href="tel:+918867622930"
                    className="border border-gray-600 text-gray-300 hover:text-white px-6 py-2.5 text-xs font-bold transition-colors"
                  >
                    Call Support: +91 8867622930
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#202126] border border-neutral-800 p-6 sm:p-10 shadow-2xl">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Full Name / Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Company / Enterprise Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Apex Tools & Machinery"
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sales@company.com"
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      City & State <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="cityState"
                      value={formData.cityState}
                      onChange={handleChange}
                      placeholder="e.g. Pune, Maharashtra"
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      GSTIN (Optional)
                    </label>
                    <input
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="27AAAAA0000A1Z5"
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
                    >
                      <option>Industrial Tool Dealer / Stockist</option>
                      <option>Machining & CNC Workshop</option>
                      <option>Hardware Retailer</option>
                      <option>OEM Component Manufacturer</option>
                      <option>Institutional / Infrastructure Contractor</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Estimated Monthly Tooling Turnover
                    </label>
                    <select
                      name="monthlyRequirement"
                      value={formData.monthlyRequirement}
                      onChange={handleChange}
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
                    >
                      <option>₹25,000 - ₹50,000</option>
                      <option>₹50,000 - ₹2 Lakhs</option>
                      <option>₹2 Lakhs - ₹5 Lakhs</option>
                      <option>₹5 Lakhs - ₹15 Lakhs</option>
                      <option>₹15 Lakhs+</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Key Products of Interest / Special Requirements
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about the sizes, drill bits, hand taps, or custom specifications your market requires..."
                      className="w-full bg-[#2b2c33] border border-neutral-700 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800 pt-6">
                  <p className="text-xs text-gray-400">
                    By submitting this application, you agree to receive commercial quotes and partner documentation from Sensai.
                  </p>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-8 py-3.5 transition-colors disabled:opacity-60 cursor-pointer shrink-0"
                  >
                    {isLoading ? 'Submitting Application…' : 'Submit Partner Application →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ─── Frequently Asked Questions for Partners ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center justify-center gap-1.5">
                <HelpCircle size={14} /> Partnership FAQs
              </span>
              <h2 className="mt-2 text-3xl font-black text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'What is the minimum initial order value to join the Sensai Network?',
                  a: 'We offer flexible entry tiers for both regional retail stockists and manufacturing workshops. Starter partner orders begin from ₹25,000, allowing you to test sample demand and stock fast-moving sizes with low initial capital commitment.',
                },
                {
                  q: 'How does territory exclusivity work for regional distributors?',
                  a: 'Qualified distributors maintaining committed quarterly volume targets receive designated territory exclusivity, ensuring all local inquiries and direct customer web referrals in your postal circle are routed to your dealership.',
                },
                {
                  q: 'Can Sensai manufacture custom non-standard drill bits or machine taps?',
                  a: 'Yes. Sensai specializes in tailor-made tooling including extra-long parallel shanks, custom step drill diameters, specific pitch thread taps, and special carbide geometries built to customer engineering drawings.',
                },
                {
                  q: 'What quality certifications and documentation are supplied with orders?',
                  a: 'Every batch shipment comes with Material Test Certificates (MTC), dimensional inspection reports, and official GST tax invoices for seamless input tax credit compliance.',
                },
                {
                  q: 'What are the credit and payment terms for recurring workshop accounts?',
                  a: 'New partners begin with advance or prompt dispatch terms. Once a consistent relationship of 2-3 orders is established, structured 15-day to 30-day credit facilities are available subject to financial review.',
                },
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 p-6 bg-[#fafafa]">
                  <h3 className="text-base font-bold text-gray-900 flex items-start gap-2.5">
                    <span className="text-red-600 font-black">Q.</span>
                    <span>{item.q}</span>
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Direct Contact & Hotline ─── */}
        <section className="bg-gray-100 py-14 border-t border-gray-200">
          <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
            <h3 className="text-2xl font-black text-gray-900">Speak Directly with Our Partner Desk</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Have an urgent requirement or large institutional tender? Contact our senior leadership directly:
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <a
                href="tel:+918867622930"
                className="bg-white p-5 border border-gray-200 hover:border-red-600 transition-colors flex items-center gap-3.5 text-left"
              >
                <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 grid place-items-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Support & Founders</p>
                  <p className="text-sm font-black text-gray-900">+91 8867622930</p>
                </div>
              </a>

              <a
                href="https://wa.me/9654996005"
                target="_blank"
                rel="noreferrer"
                className="bg-white p-5 border border-gray-200 hover:border-emerald-600 transition-colors flex items-center gap-3.5 text-left"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                  <FileCheck size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Bulk WhatsApp Desk</p>
                  <p className="text-sm font-black text-gray-900">+91 8220974081</p>
                </div>
              </a>

              <a
                href="mailto:sales@sensai.in?subject=Sensai%20Partner%20Inquiry"
                className="bg-white p-5 border border-gray-200 hover:border-blue-600 transition-colors flex items-center gap-3.5 text-left"
              >
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Partner Email</p>
                  <p className="text-sm font-black text-gray-900">sales@sensai.in</p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

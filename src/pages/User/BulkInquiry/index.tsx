import { useState, type FormEvent } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useCreateBulkInquiryMutation } from '../../../service/bulkInquiryApi';

export default function BulkInquiry() {
  const [submitted, setSubmitted] = useState(false);
  const [createInquiry, { isLoading }] = useCreateBulkInquiryMutation();

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
      requirements: String(data.get('requirements')),
    }).unwrap();
    setSubmitted(true);
    form.reset();
  };

  return <div className="min-h-screen bg-white text-[#181818]">
    <Navbar />
    <div className="flex h-14 items-center justify-center bg-[#111] px-5 text-center text-sm tracking-[.08em] text-white sm:text-base">FREE Standard Shipping on all orders above Rs. 799</div>

    <main>
      <section className="px-5 py-16 text-center">
        <h1 className="text-5xl font-normal tracking-tight">Bulk Purchase</h1>
        <div className="mx-auto mt-7 max-w-2xl space-y-4 text-sm leading-7 text-gray-600">
          <p>Explore sensai’s complete range of drill bits and hand taps in our online catalogue.</p>
          <p>For bulk/B2B rates, WhatsApp or call us at <a className="font-bold underline" href="tel:+919000000000">+91 90000 00000</a>.</p>
          <p>Email your requirement to <a className="font-bold underline" href="mailto:sales@sensai.in">sales@sensai.in</a>.</p>
        </div>
        <div className="mx-auto mt-7 grid max-w-md gap-3">
          <a href="/#categories-grid" className="bg-violet-700 px-6 py-3 text-sm font-bold text-white hover:bg-violet-800">View Drill Bit Catalogue</a>
          <a href="mailto:sales@sensai.in?subject=sensai%20Bulk%20Purchase%20Requirement" className="bg-violet-700 px-6 py-3 text-sm font-bold text-white hover:bg-violet-800">Email Bulk Requirement</a>
        </div>
      </section>

      <section className="bg-[#f5f5f5] px-5 py-12">
        <form onSubmit={submit} className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal">Request a bulk quote</h2>
          <p className="mt-5 text-sm text-gray-600">Complete the form and the request will appear immediately in the sensai admin dashboard.</p>
          <div className="mt-9 grid gap-6 md:grid-cols-2">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone number" name="phone" type="tel" required />
            <Field label="Company name" name="company" required />
            <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wide">Inquiry type</span><select name="inquiryType" className="w-full border border-gray-300 bg-white px-4 py-3"><option>Bulk order inquiry</option><option>Custom size inquiry</option><option>Dealer inquiry</option></select></label>
            <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wide">Requirements</span><textarea name="requirements" required rows={6} placeholder="Product names, sizes, quantities and specifications" className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-violet-600" /></label>
          </div>
          <button disabled={isLoading} className="mt-6 w-full bg-violet-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-violet-800 disabled:opacity-60">{isLoading ? 'Submitting…' : 'Submit request'}</button>
          {submitted && <p className="mt-4 text-sm font-medium text-emerald-700">Your inquiry has been submitted successfully. The sensai team can now review it in the dashboard.</p>}
        </form>
      </section>

      <section className="px-5 py-16 text-center">
        <h2 className="text-5xl font-normal">Reach out</h2>
        <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-5 text-gray-600">
          <a href="tel:+919000000000" className="flex items-center gap-3"><Phone size={19} className="text-violet-700" />+91 90000 00000</a>
          <a href="mailto:sales@sensai.in" className="flex items-center gap-3"><Mail size={19} className="text-violet-700" />sales@sensai.in</a>
          <p className="flex items-center gap-3"><MapPin size={19} className="text-violet-700" />sensai, India</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label><span className="mb-2 block text-xs font-bold uppercase tracking-wide">{label}{required && <span className="text-red-600"> *</span>}</span><input name={name} type={type} required={required} className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-violet-600" /></label>;
}

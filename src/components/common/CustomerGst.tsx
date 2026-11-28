import { useState, type FormEvent } from 'react';
import { useUpdateGstMutation } from '../../service/authApi';
import { GST_NUMBER_PATTERN, GST_NUMBER_ERROR } from '../../utils/gst';

export default function CustomerGst({ gstNumber }: { gstNumber?: string | null }) {
  const [draft, setDraft] = useState(gstNumber || '');
  const [message, setMessage] = useState('');
  const [save, { isLoading }] = useUpdateGstMutation();
  const valid = GST_NUMBER_PATTERN.test(draft);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid) { setMessage(GST_NUMBER_ERROR); return; }
    setMessage('');
    try {
      await save({ gstNumber: draft }).unwrap();
      setMessage('GST number saved. You can now place orders.');
    } catch (error: unknown) {
      const detail = error as { data?: { message?: string; errors?: string[] } };
      setMessage(detail.data?.errors?.[0] || detail.data?.message || 'Unable to save GST number. Please retry.');
    }
  };
  return <section className="rounded-[24px] border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
    <h3 className="text-xl font-bold text-gray-950">GST Details</h3>
    <p className="mt-2 text-sm text-gray-500">Save your business GST number before purchasing. It will appear on your orders and invoices.</p>
    {gstNumber && <p className="mt-4 text-sm font-bold text-emerald-700">Saved GST number: <span className="font-mono">{gstNumber}</span></p>}
    <form onSubmit={submit} className="mt-5 space-y-3">
      <label htmlFor="customer-gst" className="block text-xs font-bold uppercase tracking-wide text-gray-600">GST Number (GSTIN)</label>
      <input id="customer-gst" name="gstNumber" value={draft} onChange={event => { setDraft(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setMessage(''); }}
        required minLength={15} maxLength={15} pattern={GST_NUMBER_PATTERN.source} placeholder="06AAZCS7666J1ZA" autoComplete="off" spellCheck={false}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono uppercase outline-none focus:border-red-600" disabled={isLoading} />
      {draft && !valid && <p className="text-xs text-red-600">{GST_NUMBER_ERROR}</p>}
      {message && <p role="status" className="text-sm text-gray-700">{message}</p>}
      <button type="submit" disabled={!valid || isLoading} className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? 'Saving…' : 'Save GST Number'}</button>
    </form>
  </section>;
}

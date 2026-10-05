import { useState } from 'react';
import { Mail, Phone, RefreshCw } from 'lucide-react';
import { useGetBulkInquiriesQuery, useUpdateBulkInquiryMutation, type BulkInquiryStatus } from '../../../service/bulkInquiryApi';

const statuses: BulkInquiryStatus[] = ['NEW', 'CONTACTED', 'QUOTED', 'CLOSED'];

export default function BulkInquiriesAdmin() {
  const { data, isLoading, refetch } = useGetBulkInquiriesQuery();
  const [updateInquiry, { isLoading: updating }] = useUpdateBulkInquiryMutation();
  const [filter, setFilter] = useState<'ALL' | BulkInquiryStatus>('ALL');
  const inquiries = (data?.data || []).filter((item) => filter === 'ALL' || item.status === filter);

  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">Sales leads</p><h1 className="mt-1 text-3xl font-black text-gray-950">Bulk/Custom Inquiries</h1><p className="mt-2 text-sm text-gray-500">Requests submitted through the sensai storefront.</p></div>
      <button onClick={() => refetch()} className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-bold"><RefreshCw size={16} />Refresh</button>
    </div>
    <div className="flex flex-wrap gap-2">{(['ALL', ...statuses] as const).map(status => <button key={status} onClick={() => setFilter(status)} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === status ? 'bg-violet-700 text-white' : 'bg-white text-gray-600'}`}>{status}</button>)}</div>
    {isLoading ? <p className="py-16 text-center text-gray-500">Loading inquiries…</p> : inquiries.length === 0 ? <div className="rounded-xl border bg-white py-16 text-center text-gray-500">No inquiries found.</div> :
      <div className="grid gap-5">{inquiries.map(item => <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-5">
          <div><div className="flex items-center gap-3"><h2 className="text-lg font-black">{item.company}</h2><span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">{item.status}</span></div><p className="mt-1 text-sm font-medium text-gray-700">{item.name} · {item.inquiryType}</p><p className="mt-2 text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('en-IN')}</p></div>
          <div className="space-y-2 text-sm"><a href={`mailto:${item.email}`} className="flex items-center gap-2 text-violet-700"><Mail size={15} />{item.email}</a><a href={`tel:${item.phone}`} className="flex items-center gap-2 text-violet-700"><Phone size={15} />{item.phone}</a></div>
        </div>
        <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap">{item.requirements}</div>
        <div className="mt-5 flex flex-wrap items-center gap-3"><label className="text-xs font-bold uppercase text-gray-500">Status</label><select value={item.status} disabled={updating} onChange={(event) => updateInquiry({ id: item.id, status: event.target.value as BulkInquiryStatus })} className="rounded-lg border px-3 py-2 text-sm">{statuses.map(status => <option key={status}>{status}</option>)}</select></div>
      </article>)}</div>}
  </section>;
}

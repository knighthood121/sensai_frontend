import { useRef, useState, type FormEvent } from 'react';
import { Download, FileText, Loader2, RefreshCw, Upload } from 'lucide-react';
import type { OrderStatus } from '../../types/order.type';
import { useGetOrderDocumentsQuery, useLazyGetOrderDocumentDownloadQuery, useUploadOrderDocumentMutation } from '../../service/orderDocumentApi';

export default function OrderDocuments({ orderId, admin = false, stages = [] }: { orderId: number; admin?: boolean; stages?: OrderStatus[] }) {
  const { data, isLoading, isError, refetch, isFetching } = useGetOrderDocumentsQuery({ orderId, admin }, { pollingInterval: 15000, refetchOnFocus: true, refetchOnMountOrArgChange: true });
  const [upload, { isLoading: uploading }] = useUploadOrderDocumentMutation();
  const [download] = useLazyGetOrderDocumentDownloadQuery();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<OrderStatus | ''>('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [downloading, setDownloading] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const availableStages = [...new Set(stages)];
  const selectedStage = availableStages.includes(stage as OrderStatus) ? stage : availableStages.at(-1) || '';
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(''); setNotice('');
    if (!file || !title.trim() || !selectedStage) { setError('Choose a stage, enter a document title, and select a file.'); return; }
    if (!/\.(pdf|png|jpe?g)$/i.test(file.name) || !['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) { setError('Choose a PDF, JPG, or PNG file.'); return; }
    if (file.size > 8 * 1024 * 1024) { setError('Documents must be 8MB or smaller.'); return; }
    const body = new FormData(); body.append('stage', selectedStage); body.append('title', title.trim()); body.append('file', file);
    try {
      await upload({ orderId, body }).unwrap();
      setFile(null); setTitle(''); if (fileInput.current) fileInput.current.value = '';
      setNotice('Document uploaded and available to the customer.');
    } catch (caught: unknown) {
      const detail = caught as { data?: { message?: string; errors?: string[] } };
      setError(detail.data?.errors?.[0] || detail.data?.message || 'Upload failed. Please retry.');
    }
  };
  const downloadDocument = async (documentId: number) => {
    setError(''); setDownloading(documentId);
    try {
      const response = await download({ orderId, admin, documentId }, false).unwrap();
      const link = document.createElement('a');
      link.href = response.data.url; link.download = response.data.fileName; link.rel = 'noopener';
      document.body.appendChild(link); link.click(); link.remove();
    } catch { setError('Unable to download this document. Please retry.'); }
    finally { setDownloading(null); }
  };
  return <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
    <div className="flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 font-bold text-gray-950"><FileText size={18} className="text-red-600" />Order Documents</h3>
      <button type="button" aria-label="Refresh order documents" disabled={isFetching} onClick={() => void refetch()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} /></button></div>
    <p className="mt-2 text-xs text-gray-500">Documents are grouped by the order stage they relate to.</p>
    {admin && <form onSubmit={submit} className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4">
      <label className="block text-xs font-bold text-gray-600">Order stage<select aria-label="Document order stage" value={selectedStage} onChange={event => setStage(event.target.value as OrderStatus)} required disabled={uploading} className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-sm">{availableStages.map(value => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select></label>
      <label className="block text-xs font-bold text-gray-600">Document title<input value={title} maxLength={200} required disabled={uploading} onChange={event => setTitle(event.target.value)} placeholder="e.g. Invoice, packing list, delivery receipt" className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm font-normal" /></label>
      <label className="block text-xs font-bold text-gray-600">PDF / JPG / PNG, up to 8MB<input ref={fileInput} type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={uploading} onChange={event => { setFile(event.target.files?.[0] || null); setError(''); setNotice(''); }} className="mt-2 block w-full text-xs" /></label>
      <button type="submit" disabled={uploading || !file || !title.trim()} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}{uploading ? 'Uploading…' : 'Upload Document'}</button>
    </form>}
    {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    {notice && <p role="status" className="mt-3 text-sm text-emerald-700">{notice}</p>}
    {isLoading ? <p className="mt-4 text-sm text-gray-500">Loading documents…</p> : isError ? <p role="alert" className="mt-4 text-sm text-red-600">Documents could not be loaded. Use refresh to retry.</p> : !data?.data.length ? <p className="mt-5 text-sm text-gray-500">No documents have been uploaded for this order yet.</p> : <div className="mt-5 space-y-5">
      {[...new Set(data.data.map(item => item.stage))].map(value => <div key={value}><h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{value.replaceAll('_', ' ')}</h4>
        <ul className="space-y-2">{data.data.filter(item => item.stage === value).map(item => <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
          <div className="min-w-0"><p className="break-words text-sm font-bold text-gray-900">{item.title}</p><p className="mt-1 break-all text-xs text-gray-500">{item.originalName} · {Math.max(1, Math.ceil(item.bytes / 1024))} KB</p><p className="mt-1 text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</p></div>
          <button type="button" onClick={() => void downloadDocument(item.id)} disabled={downloading !== null} className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 p-2 text-xs font-bold text-red-600 disabled:opacity-50">{downloading === item.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}Download</button>
        </li>)}</ul></div>)}
    </div>}
  </section>;
}

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Edit2, Eye, ImagePlus, Link as LinkIcon, LoaderCircle, MoveDown, MoveUp, Plus, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import { useGetAdminBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation, type CreateBannerRequest, type DbBanner } from '../../../../service/bannerApi';
import { useUploadTempProductImagesMutation } from '../../../../service/productsApi';

type BannerForm = { title: string; description: string; imageUrl: string; linkUrl: string; isActive: boolean; displayOrder: number; startDate: string; endDate: string };
const emptyForm: BannerForm = { title: '', description: '', imageUrl: '', linkUrl: '/catalog', isActive: true, displayOrder: 1, startDate: '', endDate: '' };
const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-60';

function messageFrom(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = error.data;
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return error instanceof Error ? error.message : fallback;
}
function requireSuccess(response: { success: boolean; message?: string }) {
  if (!response.success) throw new Error(response.message || 'The server could not save this change.');
}
function localDateInput(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function validDestination(value: string) {
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
}
function visibility(banner: DbBanner) {
  if (!banner.isActive) return 'Inactive';
  const now = Date.now();
  if (banner.startDate && new Date(banner.startDate).getTime() > now) return 'Scheduled';
  if (banner.endDate && new Date(banner.endDate).getTime() < now) return 'Expired';
  return 'Active';
}

export default function BannerManagementScreen() {
  const navigate = useNavigate();
  const titleId = useId();
  const editorRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const busyRef = useRef(false);
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminBannersQuery(undefined, { refetchOnMountOrArgChange: true, refetchOnFocus: true });
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [uploadImage] = useUploadTempProductImagesMutation();
  const banners = data?.success ? [...data.data].sort((a, b) => a.displayOrder - b.displayOrder || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const preview = banners.find(banner => banner.id === previewId) || banners[0];
  const filtered = banners.filter(banner => (statusFilter === 'All' || visibility(banner) === statusFilter)
    && `${banner.title} ${banner.description || ''} ${banner.linkUrl || ''}`.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    const dialog = editorOpen ? editorRef.current : deleteId !== null ? deleteRef.current : null;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus({ preventScroll: true });
    };
  }, [editorOpen, deleteId]);

  const openEditor = (banner?: DbBanner) => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setEditingId(banner?.id ?? null);
    setForm(banner ? { title: banner.title, description: banner.description || '', imageUrl: banner.imageUrl, linkUrl: banner.linkUrl || '', isActive: banner.isActive, displayOrder: banner.displayOrder, startDate: localDateInput(banner.startDate), endDate: localDateInput(banner.endDate) }
      : { ...emptyForm, displayOrder: Math.max(0, ...banners.map(item => item.displayOrder)) + 1 });
    setError(null);
    setNotice(null);
    setEditorOpen(true);
  };
  const runAction = async (name: string, operation: () => Promise<void>, successMessage: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPending(name);
    setError(null);
    setNotice(null);
    try {
      await operation();
      setNotice(successMessage);
    } catch (caught) {
      setError(messageFrom(caught, 'The change could not be saved. Please try again.'));
      if (name !== 'upload') void refetch();
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) { setError('Enter a title and a banner image.'); return; }
    if (!validDestination(form.imageUrl.trim())) { setError('Use an uploaded image, an HTTP image URL, or an image path beginning with /.'); return; }
    if (form.linkUrl.trim() && !validDestination(form.linkUrl.trim())) { setError('The destination must be an HTTP URL or a store path beginning with /.'); return; }
    if (!Number.isInteger(form.displayOrder) || form.displayOrder < 0) { setError('Display order must be a nonnegative whole number.'); return; }
    const startDate = form.startDate ? new Date(form.startDate) : null;
    const endDate = form.endDate ? new Date(form.endDate) : null;
    if ((startDate && Number.isNaN(startDate.getTime())) || (endDate && Number.isNaN(endDate.getTime()))) { setError('Enter valid schedule dates.'); return; }
    if (startDate && endDate && startDate > endDate) { setError('The end date must be on or after the start date.'); return; }
    const payload: CreateBannerRequest = { title: form.title.trim(), description: form.description.trim() || null, imageUrl: form.imageUrl.trim(), linkUrl: form.linkUrl.trim() || null, isActive: form.isActive, displayOrder: form.displayOrder, startDate: startDate?.toISOString() || null, endDate: endDate?.toISOString() || null };
    await runAction('save', async () => {
      const response = editingId === null ? await createBanner(payload).unwrap() : await updateBanner({ id: editingId, data: payload }).unwrap();
      requireSuccess(response);
      setPreviewId(response.data.id);
      setEditorOpen(false);
    }, editingId === null ? 'Banner created successfully.' : 'Banner updated successfully.');
  };
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Choose a JPG, PNG, or WebP image smaller than 5 MB.'); return; }
    await runAction('upload', async () => {
      const body = new FormData();
      body.append('images', file);
      const response = await uploadImage(body).unwrap();
      requireSuccess(response);
      const imageUrl = response.data[0]?.imageUrl;
      if (!imageUrl) throw new Error('The upload did not return an image URL. Please try again.');
      setForm(current => ({ ...current, imageUrl }));
    }, 'Image uploaded. Save the banner to publish this change.');
  };
  const toggle = (banner: DbBanner) => runAction(`toggle-${banner.id}`, async () => {
    requireSuccess(await updateBanner({ id: banner.id, data: { isActive: !banner.isActive } }).unwrap());
  }, `Banner ${banner.isActive ? 'disabled' : 'enabled'}.`);
  const move = (id: number, direction: -1 | 1) => runAction(`move-${id}`, async () => {
    const index = banners.findIndex(banner => banner.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= banners.length) return;
    const ordered = [...banners];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    try {
      for (let position = 0; position < ordered.length; position++) {
        if (ordered[position].displayOrder !== position + 1) requireSuccess(await updateBanner({ id: ordered[position].id, data: { displayOrder: position + 1 } }).unwrap());
      }
    } catch (caught) {
      throw new Error(`The complete banner order could not be saved. Reload to see the latest saved order. ${messageFrom(caught, 'Please try again.')}`);
    }
  }, 'Banner order saved.');
  const remove = () => {
    if (deleteId === null) return;
    return runAction('delete', async () => {
      requireSuccess(await deleteBanner(deleteId).unwrap());
      setDeleteId(null);
    }, 'Banner deleted successfully.');
  };
  const closeEditor = () => { if (!busyRef.current) { setEditorOpen(false); setError(null); setNotice(null); } };
  const alert = error && <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span>{error}</span></div>;
  const success = notice && <div role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0" /><span>{notice}</span></div>;

  return <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4"><button type="button" onClick={() => navigate('/admin/marketing')} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Back to marketing"><ArrowLeft size={20} /></button><div><h1 className="text-2xl font-bold tracking-tight">Banner Management</h1><p className="mt-1 text-sm text-gray-500">Manage homepage banners, visibility, schedules, and display order.</p></div></div>
      <div className="flex gap-3"><Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isFetching || !!pending} aria-label="Refresh banners"><RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} /></Button><Button size="sm" onClick={() => openEditor()} disabled={isLoading || !!pending}><Plus size={16} className="mr-2" />Add New Banner</Button></div>
    </div>
    {!editorOpen && deleteId === null && <>{alert}{success}</>}
    {(isError || data?.success === false) && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Banners could not be loaded from the server. <button type="button" className="font-bold underline" onClick={() => void refetch()}>Try again</button></div>}
    {isLoading ? <div className="flex justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-12 text-gray-500" role="status"><LoaderCircle size={20} className="animate-spin" />Loading banners…</div> : <>
      <section className="mb-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-label="Banner preview">
        {preview ? <><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Banner preview</h2><label className="flex items-center gap-2 text-xs text-gray-500">Select to preview:<select aria-label="Select banner to preview" value={preview.id} onChange={event => setPreviewId(Number(event.target.value))} className="max-w-[240px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">{banners.map(banner => <option key={banner.id} value={banner.id}>{banner.title} ({visibility(banner)})</option>)}</select></label></div><div className="relative flex min-h-[260px] items-center overflow-hidden rounded-xl bg-gray-950 p-7 sm:p-10"><img src={preview.imageUrl} alt={preview.title} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" /><div className="relative max-w-xl text-white"><h3 className="whitespace-pre-line text-2xl font-bold leading-tight sm:text-4xl">{preview.title}</h3>{preview.description && <p className="mt-4 text-sm leading-relaxed sm:text-base">{preview.description}</p>}{preview.linkUrl && <span className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold">Explore products</span>}</div></div><p className="mt-3 text-xs text-gray-500">{visibility(preview)} · Homepage banner</p></>
          : <div className="py-9 text-center"><ImagePlus size={36} className="mx-auto mb-4 text-gray-300" /><h2 className="text-lg font-bold">No banner to preview</h2><p className="mt-2 text-sm text-gray-500">Create a banner to show a promotion on the homepage.</p></div>}
      </section>
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row"><label className="flex items-center gap-3 text-sm text-gray-600">Status<select aria-label="Filter banner status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2">{['All', 'Active', 'Inactive', 'Scheduled', 'Expired'].map(status => <option key={status}>{status}</option>)}</select></label><input aria-label="Search banners" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search banners…" className={`${inputClass} sm:max-w-xs`} /></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(banner => { const index = banners.findIndex(item => item.id === banner.id); return <article key={banner.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${preview?.id === banner.id ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'}`}>
          <div className="relative h-44 bg-gray-100"><img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">#{banner.displayOrder}</span><button type="button" disabled={!!pending} onClick={() => void toggle(banner)} aria-label={`${banner.isActive ? 'Disable' : 'Enable'} ${banner.title}`} className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white disabled:opacity-50 ${banner.isActive ? 'bg-emerald-600' : 'bg-gray-600'}`}>{pending === `toggle-${banner.id}` ? 'Saving…' : visibility(banner)}</button><div className="absolute bottom-3 left-3 flex gap-2 rounded-lg bg-black/75 p-1 text-white"><button type="button" disabled={!!pending || index === 0} onClick={() => void move(banner.id, -1)} aria-label={`Move ${banner.title} earlier`} className="p-1.5 disabled:opacity-30"><MoveUp size={16} /></button><button type="button" disabled={!!pending || index === banners.length - 1} onClick={() => void move(banner.id, 1)} aria-label={`Move ${banner.title} later`} className="p-1.5 disabled:opacity-30"><MoveDown size={16} /></button></div></div>
          <div className="p-5"><div className="flex justify-between gap-3"><h3 className="font-bold leading-snug text-gray-900">{banner.title}</h3><button type="button" onClick={() => setPreviewId(banner.id)} aria-label={`Preview ${banner.title}`} className="shrink-0 text-gray-400 hover:text-red-600"><Eye size={17} /></button></div>{banner.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{banner.description}</p>}{banner.linkUrl && <p className="mt-3 flex items-center gap-2 text-xs text-gray-500"><LinkIcon size={13} className="shrink-0" /><span className="truncate">{banner.linkUrl}</span></p>}<p className="mt-4 text-xs text-gray-400">{banner.startDate ? new Date(banner.startDate).toLocaleString() : 'No start date'}{banner.endDate ? ` — ${new Date(banner.endDate).toLocaleString()}` : ' · No end date'}</p></div>
          <div className="flex border-t border-gray-100 bg-gray-50"><button type="button" disabled={!!pending} onClick={() => openEditor(banner)} className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold text-gray-700 hover:text-red-600 disabled:opacity-50"><Edit2 size={14} />Edit Banner</button><button type="button" disabled={!!pending} onClick={() => { returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setError(null); setNotice(null); setDeleteId(banner.id); }} aria-label={`Delete ${banner.title}`} className="border-l border-gray-100 px-5 text-gray-400 hover:text-red-600 disabled:opacity-50"><Trash2 size={15} /></button></div>
        </article>; })}
      </div>
      {banners.length > 0 && filtered.length === 0 && <p className="py-10 text-center text-sm text-gray-500">No banners match these filters.</p>}
      {pending?.startsWith('move-') && <p role="status" className="mt-4 text-sm text-gray-500">Saving banner order…</p>}
    </>}

    {editorOpen && <dialog ref={editorRef} aria-labelledby={titleId} className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border-0 bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/60 sm:p-8" onCancel={event => { if (busyRef.current) event.preventDefault(); else closeEditor(); }}>
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-gray-100 pb-5"><div><h2 id={titleId} className="text-xl font-bold">{editingId === null ? 'Create New Banner' : 'Edit Promotional Banner'}</h2><p className="mt-1 text-xs text-gray-500">Update the image, copy, destination, and schedule.</p></div><button type="button" disabled={!!pending} onClick={closeEditor} aria-label="Close banner editor" className="rounded-xl bg-gray-100 p-2 disabled:opacity-50"><X size={19} /></button></div>
      {alert}{success}
      <form onSubmit={save} className="space-y-5">
        <fieldset disabled={!!pending} className="space-y-5 disabled:opacity-70">
          <label className="block text-xs font-bold text-gray-700">Banner title *<textarea name="title" rows={2} required value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} className={`${inputClass} mt-1.5`} autoFocus /></label>
          <label className="block text-xs font-bold text-gray-700">Description<textarea name="description" rows={2} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
          <div><label className="block text-xs font-bold text-gray-700" htmlFor={`${titleId}-image`}>Banner image *</label><div className="mt-1.5 flex flex-col gap-2 sm:flex-row"><input id={`${titleId}-image`} name="imageUrl" required value={form.imageUrl} onChange={event => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://… or /images/…" className={`${inputClass} min-w-0 flex-1`} /><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold"><Upload size={15} />{pending === 'upload' ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => void upload(event)} className="sr-only" aria-label="Upload banner image" /></label></div><div className="mt-2 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-gray-400">JPG, PNG, or WebP, up to 5 MB.</p><button type="button" onClick={() => setForm(current => ({ ...current, imageUrl: '/images/sansei/hero.png' }))} className="text-xs font-semibold text-red-600 hover:underline">Use SANSEI design image</button></div>{form.imageUrl && <img src={form.imageUrl} alt="Selected banner image" className="mt-3 h-40 w-full rounded-xl border border-gray-200 bg-gray-100 object-cover" />}</div>
          <label className="block text-xs font-bold text-gray-700">Destination URL or store path<input name="linkUrl" value={form.linkUrl} onChange={event => setForm({ ...form, linkUrl: event.target.value })} placeholder="/catalog" className={`${inputClass} mt-1.5`} /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-bold text-gray-700">Display order<input name="displayOrder" type="number" min="0" step="1" required value={form.displayOrder} onChange={event => setForm({ ...form, displayOrder: event.target.valueAsNumber })} className={`${inputClass} mt-1.5`} /></label><label className="flex items-center gap-3 text-sm font-semibold"><input name="isActive" type="checkbox" checked={form.isActive} onChange={event => setForm({ ...form, isActive: event.target.checked })} className="h-4 w-4 accent-red-600" />Enable banner</label></div>
          <div className="border-t border-gray-100 pt-4"><p className="mb-3 text-xs text-gray-500">Optional schedule. Times use your browser's local timezone.</p><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-bold text-gray-700">Start date<input name="startDate" type="datetime-local" value={form.startDate} onChange={event => setForm({ ...form, startDate: event.target.value })} className={`${inputClass} mt-1.5`} /></label><label className="block text-xs font-bold text-gray-700">End date<input name="endDate" type="datetime-local" value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })} className={`${inputClass} mt-1.5`} /></label></div></div>
        </fieldset>
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5"><Button type="button" variant="outline" size="sm" disabled={!!pending} onClick={closeEditor}>Cancel</Button><Button type="submit" size="sm" disabled={!!pending}>{pending === 'save' ? <><LoaderCircle size={16} className="mr-2 animate-spin" />Saving…</> : editingId === null ? 'Create Banner' : 'Save Changes'}</Button></div>
      </form>
    </dialog>}
    {deleteId !== null && <dialog ref={deleteRef} aria-labelledby={`${titleId}-delete`} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border-0 bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/60" onCancel={event => { if (busyRef.current) event.preventDefault(); else setDeleteId(null); }}>
      <AlertCircle size={32} className="mb-4 text-red-600" /><h2 id={`${titleId}-delete`} className="text-lg font-bold">Delete this banner?</h2><p className="mb-5 mt-2 text-sm text-gray-500">The banner will be removed from the homepage. This cannot be undone.</p>{alert}<div className="flex gap-3"><Button variant="outline" size="sm" disabled={!!pending} onClick={() => { setDeleteId(null); setError(null); }} autoFocus>Cancel</Button><Button size="sm" disabled={!!pending} onClick={() => void remove()}>{pending === 'delete' ? 'Deleting…' : 'Delete Banner'}</Button></div>
    </dialog>}
  </div>;
}

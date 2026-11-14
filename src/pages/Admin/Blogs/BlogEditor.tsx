import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowLeft, Loader2, Save, Upload } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCreateBlogMutation, useGetAdminBlogQuery, useUpdateBlogMutation, type BlogInput, type BlogPost } from '../../../service/blogApi';
import { useUploadTempProductImagesMutation } from '../../../service/productsApi';
import { apiErrorMessage } from '../../../utils/apiMessage';
import { useToast } from '../../../components/common/Toast';
import BlogContent from '../../../components/common/BlogContent';
import '../../User/Blog/Blog.css';

const inputClass = 'mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-red-600';

export default function BlogEditor() {
  const { id } = useParams();
  const articleId = Number(id);
  const invalidId = !!id && (!Number.isSafeInteger(articleId) || articleId < 1);
  const { currentData: data, isFetching, error, refetch } = useGetAdminBlogQuery(articleId, { skip: !id || invalidId, refetchOnMountOrArgChange: true });
  if (id && isFetching && !data) return <p role="status" className="p-12 text-center">Loading article…</p>;
  if (invalidId || (id && (error || !data?.data))) return <div className="p-12 text-center"><h1 className="text-xl font-bold">Unable to open this article.</h1>{!invalidId && <button onClick={() => void refetch()} className="mt-4 text-red-600">Try again</button>}<Link to="/admin/blogs" className="ml-5 text-sm">Back to articles</Link></div>;
  return <BlogEditorForm key={id || 'new'} post={id ? data?.data : undefined} />;
}

function BlogEditorForm({ post }: { post?: BlogPost }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<BlogInput>(() => ({ title: post?.title || '', slug: post?.slug || '', excerpt: post?.excerpt || '',
    content: post?.content || '', imageUrl: post?.imageUrl || '', imageAlt: post?.imageAlt || '', authorName: post?.authorName || 'SANSEI Team', isPublished: post?.isPublished || false }));
  const [error, setError] = useState('');
  const pending = useRef(false);
  const [create, { isLoading: creating }] = useCreateBlogMutation();
  const [update, { isLoading: updating }] = useUpdateBlogMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadTempProductImagesMutation();
  const busy = creating || updating || uploading;
  const change = (field: keyof BlogInput, value: string | boolean) => setForm(current => ({ ...current, [field]: value }));
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file || busy || pending.current) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Choose a JPG, PNG, or WebP image up to 5 MB.'); return; }
    setError(''); pending.current = true;
    try {
      const body = new FormData(); body.append('images', file);
      const response = await uploadImage(body).unwrap();
      const imageUrl = response.data?.[0]?.imageUrl;
      if (!response.success || !imageUrl) throw new Error('The image could not be uploaded. Please try again.');
      change('imageUrl', imageUrl);
    } catch (error) { setError(apiErrorMessage(error, 'Image upload failed. Please try again.')); }
    finally { pending.current = false; }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (busy || pending.current) return;
    setError(''); pending.current = true;
    const payload: BlogInput = { ...form, title: form.title.trim(), excerpt: form.excerpt.trim(), content: form.content.trim(), imageUrl: form.imageUrl.trim(), imageAlt: form.imageAlt.trim(), authorName: form.authorName.trim(), slug: form.slug?.trim() || undefined };
    try {
      const response = await (post ? update({ id: post.id, data: payload }) : create(payload)).unwrap();
      if (!response.success) throw new Error('The article could not be saved.');
      showToast(form.isPublished ? 'Article published.' : 'Draft saved.', 'success');
      navigate('/admin/blogs');
    } catch (error) { setError(apiErrorMessage(error, 'Unable to save this article. Your draft has been kept.')); }
    finally { pending.current = false; }
  };
  return <section className="mx-auto max-w-6xl"><Link to="/admin/blogs" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500"><ArrowLeft size={16} />All articles</Link><h1 className="text-3xl font-black">{post ? 'Edit article' : 'Create an article'}</h1><p className="mt-2 text-sm text-gray-500">Share tooling advice and company updates with your readers.</p>
    {error && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="mt-7 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
      <fieldset disabled={busy} className="min-w-0 space-y-6 rounded-xl border bg-white p-5 sm:p-7">
        <label className="block text-sm font-bold">Title *<input name="title" value={form.title} onChange={event => change('title', event.target.value)} required minLength={3} maxLength={180} className={inputClass} placeholder="What will your readers learn?" /></label>
        <label className="block text-sm font-bold">Article URL slug<input name="slug" value={form.slug || ''} onChange={event => change('slug', event.target.value)} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={200} className={inputClass} placeholder="generated-from-your-title" /><span className="mt-2 block text-xs font-normal text-gray-500">Leave blank to generate from the title. Use lowercase letters, numbers, and hyphens.</span></label>
        <label className="block text-sm font-bold">Short introduction *<textarea name="excerpt" value={form.excerpt} onChange={event => change('excerpt', event.target.value)} required maxLength={500} rows={3} className={inputClass} placeholder="A short summary for the article listing." /></label>
        <label className="block text-sm font-bold">Article content *<textarea name="content" value={form.content} onChange={event => change('content', event.target.value)} required maxLength={30000} rows={16} className={`${inputClass} leading-7`} placeholder="Write your article here…" /><span className="mt-2 block text-xs font-normal text-gray-500">Separate paragraphs with a blank line. Start a section heading with # followed by a space.</span></label>
      </fieldset>
      <div className="min-w-0 space-y-6">
        <fieldset disabled={busy} className="space-y-5 rounded-xl border bg-white p-5 sm:p-6"><h2 className="text-lg font-bold">Cover image</h2><label className="block text-sm font-bold">Image URL *<input name="imageUrl" value={form.imageUrl} onChange={event => change('imageUrl', event.target.value)} required maxLength={2048} className={inputClass} placeholder="https://… or /images/…" /></label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm font-bold"><Upload size={18} />{uploading ? 'Uploading…' : 'Upload cover image'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => void upload(event)} className="sr-only" aria-label="Upload cover image" /></label><p className="text-xs leading-5 text-gray-500">JPG, PNG, or WebP, up to 5 MB.</p>
          {form.imageUrl && <img src={form.imageUrl} alt={form.imageAlt || 'Cover preview'} className="aspect-video w-full rounded-lg bg-gray-100 object-cover" />}
          <label className="block text-sm font-bold">Image description<input name="imageAlt" value={form.imageAlt} onChange={event => change('imageAlt', event.target.value)} maxLength={255} className={inputClass} placeholder="Describe the image for readers" /></label>
        </fieldset>
        <fieldset disabled={busy} className="space-y-5 rounded-xl border bg-white p-5 sm:p-6"><h2 className="text-lg font-bold">Publishing</h2><label className="block text-sm font-bold">Author *<input name="authorName" value={form.authorName} onChange={event => change('authorName', event.target.value)} maxLength={100} required className={inputClass} /></label><label className="flex items-start gap-3 text-sm"><input name="isPublished" type="checkbox" checked={form.isPublished} onChange={event => change('isPublished', event.target.checked)} className="mt-1 accent-red-600" /><span><strong>Publish on the website</strong><span className="mt-1 block text-xs leading-5 text-gray-500">Leave unchecked to keep this article as an admin-only draft.</span></span></label></fieldset>
        <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{busy ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}{busy ? 'Saving…' : form.isPublished ? 'Publish article' : 'Save draft'}</button>
      </div>
    </form>
    <details className="mt-7 rounded-xl border bg-white p-6"><summary className="cursor-pointer text-sm font-bold">Preview article</summary><div className="mx-auto mt-8 max-w-3xl"><h2 className="break-words text-3xl font-black">{form.title || 'Your article title'}</h2><p className="mt-4 break-words text-gray-500">{form.excerpt}</p><BlogContent content={form.content} /></div></details>
  </section>;
}

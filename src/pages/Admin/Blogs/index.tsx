import { useState, type FormEvent } from 'react';
import { BookOpen, ExternalLink, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDeleteBlogMutation, useGetAdminBlogsQuery, type BlogFilters } from '../../../service/blogApi';
import { apiErrorMessage } from '../../../utils/apiMessage';

export default function BlogsAdmin() {
  const [status, setStatus] = useState<NonNullable<BlogFilters['status']>>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const { data, isFetching, isError, refetch } = useGetAdminBlogsQuery({ page, status, search: search || undefined }, { refetchOnMountOrArgChange: true, refetchOnFocus: true });
  const [remove, { isLoading: deleting }] = useDeleteBlogMutation();
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSearch(String(new FormData(event.currentTarget).get('search') || '').trim()); setPage(1);
  };
  const deletePost = async () => {
    if (!deleteId || deleting) return;
    setError('');
    try {
      const response = await remove(deleteId).unwrap();
      if (!response.success) throw new Error('The article could not be deleted.');
      setDeleteId(null);
      if (data?.data.length === 1 && page > 1) setPage(page - 1);
    } catch (error) { setError(apiErrorMessage(error, 'Unable to delete this article. Please try again.')); }
  };
  return <section className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-red-600">The SANSEI journal</p><h1 className="mt-1 text-3xl font-black">Blog articles</h1><p className="mt-2 text-sm text-gray-500">Create articles, upload cover images, and publish to the storefront.</p></div><div className="flex flex-wrap gap-3"><button onClick={() => void refetch()} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-bold"><RefreshCw size={16} />Refresh</button><Link to="/admin/blogs/new" className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={17} />New article</Link></div></header>
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex gap-2">{(['all', 'published', 'draft'] as const).map(value => <button key={value} onClick={() => { setStatus(value); setPage(1); }} className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${status === value ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}>{value === 'draft' ? 'Drafts' : value}</button>)}</div><form className="flex min-w-0 items-center gap-2 rounded-lg border bg-white p-2" role="search" aria-label="Search admin articles" onSubmit={submitSearch}><Search size={17} className="ml-1 text-gray-400" /><input name="search" aria-label="Search article titles" type="search" maxLength={120} placeholder="Search articles" className="min-w-0 w-40 text-sm outline-none sm:w-52" /><button className="rounded bg-gray-900 px-3 py-2 text-xs font-bold text-white">Search</button></form></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {isError ? <div role="alert" className="rounded-xl border bg-white p-10 text-center"><p>We couldn't load your articles.</p><button onClick={() => void refetch()} className="mt-4 font-bold text-red-600">Try again</button></div>
      : isFetching ? <p role="status" className="py-16 text-center text-gray-500">Loading articles…</p>
      : !data?.data.length ? <div className="rounded-xl border bg-white p-12 text-center"><BookOpen className="mx-auto text-gray-400" size={35} /><h2 className="mt-4 text-xl font-bold">No articles found.</h2><p className="mt-2 text-sm text-gray-500">Create your first article or adjust your filters.</p></div>
      : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{data.data.map(post => <article key={post.id} className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><img src={post.imageUrl} alt={post.imageAlt || post.title} className="h-44 w-full bg-gray-100 object-cover" /><div className="p-5"><span className={`rounded-full px-3 py-1 text-[11px] font-bold ${post.isPublished ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{post.isPublished ? 'Published' : 'Draft'}</span><h2 className="mt-3 break-words text-lg font-bold">{post.title}</h2><p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-gray-500">{post.excerpt}</p><p className="mt-4 text-xs text-gray-400">Updated {new Date(post.updatedAt).toLocaleDateString('en-IN')}</p>
        {deleteId === post.id ? <div className="mt-4 rounded-lg bg-red-50 p-3"><p className="text-xs leading-5 text-red-800">Delete this article permanently?</p><div className="mt-3 flex gap-3"><button disabled={deleting} onClick={() => void deletePost()} className="text-xs font-bold text-red-700">{deleting ? 'Deleting…' : 'Confirm delete'}</button><button disabled={deleting} onClick={() => setDeleteId(null)} className="text-xs text-gray-600">Cancel</button></div></div>
          : <div className="mt-4 flex flex-wrap items-center gap-4 border-t pt-4 text-xs font-bold"><Link className="inline-flex items-center gap-1 text-gray-800" to={'/admin/blogs/' + post.id + '/edit'}><Pencil size={14} />Edit</Link>{post.isPublished && <Link className="inline-flex items-center gap-1 text-red-600" to={'/blog/' + post.slug} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} />View article</Link>}<button onClick={() => { setDeleteId(post.id); setError(''); }} className="ml-auto inline-flex items-center gap-1 text-gray-500"><Trash2 size={14} />Delete</button></div>}
      </div></article>)}</div>}
    {!isError && data && data.pagination.totalPages > 1 && <nav aria-label="Admin article pages" className="flex items-center justify-center gap-5 text-sm"><button disabled={page === 1 || isFetching} onClick={() => setPage(page - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {data.pagination.totalPages}</span><button disabled={!data.pagination.hasNextPage || isFetching} onClick={() => setPage(page + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button></nav>}
  </section>;
}

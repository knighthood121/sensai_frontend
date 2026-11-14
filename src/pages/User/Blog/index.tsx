import { type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Search } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import BlogContent from '../../../components/common/BlogContent';
import ProductImage from '../../../components/common/ProductImage';
import { useGetBlogQuery, useGetBlogsQuery } from '../../../service/blogApi';
import './Blog.css';

const date = (value: string | null) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search')?.trim() || '';
  const requestedPage = Number(params.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { data, isFetching, isError, refetch } = useGetBlogsQuery({ page, limit: 9, search: search || undefined }, { refetchOnMountOrArgChange: true, refetchOnFocus: true });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = String(new FormData(event.currentTarget).get('search') || '').trim();
    setParams(term ? { search: term } : {});
  };
  return <div className="blog-page"><Navbar /><main className="blog-page__inner">
    <header className="blog-page__heading"><p>THE SANSEI JOURNAL</p><h1>Ideas for a sharper edge.</h1><span>Tooling insights, practical guides, and news from SANSEI.</span></header>
    <form className="blog-search" role="search" aria-label="Search articles" onSubmit={submit}><Search size={20} aria-hidden="true" /><input key={search} name="search" aria-label="Search articles" placeholder="Search articles…" defaultValue={search} maxLength={120} type="search" /><button type="submit">Search</button></form>
    {isError ? <div className="blog-state" role="alert"><h2>We couldn't load the articles.</h2><button onClick={() => void refetch()}>Try again</button></div>
      : isFetching ? <div className="blog-state" role="status">Loading articles…</div>
      : !data?.data.length ? <div className="blog-state"><BookOpen size={36} aria-hidden="true" /><h2>{search ? 'No articles match your search.' : 'Our next chapter is coming soon.'}</h2><p>{search ? 'Try another search term.' : 'Check back for tooling guides and updates from SANSEI.'}</p>{search && <Link to="/blog">View all articles</Link>}</div>
      : <div className="blog-grid">{data.data.map(post => <article className="blog-card" key={post.id}><Link className="blog-card__image" to={'/blog/' + post.slug}><ProductImage src={post.imageUrl} alt={post.imageAlt || post.title} /></Link><div className="blog-card__body"><time dateTime={post.publishedAt || undefined}>{date(post.publishedAt)}</time><h2><Link to={'/blog/' + post.slug}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="blog-card__read" to={'/blog/' + post.slug}>Read article <ArrowRight size={16} aria-hidden="true" /></Link></div></article>)}</div>}
    {!isError && data && data.pagination.totalPages > 1 && <nav className="blog-pagination" aria-label="Article pages"><button disabled={page === 1 || isFetching} onClick={() => setParams({ ...(search && { search }), page: String(page - 1) })}>Previous</button><span>Page {page} of {data.pagination.totalPages}</span><button disabled={!data.pagination.hasNextPage || isFetching} onClick={() => setParams({ ...(search && { search }), page: String(page + 1) })}>Next</button></nav>}
  </main><Footer /></div>;
}

export function BlogArticle() {
  const { slug = '' } = useParams();
  const { data, isLoading, error, refetch } = useGetBlogQuery(slug, { refetchOnMountOrArgChange: true, refetchOnFocus: true });
  const post = data?.data;
  const missing = error && 'status' in error && error.status === 404;
  return <div className="blog-page"><Navbar /><main className="blog-page__inner blog-article">
    <Link to="/blog" className="blog-back"><ArrowLeft size={16} aria-hidden="true" />All articles</Link>
    {isLoading ? <div className="blog-state" role="status">Loading article…</div> : error || !post ? <div className="blog-state" role="alert"><h1>{missing ? 'Article not found.' : 'We couldn’t load this article.'}</h1>{!missing && <button onClick={() => void refetch()}>Try again</button>}</div> : <article>
      <header className="blog-article__heading"><p>THE SANSEI JOURNAL</p><h1>{post.title}</h1><div><span>{post.authorName}</span><span aria-hidden="true">·</span><time dateTime={post.publishedAt || undefined}>{date(post.publishedAt)}</time></div><p className="blog-article__excerpt">{post.excerpt}</p></header>
      <ProductImage className="blog-article__image" src={post.imageUrl} alt={post.imageAlt || post.title} />
      <BlogContent content={post.content} />
      <aside className="blog-article__cta"><h2>Find the right tool for your application.</h2><Link to="/bulk-inquiry#inquiry-form">Talk to our team <ArrowRight size={17} aria-hidden="true" /></Link></aside>
    </article>}
  </main><Footer /></div>;
}

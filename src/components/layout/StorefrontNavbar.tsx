import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Heart, LayoutDashboard, LogIn, LogOut, Menu, Package, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../../service/authApi';
import { useGetCartQuery } from '../../service/cartApi';
import { useListCategoriesQuery, useListProductsQuery } from '../../service/productsApi';
import { getGuestCart } from '../../utils/guestCart';
import './StorefrontNavbar.css';

type OpenPanel = 'products' | 'search' | 'account' | null;
type StoreCategory = { id: number; name: string; slug: string; isActive?: boolean };
const navClass = ({ isActive }: { isActive: boolean }) => `storefront-nav__link${isActive ? ' is-active' : ''}`;
const readGuestCount = () => getGuestCart().reduce((sum, item) => sum + item.quantity, 0);

export default function StorefrontNavbar({ onLoginClick }: { onLoginClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const [panel, setPanel] = useState<OpenPanel>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get('search') || '');
  const [guestCount, setGuestCount] = useState(readGuestCount);
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const panelTriggerRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const categoryPanelRef = useRef<HTMLDivElement>(null);
  const accountPanelRef = useRef<HTMLDivElement>(null);
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const { data: categoryResponse, isLoading: categoriesLoading, isError: categoriesError, refetch: reloadCategories } = useListCategoriesQuery();
  const { data: productResponse } = useListProductsQuery({ limit: 100 }, { skip: panel !== 'products' && !mobileProductsOpen });
  const categories: StoreCategory[] = (categoryResponse?.data || []).filter((category: StoreCategory) => category.isActive !== false && category.slug);
  const products = productResponse?.data || [];
  const cartCount = isAuthenticated ? cartData?.data?.totalItems || 0 : guestCount;
  const productsActive = location.pathname.startsWith('/category/') || location.pathname.startsWith('/product/');

  useEffect(() => {
    const update = () => setGuestCount(readGuestCount());
    update();
    window.addEventListener('sensai_guest_cart_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('sensai_guest_cart_updated', update);
      window.removeEventListener('storage', update);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setPanel(null);
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setSearch(new URLSearchParams(location.search).get('search') || '');
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!panel) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setPanel(null);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setPanel(null);
      panelTriggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    if (panel === 'search') searchRef.current?.focus();
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [panel]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!mobileOpen || !drawer) return;
    const previousOverflow = document.body.style.overflow;
    drawer.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      drawer.close();
      document.body.style.overflow = previousOverflow;
      drawerTriggerRef.current?.focus({ preventScroll: true });
    };
  }, [mobileOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1100px)');
    const closeDrawer = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', closeDrawer);
    return () => desktop.removeEventListener('change', closeDrawer);
  }, []);

  const closeNavigation = () => {
    setPanel(null);
    setMobileOpen(false);
  };
  const togglePanel = (next: Exclude<OpenPanel, null>, trigger: HTMLButtonElement) => {
    panelTriggerRef.current = trigger;
    setPanel(current => current === next ? null : next);
  };
  const focusPanel = (event: KeyboardEvent<HTMLButtonElement>, next: 'products' | 'account') => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    panelTriggerRef.current = event.currentTarget;
    setPanel(next);
    requestAnimationFrame(() => (next === 'products' ? categoryPanelRef : accountPanelRef).current?.querySelector<HTMLElement>('a, button')?.focus());
  };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const term = search.trim();
    closeNavigation();
    navigate(term ? `/catalog?search=${encodeURIComponent(term)}` : '/catalog');
  };
  const handleLogin = () => {
    closeNavigation();
    if (onLoginClick) onLoginClick();
    else navigate('/login');
  };
  const handleLogout = async () => {
    closeNavigation();
    try {
      await logout({ refreshToken: localStorage.getItem('refreshToken') || '' }).unwrap();
    } catch {
      // The auth mutation clears the local session even if the server is unavailable.
    } finally {
      navigate('/');
    }
  };
  const searchForm = (id: string, autofocus = false) => <form className="storefront-nav__search-form" role="search" onSubmit={submitSearch}>
    <label className="storefront-nav__sr-only" htmlFor={id}>Search all products</label>
    <Search size={19} aria-hidden="true" />
    <input id={id} ref={autofocus ? searchRef : undefined} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search all cutting tools…" autoComplete="off" />
    <button type="submit">Search <ArrowRight size={17} aria-hidden="true" /></button>
  </form>;
  const categoryStatus = categoriesLoading ? <p className="storefront-nav__status" role="status">Loading product categories…</p>
    : categoriesError ? <div className="storefront-nav__status"><p>Product categories could not be loaded.</p><button type="button" onClick={() => void reloadCategories()}>Try again</button></div>
    : categories.length === 0 ? <p className="storefront-nav__status">No product categories are available yet.</p> : null;
  const accountLinks = <>
    {isAuthenticated ? <>
      <p className="storefront-nav__account-name">{user?.name || 'My account'}</p>
      <Link to="/profile" onClick={closeNavigation}><UserRound size={17} /> My profile</Link>
    </> : <>
      <button type="button" onClick={handleLogin}><LogIn size={17} /> Log in</button>
      <Link to="/signup" onClick={closeNavigation}><UserRound size={17} /> Create an account</Link>
    </>}
    <Link to="/orders" onClick={closeNavigation}><Package size={17} /> My orders</Link>
    <Link to="/wishlist" onClick={closeNavigation}><Heart size={17} /> Wishlist</Link>
    {user?.role === 'ADMIN' && <Link to="/admin/dashboard" onClick={closeNavigation}><LayoutDashboard size={17} /> Admin dashboard</Link>}
    {isAuthenticated && <button type="button" onClick={() => void handleLogout()} disabled={loggingOut}><LogOut size={17} /> {loggingOut ? 'Logging out…' : 'Log out'}</button>}
  </>;

  return <>
    <header className="storefront-nav" ref={headerRef}>
      <div className="storefront-nav__inner">
        <Link className="storefront-nav__brand" to="/" onClick={closeNavigation} aria-label="SANSEI home"><img src="/images/sansei/logo-light.png" alt="SANSEI" width="1183" height="1329" /></Link>
        <nav className="storefront-nav__main" aria-label="Main navigation">
          <NavLink to="/" end className={navClass} onClick={closeNavigation}>Home</NavLink>
          <button type="button" className={`storefront-nav__link${productsActive || panel === 'products' ? ' is-active' : ''}`} aria-expanded={panel === 'products'} aria-controls="storefront-products" onClick={event => togglePanel('products', event.currentTarget)} onKeyDown={event => focusPanel(event, 'products')}>Products <ChevronDown size={13} aria-hidden="true" /></button>
          <NavLink to="/catalog" className={navClass} onClick={closeNavigation}>Catalog</NavLink>
          <NavLink to="/about" className={navClass} onClick={closeNavigation}>About Us</NavLink>
          <NavLink to="/bulk-inquiry#inquiry-form" className={navClass} onClick={closeNavigation}>Contact</NavLink>
        </nav>
        <div className="storefront-nav__actions">
          <Link to="/bulk-inquiry#inquiry-form" className="storefront-nav__solution" onClick={closeNavigation}>Get Solutions</Link>
          <div className="storefront-nav__utilities">
            <button type="button" className="storefront-nav__icon" aria-label="Search products" aria-expanded={panel === 'search'} aria-controls="storefront-search" onClick={event => togglePanel('search', event.currentTarget)}><Search size={20} /></button>
            <button type="button" className="storefront-nav__icon storefront-nav__account-trigger" aria-label={isAuthenticated ? 'Open my account' : 'Log in or create an account'} aria-expanded={panel === 'account'} aria-controls="storefront-account" onClick={event => togglePanel('account', event.currentTarget)} onKeyDown={event => focusPanel(event, 'account')}><UserRound size={20} /></button>
            <Link to="/cart" className={`storefront-nav__icon storefront-nav__cart${location.pathname === '/cart' ? ' is-active' : ''}`} aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`} onClick={closeNavigation}><ShoppingCart size={20} /><span className="storefront-nav__cart-count" aria-hidden="true">{cartCount > 99 ? '99+' : cartCount}</span></Link>
          </div>
          <button ref={drawerTriggerRef} type="button" className="storefront-nav__icon storefront-nav__menu-trigger" aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="storefront-mobile-navigation" onClick={() => { setPanel(null); setMobileOpen(true); }}><Menu size={24} /></button>
        </div>
      </div>

      {panel === 'search' && <div className="storefront-nav__search-panel" id="storefront-search">{searchForm('storefront-search-input', true)}</div>}
      {panel === 'account' && <div className="storefront-nav__account-panel" id="storefront-account" ref={accountPanelRef}>{accountLinks}</div>}
      {panel === 'products' && <div className="storefront-nav__products-panel" id="storefront-products" ref={categoryPanelRef}>
        <div className="storefront-nav__products-heading"><div><span>PRECISION CUTTING SOLUTIONS</span><h2>Find the right tool.</h2></div><Link to="/catalog" onClick={closeNavigation}>View all products <ArrowRight size={18} /></Link></div>
        {categoryStatus}
        <div className="storefront-nav__categories">
          {categories.map(category => <section className="storefront-nav__category" key={category.id}>
            <Link to={`/category/${category.slug}`} onClick={closeNavigation} className="storefront-nav__category-title">{category.name}<ArrowRight size={17} /></Link>
            {products.filter(product => product.categoryId === category.id || product.category?.id === category.id).slice(0, 4).map(product => <Link className="storefront-nav__product-link" to={`/product/${product.id}`} key={product.id} onClick={closeNavigation}>{product.name}</Link>)}
          </section>)}
        </div>
      </div>}
    </header>
    <div className="storefront-nav__spacer" aria-hidden="true" />

    {mobileOpen && <dialog className="storefront-nav__drawer" id="storefront-mobile-navigation" ref={drawerRef} aria-label="Navigation" onCancel={() => setMobileOpen(false)} onClick={event => { if (event.target === event.currentTarget) setMobileOpen(false); }}>
      <div className="storefront-nav__drawer-body">
        <div className="storefront-nav__drawer-heading"><Link to="/" onClick={closeNavigation} aria-label="SANSEI home"><img src="/images/sansei/logo-light.png" alt="SANSEI" width="1183" height="1329" /></Link><button type="button" className="storefront-nav__icon" aria-label="Close navigation" onClick={() => setMobileOpen(false)} autoFocus><X size={24} /></button></div>
        {searchForm('storefront-mobile-search')}
        <nav className="storefront-nav__mobile-links" aria-label="Mobile main navigation">
          <NavLink to="/" end className={navClass} onClick={closeNavigation}>Home</NavLink>
          <button type="button" className={`storefront-nav__link${productsActive ? ' is-active' : ''}`} aria-expanded={mobileProductsOpen} aria-controls="storefront-mobile-products" onClick={() => setMobileProductsOpen(open => !open)}>Products<ChevronDown size={17} aria-hidden="true" /></button>
          {mobileProductsOpen && <div className="storefront-nav__mobile-products" id="storefront-mobile-products">{categoryStatus}{categories.map(category => <Link key={category.id} to={`/category/${category.slug}`} onClick={closeNavigation}>{category.name}<ArrowRight size={16} /></Link>)}<Link to="/catalog" onClick={closeNavigation}>View all products<ArrowRight size={16} /></Link></div>}
          <NavLink to="/catalog" className={navClass} onClick={closeNavigation}>Catalog</NavLink>
          <NavLink to="/about" className={navClass} onClick={closeNavigation}>About Us</NavLink>
          <NavLink to="/bulk-inquiry#inquiry-form" className={navClass} onClick={closeNavigation}>Contact</NavLink>
        </nav>
        <Link to="/bulk-inquiry#inquiry-form" className="storefront-nav__solution" onClick={closeNavigation}>Get Solutions <ArrowRight size={17} /></Link>
        <div className="storefront-nav__mobile-account"><Link to="/cart" onClick={closeNavigation}><ShoppingCart size={17} /> Shopping cart <span>({cartCount})</span></Link>{accountLinks}</div>
        <div className="storefront-nav__extra-links"><Link to="/faqs" onClick={closeNavigation}>FAQs</Link><Link to="/join-us" onClick={closeNavigation}>Join us</Link></div>
      </div>
    </dialog>}
  </>;
}

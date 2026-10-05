import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../../service/authApi';
import { useGetCartQuery } from '../../service/cartApi';
import { useListCategoriesQuery, useListProductsQuery } from '../../service/productsApi';
import { COLORS, FONTS } from '../../constant/style';
import logo from '../../assets/logo.png';
import { getGuestCart } from '../../utils/guestCart';

interface NavbarProps {
  onLoginClick?: () => void;
  onMenuClick?: () => void;
  isSidebarMinimized?: boolean;
}

type MenuName = 'shop' | 'orders' | 'socials' | null;

export default function Navbar({ onLoginClick, onMenuClick, isSidebarMinimized }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const [logout] = useLogoutMutation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuName>(null);
  const [search, setSearch] = useState('');
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated || isAdminRoute });
  const { data: categoryResponse } = useListCategoriesQuery(undefined, { skip: isAdminRoute });
  const { data: productResponse } = useListProductsQuery({ limit: 100 }, { skip: isAdminRoute });
  const categories = categoryResponse?.data || [];
  const products = productResponse?.data || [];
  const apiCartCount = cartData?.data?.totalItems || 0;
  const guestCartCount = !isAuthenticated ? getGuestCart().reduce((sum, item) => sum + item.quantity, 0) : 0;
  const cartCount = isAuthenticated ? apiCartCount : guestCartCount;

  const go = (path: string) => {
    setActiveMenu(null);
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout({ refreshToken: localStorage.getItem('refreshToken') || '' }).unwrap();
    } finally {
      navigate('/');
    }
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = search.trim();
    go(value ? `/?search=${encodeURIComponent(value)}#shop` : '/#shop');
  };

  if (isAdminRoute) {
    return <>
      <header className={`fixed top-0 right-0 z-40 h-20 border-b border-gray-200 bg-white/95 backdrop-blur-xl transition-all ${isSidebarMinimized ? 'left-0 lg:left-[80px]' : 'left-0 lg:left-[260px]'}`} style={{ fontFamily: FONTS.main }}>
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden" aria-label="Open menu"><Menu size={22} /></button>
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">sensai commerce</p><h1 className="text-base font-extrabold text-gray-950">Admin workspace</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-bold text-gray-900">{user?.name || 'Administrator'}</p><p className="text-xs text-gray-500">{user?.email || 'Store operations'}</p></div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-100 font-extrabold text-violet-700">{(user?.name || 'A').charAt(0).toUpperCase()}</div>
            <button onClick={handleLogout} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Log out"><LogOut size={19} /></button>
          </div>
        </div>
      </header>
      <div className="h-20 shrink-0" />
    </>;
  }

  return <>
    <header className="fixed inset-x-0 top-0 z-50 bg-white" style={{ fontFamily: FONTS.main }}>
      <div className="relative bg-[#121212] text-white">
        <div className="mx-auto flex h-[42px] max-w-[1500px] items-center justify-center px-12 text-center text-[11px] font-medium tracking-[.08em] sm:text-sm">
          <ChevronDown className="absolute left-[10%] rotate-90 text-gray-500" size={17} />
          <span>Use code “sensai10” to get 10% discount on orders above Rs. 1599/-</span>
          <ChevronDown className="absolute right-[10%] -rotate-90 text-gray-500" size={17} />
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="mx-auto flex h-[92px] max-w-[1500px] items-center gap-5 px-5 lg:h-[126px] lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 text-gray-900 xl:hidden" aria-label="Open navigation"><Menu size={24} /></button>
          <button onClick={() => go('/')} className="flex shrink-0 items-center" aria-label="sensai Home">
            <img src={logo} alt="sensai" className="h-16 w-auto object-contain transition-opacity hover:opacity-90 sm:h-20 lg:h-24" />
          </button>

          <nav className="mx-auto hidden items-center gap-7 text-[15px] font-medium tracking-wide text-gray-800 xl:flex">
            <button onClick={() => go('/')} className={location.pathname === '/' ? 'border-b border-gray-900 py-1' : 'py-1'}>Home</button>
            <NavMenuButton label="Shop" open={activeMenu === 'shop'} onClick={() => setActiveMenu(activeMenu === 'shop' ? null : 'shop')} />
            <button onClick={() => go('/bulk-inquiry')} className={location.pathname === '/bulk-inquiry' ? 'border-b border-gray-900 py-1' : 'py-1'}>Bulk/Custom Inquiry</button>
            <NavMenuButton label="Your Order" open={activeMenu === 'orders'} onClick={() => setActiveMenu(activeMenu === 'orders' ? null : 'orders')} />
            <button onClick={() => go('/faqs')}>FAQs</button>
            <NavMenuButton label="Socials" open={activeMenu === 'socials'} onClick={() => setActiveMenu(activeMenu === 'socials' ? null : 'socials')} />
            <button onClick={() => go('/about')}>About us</button>
            <button onClick={() => go(isAuthenticated ? '/profile' : '/signup')}>Join us</button>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            {user?.role === 'ADMIN' && <button onClick={() => go('/admin/dashboard')} className="hidden p-2 text-gray-700 sm:block"><LayoutDashboard size={23} /></button>}
            <button onClick={() => setMobileOpen(true)} className="hidden p-2 text-black sm:block" title="Search"><Search size={28} strokeWidth={1.4} /></button>
            <button onClick={() => isAuthenticated ? go('/profile') : onLoginClick ? onLoginClick() : go('/login')} className="p-2 text-black"><UserRound size={29} strokeWidth={1.4} /></button>
            <button onClick={() => go('/cart')} className="relative p-2 text-black" title="Cart"><ShoppingCart size={29} strokeWidth={1.4} />{cartCount > 0 && <CountBadge value={cartCount} />}</button>
          </div>
        </div>
      </div>

      {activeMenu === 'shop' && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-168px)] overflow-y-auto border-b border-gray-200 bg-white shadow-xl" onMouseLeave={() => setActiveMenu(null)}>
          <div className="mx-auto grid max-w-[1450px] grid-cols-2 gap-x-12 gap-y-10 px-8 py-10 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category: any) => (
              <div key={category.id}>
                <button onClick={() => go(`/category/${category.slug}`)} className="text-left text-base font-bold text-gray-900 hover:text-violet-700">{category.name}</button>
                <div className="mt-4 space-y-3">
                  {products.filter((product: any) => product.category?.id === category.id).map((product: any) => (
                    <button key={product.id} onClick={() => go(`/product/${product.id}`)} className="block text-left text-sm leading-5 text-gray-500 hover:text-violet-700">{product.name}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMenu === 'orders' && (
        <DropdownPanel onLeave={() => setActiveMenu(null)}>
          <button onClick={() => go(isAuthenticated ? '/orders' : '/login')}>Order History</button>
          <button onClick={() => go(isAuthenticated ? '/orders' : '/login')}>Track your Order</button>
          <button onClick={() => go(isAuthenticated ? '/orders' : '/login')}>GST Invoice</button>
        </DropdownPanel>
      )}

      {activeMenu === 'socials' && (
        <DropdownPanel onLeave={() => setActiveMenu(null)}>
          <a href="https://www.reddit.com/" target="_blank" rel="noreferrer">Reddit</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.whatsapp.com/" target="_blank" rel="noreferrer">WhatsApp Community</a>
        </DropdownPanel>
      )}
    </header>
    <div className="h-[134px] lg:h-[168px]" />

    {mobileOpen && <div className="fixed inset-0 z-[60]">
      <button className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
      <aside className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <button onClick={() => go('/')} className="flex items-center" aria-label="sensai Home"><img src={logo} alt="sensai" className="h-12 w-auto object-contain" /></button>
          <button onClick={() => setMobileOpen(false)} className="p-2" aria-label="Close menu"><X size={22} /></button>
        </div>
        <form onSubmit={submitSearch} className="mt-7 flex overflow-hidden border border-gray-300"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products" className="min-w-0 flex-1 px-3 py-3 text-sm outline-none" /><button className="bg-violet-700 px-4 text-white"><Search size={18} /></button></form>
        <div className="mt-7 border-t border-gray-100">
          <button onClick={() => go('/')} className="block w-full border-b border-gray-100 py-3.5 text-left text-sm font-medium">Home</button>
          <p className="border-b border-gray-100 py-3.5 text-sm font-bold">Shop</p>
          {categories.map((category: any) => <button key={category.id} onClick={() => go(`/category/${category.slug}`)} className="block w-full border-b border-gray-100 py-3 pl-4 text-left text-sm text-gray-600">{category.name}</button>)}
          <button onClick={() => go('/bulk-inquiry')} className="block w-full border-b border-gray-100 py-3.5 text-left text-sm font-medium">Bulk/Custom Inquiry</button>
          <button onClick={() => go(isAuthenticated ? '/orders' : '/login')} className="block w-full border-b border-gray-100 py-3.5 text-left text-sm font-medium">Your Order</button>
          <button onClick={() => go('/faqs')} className="block w-full border-b border-gray-100 py-3.5 text-left text-sm font-medium">FAQs</button>
          <button onClick={() => go('/about')} className="block w-full border-b border-gray-100 py-3.5 text-left text-sm font-medium">About us</button>
          <button onClick={() => go(isAuthenticated ? '/profile' : '/signup')} className="block w-full border-b border-gray-100 py-3.5 text-left text-sm font-medium">Join us</button>
        </div>
      </aside>
    </div>}
  </>;
}

function NavMenuButton({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`flex items-center gap-2 py-1 ${open ? 'border-b border-gray-900' : ''}`}>{label}<ChevronDown size={15} className={open ? 'rotate-180' : ''} /></button>;
}

function DropdownPanel({ children, onLeave }: { children: React.ReactNode; onLeave: () => void }) {
  return <div onMouseLeave={onLeave} className="absolute inset-x-0 top-full border-b border-gray-200 bg-white shadow-lg"><div className="mx-auto flex max-w-[1450px] flex-col items-start gap-5 px-8 py-9 text-base text-gray-700">{children}</div></div>;
}

function CountBadge({ value }: { value: number }) {
  return <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-violet-700 px-1 text-[9px] font-black text-white">{value > 99 ? '99+' : value}</span>;
}

import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../../service/authApi';
import { FONTS } from '../../constant/style';
import StorefrontNavbar from './StorefrontNavbar';

interface NavbarProps {
  onLoginClick?: () => void;
  onMenuClick?: () => void;
  isSidebarMinimized?: boolean;
}

export default function Navbar({ onLoginClick, onMenuClick, isSidebarMinimized }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { user } = useAppSelector(state => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({ refreshToken: localStorage.getItem('refreshToken') || '' }).unwrap();
    } finally {
      navigate('/');
    }
  };

  if (isAdminRoute) {
    return <>
      <header className={`fixed top-0 right-0 z-40 h-20 border-b border-gray-200 bg-white/95 backdrop-blur-xl transition-all ${isSidebarMinimized ? 'left-0 lg:left-[80px]' : 'left-0 lg:left-[260px]'}`} style={{ fontFamily: FONTS.main }}>
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden" aria-label="Open menu"><Menu size={22} /></button>
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">sansei commerce</p><h1 className="text-base font-extrabold text-gray-950">Admin workspace</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-bold text-gray-900">{user?.name || 'Administrator'}</p><p className="text-xs text-gray-500">{user?.email || 'Store operations'}</p></div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-red-50 font-extrabold text-red-600">{(user?.name || 'A').charAt(0).toUpperCase()}</div>
            <button onClick={handleLogout} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Log out"><LogOut size={19} /></button>
          </div>
        </div>
      </header>
      <div className="h-20 shrink-0" />
    </>;
  }

  return <StorefrontNavbar onLoginClick={onLoginClick} />;
}
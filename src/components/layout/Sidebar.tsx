import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../constant/style';
import logo from '../../assets/logo.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const mainNavLinks = [
  {
    label: 'Shop',
    href: '/#shop',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    ),
  },
  {
    label: 'Collections',
    href: '/#collections',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '/#about',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
];

const adminNavLinks = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    )
  },
  {
    label: 'Products Management',
    path: '/admin/products',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    )
  },
  {
    label: 'Customers',
    path: '/admin/customers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  // {
  //   label: 'Marketing',
  //   path: '/admin/marketing',
  //   icon: (
  //     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M12 12H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h9l6 4V8l-6 4z" />
  //       <path d="M19 8c.7 1 1 2.2 1 3.5s-.3 2.5-1 3.5" />
  //       <path d="M6 17v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4" />
  //     </svg>
  //   )
  // },
  {
    label: 'Bulk/Custom Inquiries',
    path: '/admin/bulk-inquiries',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z" /><path d="M4 8h16" /><path d="M8 12h8" /><path d="M8 16h5" />
      </svg>
    )
  },  {
    label: 'Settings',
    path: '/admin/settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
];

export default function Sidebar({ isOpen, onClose, isMinimized, onToggleMinimize }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform transition-all duration-300 ease-in-out flex flex-col bg-black/95 backdrop-blur-xl border-r border-violet-500/20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isMinimized ? 'lg:w-[80px]' : 'lg:w-[260px]'}`}
        style={{
          fontFamily: FONTS.main,
          boxShadow: '4px 0 30px rgba(124,58,237,0.15)'
        }}
      >
        {/* Header */}
        <div
          className={`flex flex-shrink-0 transition-all duration-300 ease-in-out ${
            isMinimized 
              ? 'flex-col items-center justify-center pt-6 pb-2 gap-3.5' 
              : 'flex-row justify-between items-center px-6 h-[80px]'
          }`}
        >
          <div
            className={`flex items-center gap-3 cursor-pointer group ${isMinimized ? 'flex-col justify-center' : ''}`}
            onClick={() => handleNavigate('/')}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105 shadow-md">
              <img src={logo} alt="sensai" className="w-full h-full object-contain" />
            </div>
            {!isMinimized && (
              <span
                className="font-black text-xl tracking-tight transition-colors duration-300 text-white"
                style={{ fontFamily: FONTS.heading }}
              >
                sensai
              </span>
            )}
          </div>

          <div className={`flex items-center ${isMinimized ? 'flex-col gap-2' : 'gap-2'}`}>
            {/* Collapse/Expand Toggle Button (visible only on desktop) */}
            <button
              onClick={onToggleMinimize}
              className="hidden lg:flex w-8 h-8 rounded-xl items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-violet-500"
              title={isMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isMinimized ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 hover:scale-110">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 hover:scale-110">
                  <polyline points="11 17 6 12 11 7" />
                  <polyline points="18 17 13 12 18 7" />
                </svg>
              )}
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-violet-500"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-8 custom-scrollbar transition-all duration-300 ${isMinimized ? 'px-2' : 'px-4'}`}>
          {isAdminRoute ? (
            <>
              {isMinimized ? (
                <hr className="border-violet-500/10 my-4" />
              ) : (
                <p className="text-[11px] font-bold uppercase tracking-wider px-4 mb-4 text-white/40">
                  Admin Menu
                </p>
              )}
              <div className="flex flex-col gap-2">
                {adminNavLinks.map((link) => {
                  const basePath = link.path.split('/list')[0];
                  const isActive = location.pathname.startsWith(basePath);

                  const buttonContent = (
                    <button
                      key={link.path}
                      onClick={() => handleNavigate(link.path)}
                      className={`flex items-center transition-all duration-300 rounded-xl font-semibold ${
                        isMinimized 
                          ? 'w-12 h-12 justify-center mx-auto px-0' 
                          : 'w-full gap-3.5 px-4 py-3.5 text-[15px]'
                      } ${isActive
                        ? 'text-white'
                        : 'text-white hover:text-white hover:bg-white/5'
                        }`}
                      style={isActive ? {
                        backgroundColor: COLORS.primary,
                        boxShadow: `0 8px 20px -4px ${COLORS.primary}50`
                      } : {}}
                    >
                      <span className={`flex items-center justify-center transition-transform duration-300 ${isMinimized ? 'mx-auto' : ''} ${isActive ? 'scale-110' : ''}`}>
                        {link.icon}
                      </span>
                      {!isMinimized && link.label}
                    </button>
                  );

                  return isMinimized ? (
                    <div key={link.path} className="relative group w-full">
                      {buttonContent}
                      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0a0a0a]/95 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-violet-500/20 shadow-[0_4px_12px_rgba(124,58,237,0.15)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                        {link.label}
                      </span>
                    </div>
                  ) : (
                    buttonContent
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {isMinimized ? (
                <hr className="border-violet-500/10 my-4" />
              ) : (
                <p className="text-[11px] font-bold uppercase tracking-wider px-4 mb-4 text-white/40">
                  Main Menu
                </p>
              )}
              <div className="flex flex-col gap-2">
                {mainNavLinks.map((link) => {
                  const linkContent = (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center transition-all duration-300 rounded-xl no-underline ${
                        isMinimized 
                          ? 'w-12 h-12 justify-center mx-auto px-0' 
                          : 'w-full gap-3.5 px-4 py-3.5 font-semibold text-[15px]'
                      } text-white/60 hover:text-white hover:bg-white/5`}
                    >
                      <span className={`flex items-center justify-center text-white/40 group-hover:text-violet-500 transition-colors duration-300 ${isMinimized ? 'mx-auto' : ''}`}>
                        {link.icon}
                      </span>
                      {!isMinimized && link.label}
                    </a>
                  );

                  return isMinimized ? (
                    <div key={link.label} className="relative group w-full">
                      {linkContent}
                      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0a0a0a]/95 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-violet-500/20 shadow-[0_4px_12px_rgba(124,58,237,0.15)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                        {link.label}
                      </span>
                    </div>
                  ) : (
                    linkContent
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={`flex-shrink-0 flex flex-col gap-2 transition-all duration-300 ${isMinimized ? 'p-2' : 'p-4'}`} style={{ borderTop: `1px solid rgba(124,58,237,0.2)` }}>
          {isAdminRoute ? (
            (() => {
              const storefrontButton = (
                <button
                  onClick={() => handleNavigate('/')}
                  className={`flex items-center justify-center rounded-xl font-semibold text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 transition-all duration-300 ${
                    isMinimized 
                      ? 'w-12 h-12 px-0 mx-auto' 
                      : 'w-full gap-2.5 px-4 py-3.5 text-[14px]'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMinimized ? 'mx-auto' : ''}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  {!isMinimized && "View Storefront"}
                </button>
              );

              const logoutButton = (
                <button
                  onClick={handleLogout}
                  className={`flex items-center justify-center rounded-xl font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 ${
                    isMinimized 
                      ? 'w-12 h-12 px-0 mx-auto' 
                      : 'w-full gap-2.5 px-4 py-3.5 text-[14px]'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMinimized ? 'mx-auto' : ''}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {!isMinimized && "Logout"}
                </button>
              );

              return isMinimized ? (
                <>
                  <div className="relative group w-full">
                    {storefrontButton}
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0a0a0a]/95 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-violet-500/20 shadow-[0_4px_12px_rgba(124,58,237,0.15)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                      View Storefront
                    </span>
                  </div>
                  <div className="relative group w-full">
                    {logoutButton}
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0a0a0a]/95 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-violet-500/20 shadow-[0_4px_12px_rgba(124,58,237,0.15)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                      Logout
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {storefrontButton}
                  {logoutButton}
                </>
              );
            })()
          ) : (
            (() => {
              const loginButton = (
                <button
                  onClick={() => handleNavigate('/login')}
                  className={`flex items-center justify-center rounded-xl font-semibold text-white/60 hover:bg-white/5 hover:text-violet-500 transition-all duration-300 ${
                    isMinimized 
                      ? 'w-12 h-12 px-0 mx-auto' 
                      : 'w-full gap-2.5 px-4 py-3.5 text-[14px]'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMinimized ? 'mx-auto' : ''}>
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  {!isMinimized && "Admin Login"}
                </button>
              );

              return isMinimized ? (
                <div className="relative group w-full">
                  {loginButton}
                  <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0a0a0a]/95 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-violet-500/20 shadow-[0_4px_12px_rgba(124,58,237,0.15)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                    Admin Login
                  </span>
                </div>
              ) : (
                loginButton
              );
            })()
          )}
        </div>
      </div>
    </>
  );
}

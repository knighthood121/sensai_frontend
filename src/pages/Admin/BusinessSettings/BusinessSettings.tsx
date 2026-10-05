import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../constant/style';

const menuItems = [
  {
    title: 'CMS Pages',
    path: '/admin/settings/cms',
    description: 'Manage content pages like About Us, Privacy Policy, Terms, etc.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'Contact Details',
    path: '/admin/settings/contact',
    description: 'Update business address, phone, email, and social media links.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: 'Payment Gateway',
    path: '/admin/settings/payment',
    description: 'Configure supported payment methods, API keys, and currencies.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Reports & Analytics',
    path: '/admin/settings/reports',
    description: 'Configure report generation, analytics tracking, and data exports.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Shipping Charges',
    path: '/admin/settings/shipping',
    description: 'Define delivery zones, shipping rates, and fulfillment providers.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Tax Settings',
    path: '/admin/settings/tax',
    description: 'Configure regional tax rates, GST/VAT settings, and exemptions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  }
];

export default function BusinessSettings() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }} className="max-w-7xl mx-auto">

      {/* Header Section */}
      <div className="mb-6 relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl blur-2xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            Business Settings
          </h1>
        </div>
        <p className="text-base max-w-2xl ml-16" style={{ color: COLORS.textLight }}>
          Manage your store's core configuration. Update payment methods, shipping, tax rates, and basic information.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="group relative bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 overflow-hidden flex flex-col h-full z-10"
          >
            {/* Background Accent Gradient on Hover */}
            <div
              className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
              style={{ background: `radial-gradient(circle, ${COLORS.primary}15 0%, transparent 70%)` }}
            />

            {/* Top Border Accent */}
            <div
              className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left"
              style={{ background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})` }}
            />

            <div className="flex items-start justify-between mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}12, ${COLORS.primary}05)`,
                  color: COLORS.primary,
                  border: `1px solid ${COLORS.primary}20`
                }}
              >
                <div className="relative z-10">{item.icon}</div>
                {/* Shine effect inside icon box */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:translate-x-full transition-all duration-700 -translate-x-full" />
              </div>
            </div>

            <div className="flex-1">
              <h3
                className="text-lg font-bold mb-2 transition-colors duration-300"
                style={{ fontFamily: FONTS.heading, color: COLORS.text }}
              >
                <span className="group-hover:text-pink-600 transition-colors duration-300">{item.title}</span>
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textLight }}>
                {item.description}
              </p>
            </div>

            {/* Bottom Action Area */}
            <div className="mt-8 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium" style={{ color: COLORS.primary }}>
                Configure {item.title}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-pink-50 transition-colors duration-300 transform group-hover:translate-x-1"
                style={{ color: COLORS.primary }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

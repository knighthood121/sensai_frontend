import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../constant/style';

const menuItems = [
  {
    title: 'Customer List',
    path: '/admin/customers/list',
    description: 'View, search and manage all registered customers and their data',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    count: 0,
  },
  {
    title: 'Reviews & Ratings',
    path: '/admin/customers/reviews',
    description: 'Monitor and moderate customer reviews and product ratings',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    count: 0,
  },
];

export default function CustomerManagement() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }} className="max-w-7xl mx-auto">

      {/* Header Section */}
      <div className="mb-6 relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-3xl blur-2xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            Customer Center
          </h1>
        </div>
        <p className="text-base max-w-2xl ml-16" style={{ color: COLORS.textLight }}>
          Centralized control hub for your customer relationships. Manage profiles and engage with reviews.
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

              {item.count !== undefined && item.count > 0 && (
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: '#fff',
                  }}
                >
                  {item.count}
                </span>
              )}
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
                Manage {item.title.split(' ')[0]}
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

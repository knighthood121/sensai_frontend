import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../constant/style';

const menuItems = [
  {
    title: 'Order List',
    path: '/admin/orders/list',
    description: 'View, search and manage all customer orders in one place',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    count: 0,
  },
  {
    title: 'Return Requests',
    path: '/admin/orders/returns',
    description: 'Manage customer returns, replacements and refund requests',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
      </svg>
    ),
    count: 0,
  },
  {
    title: 'Shipment Management',
    path: '/admin/orders/shipments',
    description: 'Track and update order shipments and delivery status',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
  },
  {
    title: 'Invoice Generation',
    path: '/admin/orders/invoices',
    description: 'Generate and manage billing invoices for customer orders',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
];

export default function OrderManagement() {
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            Order Center
          </h1>
        </div>
        <p className="text-base max-w-2xl ml-16" style={{ color: COLORS.textLight }}>
          Centralized control hub for customer orders. Manage shipments, process returns, and generate invoices seamlessly.
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

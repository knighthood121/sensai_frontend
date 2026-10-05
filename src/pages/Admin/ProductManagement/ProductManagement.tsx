import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../constant/style';

const menuItems = [
  {
    title: 'Product List',
    path: '/admin/products/list',
    description: 'View, search and manage all your products in one place',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    count: 0,
  },
  {
    title: 'Add Product',
    path: '/admin/products/add',
    description: 'Create a new product listing with detailed information',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Categories',
    path: '/admin/products/categories',
    description: 'Organize products into logical hierarchical categories',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    count: 0,
  },
  {
    title: 'Inventory',
    path: '/admin/products/inventory',
    description: 'Track and manage stock levels across all your products',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Variants',
    path: '/admin/products/variants',
    description: 'Manage size, color, fabric and other product options',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: 'SKU Management',
    path: '/admin/products/sku',
    description: 'Generate and manage stock keeping units effectively',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Bulk Upload',
    path: '/admin/products/upload',
    description: 'Upload multiple products at once via CSV or Excel',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    title: 'Image Upload',
    path: '/admin/products/images',
    description: 'Upload and organize your product media gallery',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
];

export default function ProductManagement() {
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
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            Product Center
          </h1>
        </div>
        <p className="text-base max-w-2xl ml-16" style={{ color: COLORS.textLight }}>
          Centralized control hub for your catalog. Manage inventory, organize categories, and configure product variants seamlessly.
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

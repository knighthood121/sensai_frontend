import { COLORS, FONTS } from '../../../../constant/style';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/common/Button';

const dummyBanners = [
  { id: 'BAN-001', title: 'Summer Hero', location: 'Homepage Top', status: 'Active', image: 'https://via.placeholder.com/400x150/ffb6c1/ffffff?text=Summer+Sale', clicks: 1240, ctr: '4.2%' },
  { id: 'BAN-002', title: 'New Arrivals', location: 'Category Sidebar', status: 'Active', image: 'https://via.placeholder.com/400x150/87cefa/ffffff?text=New+Arrivals', clicks: 850, ctr: '3.1%' },
  { id: 'BAN-003', title: 'Winter Clearance', location: 'Homepage Bottom', status: 'Inactive', image: 'https://via.placeholder.com/400x150/d3d3d3/ffffff?text=Winter+Clearance', clicks: 3200, ctr: '5.8%' },
];

export default function BannerManagementScreen() {
  const navigate = useNavigate();
  
  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/admin/marketing')}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors"
                  style={{ borderColor: COLORS.border }}
                  title="Go Back"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
              </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Banner Management</h1>
          <p className="text-sm text-gray-500 mt-1">Design and manage promotional banners across your store.</p>
        </div>
        <Button variant="primary" size="md" className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform">
          + Add New Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyBanners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col group" style={{ borderColor: COLORS.border }}>
            <div className="h-40 w-full bg-gray-100 relative overflow-hidden">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                  banner.status === 'Active' ? 'bg-emerald-500/90 text-white shadow-sm' : 'bg-gray-500/90 text-white shadow-sm'
                }`}>
                  {banner.status}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-1">{banner.title}</h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {banner.location}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t" style={{ borderColor: COLORS.border }}>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Clicks</p>
                  <p className="font-bold text-gray-900">{banner.clicks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">CTR</p>
                  <p className="font-bold text-emerald-600">{banner.ctr}</p>
                </div>
              </div>
            </div>

            <div className="flex border-t divide-x" style={{ borderColor: COLORS.border }}>
              <button className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                Edit
              </button>
              <button className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import{ useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';

export default function TaxSettings() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }} className="p-2 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/admin/settings')}
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
      
      {/* Header Section */}
      <div className="mb-6 relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-3xl blur-2xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h1 
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            Tax Settings
          </h1>
        </div>
        <p className="text-base max-w-2xl ml-16" style={{ color: COLORS.textLight }}>
          Configure regional tax rates, GST/VAT settings, and exemptions.
        </p>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border p-8 flex flex-col items-center justify-center min-h-[400px] shadow-sm" style={{ borderColor: COLORS.border }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md text-center">
          The configuration interface is currently under development.
        </p>
      </div>
    </div>
  );
}

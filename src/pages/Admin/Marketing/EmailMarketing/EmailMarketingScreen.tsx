import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';

export default function EmailMarketingScreen() {
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Email Marketing</h1>
          <p className="text-sm text-gray-500 mt-1">Design newsletters and automated email sequences.</p>
        </div>
        <Button variant="primary" size="md" className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform">
          + Create Campaign
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border shadow-sm" style={{ borderColor: COLORS.border }}>
        <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-2">No Campaigns Yet</h2>
        <p className="text-gray-500 text-sm max-w-sm text-center mb-6">Engage with your audience by creating your first email marketing campaign.</p>
        <Button variant="outline" size="md">Browse Templates</Button>
      </div>
    </div>
  );
}

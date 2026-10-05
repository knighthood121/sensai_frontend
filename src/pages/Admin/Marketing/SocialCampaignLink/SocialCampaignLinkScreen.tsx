import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';

export default function SocialCampaignLinkScreen() {
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Social Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tracking links and monitor social media impact.</p>
        </div>
        <Button variant="primary" size="md" className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform">
          + Create Tracking Link
        </Button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col items-center justify-center text-center py-20" style={{ borderColor: COLORS.border }}>
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-2">Integrate Social Accounts</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">Connect your social media platforms to auto-generate tracking links and view campaign analytics here.</p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="!bg-[#1877F2] !text-white !border-transparent hover:!bg-blue-700">Connect Facebook</Button>
          <Button variant="outline" size="sm" className="!bg-[#E4405F] !text-white !border-transparent hover:!bg-pink-700">Connect Instagram</Button>
        </div>
      </div>
    </div>
  );
}

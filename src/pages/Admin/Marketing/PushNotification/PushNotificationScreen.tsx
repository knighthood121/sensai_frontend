import { useNavigate} from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';

export default function PushNotificationScreen() {
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Push Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Send direct alerts and updates to customer devices.</p>
        </div>
        <Button variant="primary" size="md" className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform">
          + New Push
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Composer Card */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
          <h2 className="text-lg font-bold mb-4">Compose Message</h2>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
               <input type="text" className="w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-500 transition-all" placeholder="Flash Sale Alert!" style={{ borderColor: COLORS.border }} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
               <textarea rows={3} className="w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-500 transition-all" placeholder="Get 50% off on premium tees..." style={{ borderColor: COLORS.border }}></textarea>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
               <select className="w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-500 transition-all bg-white" style={{ borderColor: COLORS.border }}>
                 <option>All Subscribers</option>
                 <option>Active Customers</option>
                 <option>Inactive Customers</option>
               </select>
             </div>
             <Button variant="primary" className="w-full">Send Notification</Button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-gray-50 rounded-2xl border p-6 flex items-center justify-center shadow-inner" style={{ borderColor: COLORS.border }}>
           <div className="w-72 bg-white rounded-3xl shadow-xl border overflow-hidden relative">
             <div className="bg-gray-100 h-6 w-full flex items-center justify-center">
               <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
             </div>
             <div className="p-4 bg-gray-50 h-64 flex items-start justify-center pt-8">
                {/* Notification Bubble */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border w-full animate-bounce" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded bg-pink-500"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Store App</span>
                    <span className="text-[10px] text-gray-400 ml-auto">now</span>
                  </div>
                  <p className="font-bold text-sm text-gray-900 mb-1">Flash Sale Alert!</p>
                  <p className="text-xs text-gray-600">Get 50% off on premium tees today only.</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

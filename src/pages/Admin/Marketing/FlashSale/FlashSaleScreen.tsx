import { useNavigate} from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';

export default function FlashSaleScreen() {
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Flash Sales</h1>
          <p className="text-sm text-gray-500 mt-1">Configure time-limited sales and special events.</p>
        </div>
        <Button variant="primary" size="md" className="shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 transition-transform">
          + Schedule Sale
        </Button>
      </div>
      
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-4">
            Upcoming Event
          </span>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: FONTS.heading }}>Diwali Mega Sale</h2>
          <p className="text-pink-100 max-w-lg mb-6">Flat 40% OFF across all categories. Starts in 2 days.</p>
          
          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center">
               <p className="text-2xl font-bold">02</p>
               <p className="text-[10px] uppercase tracking-wider opacity-80">Days</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center">
               <p className="text-2xl font-bold">14</p>
               <p className="text-[10px] uppercase tracking-wider opacity-80">Hours</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center">
               <p className="text-2xl font-bold">45</p>
               <p className="text-[10px] uppercase tracking-wider opacity-80">Mins</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

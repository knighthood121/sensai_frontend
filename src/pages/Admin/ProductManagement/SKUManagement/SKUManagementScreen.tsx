import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';

export default function SKUManagementScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors"
            style={{ borderColor: COLORS.border }}
            title="Go Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: COLORS.textLight }}>
          Manage stock keeping units and track product identifiers.
        </p>
        <Button variant="primary" size="md">+ Generate SKU</Button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: '#F9FAFB' }}>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: COLORS.textLight }}>SKU Code</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell" style={{ color: COLORS.textLight }}>Product</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell" style={{ color: COLORS.textLight }}>Variant</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: COLORS.textLight }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-5 py-12 text-center">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: COLORS.primary + '12', color: COLORS.primary }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <p className="font-bold text-sm mb-1">No SKUs generated</p>
                <p className="text-xs" style={{ color: COLORS.textLight }}>Add products to generate SKU codes</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

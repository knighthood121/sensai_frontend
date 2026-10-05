import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';

export default function BulkUploadScreen() {
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
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <h3 className="text-base font-bold" style={{ fontFamily: FONTS.heading }}>
            Bulk Product Upload
          </h3>
          <p className="text-xs mt-1" style={{ color: COLORS.textLight }}>
            Upload a CSV or Excel file to add multiple products at once.
          </p>
        </div>

        <div className="p-6">
          {/* Upload area */}
          <div
            className="border-2 border-dashed rounded-2xl p-12 text-center transition-colors hover:border-pink-300 cursor-pointer mb-6"
            style={{ borderColor: COLORS.border }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + '12', color: COLORS.primary }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-base font-bold mb-2">Drop your file here or click to browse</p>
            <p className="text-xs mb-4" style={{ color: COLORS.textLight }}>Supports CSV, XLSX (max 10MB)</p>
            <Button variant="outline" size="sm">Select File</Button>
          </div>

          {/* Instructions */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#F9FAFB' }}>
            <h4 className="text-sm font-bold mb-3">Upload Instructions</h4>
            <ul className="space-y-2 text-xs" style={{ color: COLORS.textLight }}>
              <li className="flex items-start gap-2">
                <span style={{ color: COLORS.primary }}>1.</span>
                <span>Download the template file to ensure correct formatting</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: COLORS.primary }}>2.</span>
                <span>Fill in product details: name, SKU, price, category, stock quantity</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: COLORS.primary }}>3.</span>
                <span>Upload the completed file and review before confirming</span>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="mt-3">📥 Download Template</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

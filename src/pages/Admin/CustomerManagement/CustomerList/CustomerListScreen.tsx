import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';

const dummyCustomers = [
  { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', totalOrders: 12, totalSpent: 15400, status: 'Active' },
  { id: 'CUST-002', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 8765432109', totalOrders: 5, totalSpent: 4200, status: 'Active' },
  { id: 'CUST-003', name: 'Alice Johnson', email: 'alice@example.com', phone: '+91 7654321098', totalOrders: 0, totalSpent: 0, status: 'Inactive' },
];

export default function CustomerListScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/customers')}
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

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.textLight }}
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-4 focus:ring-pink-100"
              style={{ borderColor: COLORS.border }}
              placeholder="Search customers by name, email..."
              onFocus={(e) => { e.target.style.borderColor = COLORS.primary; }}
              onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
            />
          </div>
        </div>
        <Button variant="outline" size="md" className="hover:-translate-y-0.5 transition-transform">
          Export Customers
        </Button>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 transition-colors">
                <th className="px-5 py-4 w-12 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer" />
                </th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell text-gray-500">Contact Info</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Orders</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Total Spent</th>
                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden lg:table-cell text-gray-500">Status</th>
                <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold flex-shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p 
                          className="font-bold text-sm text-gray-900 group-hover:text-pink-600 transition-colors cursor-pointer hover:underline" 
                          onClick={() => navigate('/admin/customers/details', { state: { customerId: customer.id } })}
                        >
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                    <p className="text-sm">{customer.email}</p>
                    <p className="text-xs">{customer.phone}</p>
                  </td>
                  <td className="px-5 py-4 font-bold text-sm text-gray-900">
                    {customer.totalOrders}
                  </td>
                  <td className="px-5 py-4 font-bold text-sm text-gray-900 hidden md:table-cell">
                    ₹{customer.totalSpent}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' :
                        'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        customer.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-pink-600"
                      onClick={() => navigate('/admin/customers/details', { state: { customerId: customer.id } })}
                      title="View Details"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

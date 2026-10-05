import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';

interface RecentOrder {
  id: string;
  date: string;
  total: number;
  status: string;
}

interface CustomerDetail {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  since: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  recentOrders: RecentOrder[];
}

const customerDetailsData: Record<string, CustomerDetail> = {
  'CUST-001': {
    id: 'CUST-001',
    name: 'John Doe',
    initials: 'JD',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    since: 'October 2023',
    totalOrders: 12,
    totalSpent: 15400,
    status: 'Active',
    recentOrders: [
      { id: '#ORD-001', date: 'Oct 25, 2023', total: 1498, status: 'Fulfilled' }
    ]
  },
  'CUST-002': {
    id: 'CUST-002',
    name: 'Jane Smith',
    initials: 'JS',
    email: 'jane@example.com',
    phone: '+91 87654 32109',
    since: 'November 2023',
    totalOrders: 5,
    totalSpent: 4200,
    status: 'Active',
    recentOrders: [
      { id: '#ORD-002', date: 'Oct 26, 2023', total: 2999, status: 'Unfulfilled' }
    ]
  },
  'CUST-003': {
    id: 'CUST-003',
    name: 'Alice Johnson',
    initials: 'AJ',
    email: 'alice@example.com',
    phone: '+91 76543 21098',
    since: 'December 2023',
    totalOrders: 0,
    totalSpent: 0,
    status: 'Inactive',
    recentOrders: []
  }
};

export default function CustomerDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { customerId?: string } | null;
  const customerId = state?.customerId || 'CUST-001';
  const customer = customerDetailsData[customerId] || customerDetailsData['CUST-001'];

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/customers/list')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>{customer.name}</h1>
            <p className="text-sm text-gray-500">Customer since {customer.since}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-2xl font-bold mb-3">
                {customer.initials}
              </div>
              <h2 className="text-lg font-bold">{customer.name}</h2>
              <p className="text-sm text-gray-500 mb-2">ID: {customer.id}</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${customer.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {customer.status}
              </span>
            </div>
            
            <div className="space-y-4 pt-6 border-t" style={{ borderColor: COLORS.border }}>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: COLORS.border }}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">{customer.totalOrders}</h3>
            </div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: COLORS.border }}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Total Spent</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{customer.totalSpent.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
            {customer.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {customer.recentOrders.map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: COLORS.border }}>
                    <div>
                      <p 
                        className="font-bold text-sm text-pink-600 cursor-pointer hover:underline" 
                        onClick={() => navigate('/admin/orders/details', { state: { orderId: ord.id } })}
                      >
                        {ord.id}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{ord.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{ord.total.toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] font-bold uppercase ${ord.status === 'Fulfilled' ? 'text-emerald-600' : 'text-amber-600'}`}>{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No recent orders found for this customer.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

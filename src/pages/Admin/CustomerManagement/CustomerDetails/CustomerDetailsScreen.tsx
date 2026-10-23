import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import { useGetAdminCustomerByIdQuery } from '../../../../service/adminCustomerApi';
import { useGetAdminOrdersQuery } from '../../../../service/adminOrderApi';
import { ArrowLeft, Loader2, MapPin, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export default function CustomerDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { customerId?: number | string; customerData?: any } | null;
  const customerId = state?.customerId || 1;

  // Primary API: Direct customer details
  const {
    data: customerApiData,
    isLoading: isCustLoading,
    isError: isCustError,
  } = useGetAdminCustomerByIdQuery(customerId);

  // Fallback API: Fetch orders for this customer from DB
  const {
    data: customerOrdersData,
    isLoading: isOrdersLoading,
  } = useGetAdminOrdersQuery(
    { userId: Number(customerId), limit: 20 },
    { skip: !isCustError && !!customerApiData?.data }
  );

  // Construct unified customer data from API or fallback
  const customer = useMemo(() => {
    if (customerApiData?.data) {
      return customerApiData.data;
    }

    // Fallback from passed state and orders
    const passed = state?.customerData;
    const orders = customerOrdersData?.data || [];

    const totalOrders = orders.length > 0 ? orders.length : passed?.totalOrders || 0;
    const totalSpent =
      orders.length > 0
        ? orders.reduce((sum, ord) => (ord.status !== 'CANCELLED' ? sum + Number(ord.totalAmount) : sum), 0)
        : passed?.totalSpent || 0;

    const name = passed?.name || orders[0]?.customer?.name || 'Customer';
    const email = passed?.email || orders[0]?.customer?.email || '—';
    const phone = passed?.phone || orders[0]?.customer?.phone || '—';
    const id = passed?.id || Number(customerId);
    const customerCode = passed?.customerId || `CUST-${String(id).padStart(3, '0')}`;

    const nameParts = name.trim().split(' ');
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();

    const sinceDate = passed?.createdAt || orders[orders.length - 1]?.createdAt || new Date().toISOString();
    const since = new Date(sinceDate).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const recentOrders = orders.map((ord) => ({
      id: ord.id,
      orderNumber: ord.orderNumber,
      date: new Date(ord.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      total: Number(ord.totalAmount),
      status: ord.status,
      itemsCount: ord.items?.length || 1,
    }));

    return {
      id,
      customerId: customerCode,
      name,
      initials,
      email,
      phone,
      since,
      totalOrders,
      totalSpent,
      status: passed?.status || ('Active' as const),
      addresses: orders[0]?.address ? [orders[0].address] : [],
      recentOrders,
    };
  }, [customerApiData, state?.customerData, customerOrdersData, customerId]);

  const isLoading = isCustLoading && isOrdersLoading;

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/customers/list')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: FONTS.heading }}>
              {customer.name}
            </h1>
            <p className="text-sm text-gray-500">Customer since {customer.since}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading customer details...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mb-3 shadow-inner">
                  {customer.initials}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{customer.name}</h2>
                <p className="text-xs text-gray-400 font-mono mb-2">ID: {customer.customerId}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    customer.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      customer.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  {customer.status}
                </span>
              </div>

              <div className="space-y-4 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 font-bold uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-gray-900 break-all">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 font-bold uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 font-bold uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.since}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Card */}
            {customer.addresses && customer.addresses.length > 0 && (
              <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <MapPin size={14} className="text-red-600" /> Saved Address
                </h3>
                {customer.addresses.slice(0, 1).map((addr: any, idx: number) => (
                  <div key={idx} className="text-xs space-y-1 text-gray-600">
                    <p className="font-bold text-gray-900 text-sm">{addr.fullName}</p>
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                    {addr.phone && <p className="text-gray-400 pt-1 font-semibold">📞 {addr.phone}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overview Stats & Recent Orders */}
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {customer.recentOrders?.length || 0} order{customer.recentOrders?.length !== 1 ? 's' : ''}
                </span>
              </div>

              {customer.recentOrders && customer.recentOrders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {customer.recentOrders.map((ord: any) => (
                    <div
                      key={ord.id}
                      className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-gray-50/50 rounded-xl px-2 -mx-2 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <p
                          className="font-bold text-sm text-red-600 cursor-pointer hover:underline"
                          onClick={() => navigate('/admin/orders/details', { state: { orderId: ord.id } })}
                        >
                          #{ord.orderNumber}
                        </p>
                        <p className="text-xs text-gray-400">{ord.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-gray-900">₹{ord.total.toLocaleString('en-IN')}</p>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === 'DELIVERED'
                              ? 'text-emerald-600'
                              : ord.status === 'CANCELLED'
                              ? 'text-rose-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <ShoppingBag size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No recent orders found for this customer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

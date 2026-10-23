import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import { useGetAdminCustomersQuery } from '../../../../service/adminCustomerApi';
import { useGetAdminOrdersQuery } from '../../../../service/adminOrderApi';
import { Loader2, ArrowLeft, Download, Eye, Users } from 'lucide-react';
import type { CustomerSummary } from '../../../../types/Customer.type';

export default function CustomerListScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Primary API: Get customers from backend customer endpoint
  const {
    data: customerApiData,
    isLoading: isCustLoading,
    isError: isCustError,
  } = useGetAdminCustomersQuery();

  // Fallback API: If backend endpoint is 404/not yet deployed on remote host,
  // derive real customers directly from real orders in the database
  const {
    data: ordersApiData,
    isLoading: isOrdersLoading,
  } = useGetAdminOrdersQuery({ limit: 100 }, { skip: !isCustError });

  // Derive customers from orders if direct customer endpoint is unavailable
  const fallbackCustomers = useMemo<CustomerSummary[]>(() => {
    if (!ordersApiData?.data) return [];
    const customerMap = new Map<number, CustomerSummary>();

    ordersApiData.data.forEach((order) => {
      const c = order.customer;
      if (!c) return;
      const orderAmount = order.status !== 'CANCELLED' ? Number(order.totalAmount || 0) : 0;
      const existing = customerMap.get(c.id);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += orderAmount;
      } else {
        customerMap.set(c.id, {
          id: c.id,
          customerId: `CUST-${String(c.id).padStart(3, '0')}`,
          name: c.name || 'Customer',
          email: c.email || '—',
          phone: c.phone || '—',
          totalOrders: 1,
          totalSpent: orderAmount,
          status: 'Active',
          createdAt: order.createdAt,
        });
      }
    });

    return Array.from(customerMap.values());
  }, [ordersApiData]);

  // Unified real customers list
  const allCustomers = useMemo<CustomerSummary[]>(() => {
    if (customerApiData?.data && Array.isArray(customerApiData.data) && customerApiData.data.length > 0) {
      return customerApiData.data;
    }
    if (customerApiData?.data && customerApiData.data.length === 0 && !isCustError) {
      return [];
    }
    return fallbackCustomers;
  }, [customerApiData, isCustError, fallbackCustomers]);

  // Client-side search filter
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return allCustomers;
    const q = searchQuery.toLowerCase().trim();
    return allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.customerId.toLowerCase().includes(q)
    );
  }, [allCustomers, searchQuery]);

  const isLoading = isCustLoading || (isCustError && isOrdersLoading);

  // Toggle selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) return;
    const headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Total Orders', 'Total Spent (INR)', 'Status'];
    const rows = filteredCustomers.map((c) => [
      c.customerId,
      `"${c.name.replace(/"/g, '""')}"`,
      c.email,
      c.phone,
      c.totalOrders,
      c.totalSpent,
      c.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/customers')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: FONTS.heading }}>
              Customers
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredCustomers.length} registered customer{filteredCustomers.length !== 1 ? 's' : ''} in database
            </p>
          </div>
        </div>
      </div>

      {/* Top bar: Search & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.textLight }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-4 focus:ring-red-100 bg-white"
              style={{ borderColor: COLORS.border }}
              placeholder="Search customers by name, email, phone, ID..."
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.border;
              }}
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={handleExportCSV}
          disabled={filteredCustomers.length === 0}
          className="hover:-translate-y-0.5 transition-transform flex items-center gap-2 cursor-pointer"
        >
          <Download size={14} />
          Export Customers
        </Button>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider">Loading customers from database...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 text-gray-400">
              <Users size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No customers found</h3>
            <p className="text-xs text-gray-400 max-w-sm">
              {searchQuery ? `No customers matched "${searchQuery}". Try a different term.` : 'Registered customers will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 transition-colors">
                  <th className="px-5 py-4 w-12 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
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
                {filteredCustomers.map((customer) => {
                  const initial = customer.name ? customer.name.charAt(0).toUpperCase() : 'C';

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(customer.id)}
                          onChange={() => handleSelectRow(customer.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p
                              className="font-bold text-sm text-gray-900 group-hover:text-red-600 transition-colors cursor-pointer hover:underline"
                              onClick={() =>
                                navigate('/admin/customers/details', {
                                  state: { customerId: customer.id, customerData: customer },
                                })
                              }
                            >
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">ID: {customer.customerId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                        <p className="text-sm font-medium text-gray-800">{customer.email}</p>
                        <p className="text-xs text-gray-400">{customer.phone}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-sm text-gray-900">
                        {customer.totalOrders}
                      </td>
                      <td className="px-5 py-4 font-bold text-sm text-gray-900 hidden md:table-cell">
                        ₹{customer.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            customer.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                              : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              customer.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-red-600 cursor-pointer"
                          onClick={() =>
                            navigate('/admin/customers/details', {
                              state: { customerId: customer.id, customerData: customer },
                            })
                          }
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

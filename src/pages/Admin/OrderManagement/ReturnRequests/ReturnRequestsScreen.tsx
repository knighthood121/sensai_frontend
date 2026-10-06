import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../../../../constant/style';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import { useGetAdminTicketsQuery, useUpdateTicketStatusMutation } from '../../../../service/adminTicketApi';
import { Loader2, AlertCircle, Search, Filter, MessageSquare } from 'lucide-react';
import { useToast } from '../../../../components/common/Toast';
import type { TicketStatus, TicketPriority, SupportTicket } from '../../../../types/Ticket.type';

export default function ReturnRequestsScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [updateTicketStatus, { isLoading: isUpdating }] = useUpdateTicketStatusMutation();

  // ─── Filter & Pagination State ─────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');

  // ─── Reply Modal State ─────────────────────────────────────────────────────
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyStatus, setReplyStatus] = useState<TicketStatus>('RESOLVED');
  const [adminResponse, setAdminResponse] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ─── Fetch Admin Tickets ──────────────────────────────────────────────────
  const {
    data: ticketsData,
    isLoading,
    isError,
    error,
  } = useGetAdminTicketsQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const tickets = ticketsData?.data || [];
  const pagination = ticketsData?.pagination;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleQuickStatusChange = async (ticketId: number, newStatus: TicketStatus) => {
    try {
      await updateTicketStatus({ id: ticketId, data: { status: newStatus } }).unwrap();
      showToast(`Ticket status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update ticket status.', 'error');
    }
  };

  const openReplyModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyStatus(ticket.status === 'OPEN' ? 'IN_PROGRESS' : ticket.status === 'IN_PROGRESS' ? 'RESOLVED' : ticket.status);
    setAdminResponse(ticket.adminResponse || '');
    setReplyModalOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!selectedTicket) return;
    try {
      await updateTicketStatus({
        id: selectedTicket.id,
        data: { status: replyStatus, adminResponse: adminResponse || null },
      }).unwrap();
      showToast('Ticket updated successfully', 'success');
      setReplyModalOpen(false);
      setSelectedTicket(null);
      setAdminResponse('');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update ticket.', 'error');
    }
  };

  // ─── Style Helpers ────────────────────────────────────────────────────────

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeStyle = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-600 ring-1 ring-gray-400/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-400/20';
    }
  };

  const getStatusDotStyle = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-amber-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'RESOLVED':
        return 'bg-emerald-500';
      case 'CLOSED':
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBadgeStyle = (priority: TicketPriority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20';
      case 'NORMAL':
        return 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20';
      case 'LOW':
        return 'bg-gray-50 text-gray-600 ring-1 ring-gray-400/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-400/20';
    }
  };

  const getPriorityDotStyle = (priority: TicketPriority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'NORMAL':
        return 'bg-sky-500';
      case 'LOW':
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };

  // ─── Valid status transitions for admin ────────────────────────────────────
  const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
    OPEN: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    IN_PROGRESS: ['RESOLVED', 'CLOSED'],
    RESOLVED: ['CLOSED'],
    CLOSED: [],
  };

  return (
    <div style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            title="Go Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Support Tickets</h1>
            <p className="text-sm text-gray-500 mt-0.5">Review and manage customer support tickets.</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.textLight }}
            />
            <input
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-4 focus:ring-pink-100 bg-white"
              style={{ borderColor: COLORS.border }}
              placeholder="Search by ticket ID, subject, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-48">
            <select
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white appearance-none cursor-pointer"
              style={{ borderColor: COLORS.border }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as TicketStatus | '');
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {/* Priority Filter */}
          <div className="relative w-full sm:w-48">
            <select
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white appearance-none cursor-pointer"
              style={{ borderColor: COLORS.border }}
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as TicketPriority | '');
                setPage(1);
              }}
            >
              <option value="">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border shadow-sm p-16 flex flex-col items-center justify-center" style={{ borderColor: COLORS.border }}>
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Loading tickets...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-1">Error Loading Tickets</h3>
          <p className="text-red-700 text-sm mb-4">{(error as any)?.data?.message || 'Failed to connect to ticket APIs.'}</p>
          <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Ticket Number</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Subject</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell text-gray-500">Customer</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Priority</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden md:table-cell text-gray-500">Date</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                      {/* Ticket Number */}
                      <td className="px-5 py-4 font-bold text-sm text-gray-900">{ticket.ticketNumber}</td>

                      {/* Subject (truncated) */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="font-medium text-sm text-gray-900 truncate">{ticket.subject}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{ticket.message}</p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="font-bold text-sm text-gray-900">{ticket.customer?.name || '—'}</p>
                        <p className="text-xs mt-0.5 text-gray-500">{ticket.customer?.email || ''}</p>
                      </td>

                      {/* Priority Badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityBadgeStyle(ticket.priority)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getPriorityDotStyle(ticket.priority)}`} />
                          {ticket.priority}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                        {formatDate(ticket.createdAt)}
                      </td>

                      {/* Status (dropdown) */}
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleQuickStatusChange(ticket.id, e.target.value as TicketStatus)}
                            disabled={isUpdating || VALID_TRANSITIONS[ticket.status].length === 0}
                            className={`appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border-0 transition-all hover:ring-2 focus:ring-2 focus:ring-pink-500/20 disabled:cursor-not-allowed disabled:opacity-80 ${getStatusBadgeStyle(ticket.status)}`}
                          >
                            <option value={ticket.status}>{ticket.status.replace('_', ' ')}</option>
                            {VALID_TRANSITIONS[ticket.status]?.map((opt) => (
                              <option key={opt} value={opt} className="text-gray-900 bg-white font-semibold">
                                {opt.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                          {VALID_TRANSITIONS[ticket.status].length > 0 && (
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
                            onClick={() => openReplyModal(ticket)}
                            title="Reply / View Details"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-pink-500"
                        style={{ backgroundColor: COLORS.primary + '12' }}
                      >
                        <MessageSquare size={28} />
                      </div>
                      <p className="font-bold text-base mb-1">No tickets found</p>
                      <p className="text-xs mb-4 text-gray-500">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-150">
              <span className="text-xs text-gray-500 font-semibold">
                Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} tickets total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!pagination.hasPreviousPage}
                  className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={!pagination.hasNextPage}
                  className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-bold disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Reply / Detail Modal ────────────────────────────────────────────── */}
      <Modal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)} title="Ticket Details">
        {selectedTicket && (
          <div className="space-y-5">
            {/* Ticket meta */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{selectedTicket.ticketNumber}</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityBadgeStyle(selectedTicket.priority)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getPriorityDotStyle(selectedTicket.priority)}`} />
                {selectedTicket.priority}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(selectedTicket.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotStyle(selectedTicket.status)}`} />
                {selectedTicket.status.replace('_', ' ')}
              </span>
            </div>

            {/* Customer Info */}
            {selectedTicket.customer && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Customer</p>
                <p className="font-bold text-sm">{selectedTicket.customer.name}</p>
                <p className="text-xs text-gray-500">{selectedTicket.customer.email}{selectedTicket.customer.phone ? ` · ${selectedTicket.customer.phone}` : ''}</p>
              </div>
            )}

            {/* Subject & Message */}
            <div>
              <p className="font-bold text-sm mb-1">{selectedTicket.subject}</p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
            </div>

            {/* Attachment */}
            {selectedTicket.attachments && (
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Attachment</p>
                <a
                  href={selectedTicket.attachments}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pink-600 hover:underline break-all"
                >
                  {selectedTicket.attachments}
                </a>
              </div>
            )}

            {/* Previous Admin Response */}
            {selectedTicket.adminResponse && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Previous Admin Response</p>
                <p className="text-sm text-emerald-800 whitespace-pre-wrap">{selectedTicket.adminResponse}</p>
              </div>
            )}

            <hr className="border-gray-200" />

            {/* Admin Reply Form */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Update Status</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white appearance-none cursor-pointer"
                style={{ borderColor: COLORS.border }}
                value={replyStatus}
                onChange={(e) => setReplyStatus(e.target.value as TicketStatus)}
              >
                <option value={selectedTicket.status}>{selectedTicket.status.replace('_', ' ')} (current)</option>
                {VALID_TRANSITIONS[selectedTicket.status]?.map((opt) => (
                  <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Admin Response</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-4 focus:ring-pink-100 bg-white resize-none"
                style={{ borderColor: COLORS.border }}
                rows={4}
                placeholder="Write your response to the customer..."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" size="sm" onClick={() => setReplyModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitReply}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save & Update'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

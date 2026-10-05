import type { Pagination } from './Product.type';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

// ─── Models ─────────────────────────────────────────────────────────────────

export interface TicketCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface SupportTicket {
  id: number;
  ticketNumber: string;
  userId: number;
  subject: string;
  message: string;
  priority: TicketPriority;
  status: TicketStatus;
  adminResponse: string | null;
  attachments: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: TicketCustomer;
}

// ─── Request Types ──────────────────────────────────────────────────────────

export interface CreateTicketRequest {
  subject: string;
  message: string;
  priority?: TicketPriority;
  attachments?: string | null;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
  adminResponse?: string | null;
}

// ─── Query Param Types ──────────────────────────────────────────────────────

export interface TicketListQueryParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
}

export interface AdminTicketListQueryParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
}

// ─── Response Types ─────────────────────────────────────────────────────────

export interface TicketListResponse {
  success: boolean;
  data: SupportTicket[];
  pagination: Pagination;
}

export interface TicketDetailResponse {
  success: boolean;
  data: SupportTicket;
}

export interface TicketMutationResponse {
  success: boolean;
  message: string;
  data: SupportTicket;
}

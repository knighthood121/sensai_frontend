import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  TicketListResponse,
  TicketDetailResponse,
  TicketMutationResponse,
  AdminTicketListQueryParams,
  UpdateTicketStatusRequest,
} from '../types/Ticket.type';

export const adminTicketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTickets: builder.query<TicketListResponse, AdminTicketListQueryParams | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: ENDPOINTS.adminTickets.base,
          params: params.toString() ? params : undefined,
        };
      },
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'AdminTicket' as const, id })),
              { type: 'AdminTicket', id: 'LIST' },
            ]
          : [{ type: 'AdminTicket', id: 'LIST' }],
    }),

    getAdminTicketById: builder.query<TicketDetailResponse, number>({
      query: (id) => ENDPOINTS.adminTickets.byId(id),
      providesTags: (_result, _error, id) => [{ type: 'AdminTicket', id }],
    }),

    updateTicketStatus: builder.mutation<
      TicketMutationResponse,
      { id: number; data: UpdateTicketStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: ENDPOINTS.adminTickets.byId(id),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminTicket', id },
        { type: 'AdminTicket', id: 'LIST' },
        'Ticket',
      ],
    }),
  }),
});

export const {
  useGetAdminTicketsQuery,
  useLazyGetAdminTicketsQuery,
  useGetAdminTicketByIdQuery,
  useLazyGetAdminTicketByIdQuery,
  useUpdateTicketStatusMutation,
} = adminTicketApi;

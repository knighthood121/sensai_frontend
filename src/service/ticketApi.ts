import { api } from './api';
import { ENDPOINTS } from '../constant/urls';
import type {
  TicketListResponse,
  TicketDetailResponse,
  TicketMutationResponse,
  TicketListQueryParams,
  CreateTicketRequest,
} from '../types/Ticket.type';

export const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<TicketMutationResponse, CreateTicketRequest>({
      query: (body) => ({
        url: ENDPOINTS.tickets.base,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    getTickets: builder.query<TicketListResponse, TicketListQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.append(key, String(value));
            }
          });
        }
        return {
          url: ENDPOINTS.tickets.base,
          params: searchParams.toString() ? searchParams : undefined,
        };
      },
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Ticket' as const, id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    getTicketById: builder.query<TicketDetailResponse, number>({
      query: (id) => ENDPOINTS.tickets.byId(id),
      providesTags: (_result, _error, id) => [{ type: 'Ticket', id }],
    }),

    closeTicket: builder.mutation<TicketMutationResponse, number>({
      query: (id) => ({
        url: ENDPOINTS.tickets.close(id),
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateTicketMutation,
  useGetTicketsQuery,
  useLazyGetTicketsQuery,
  useGetTicketByIdQuery,
  useLazyGetTicketByIdQuery,
  useCloseTicketMutation,
} = ticketApi;

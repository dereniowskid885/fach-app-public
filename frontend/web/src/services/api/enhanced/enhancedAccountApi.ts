import { accountApi } from '../generated/accountApi';

export const enhancedAccountApi = accountApi.enhanceEndpoints({
  addTagTypes: ['Ticket'],
  endpoints: {
    getTicketsById: {
      providesTags: (_result, error, { id }) => (error ? [] : [{ type: 'Ticket', id }])
    },
    getTicketsByIdEvaluations: {
      providesTags: (_result, error, { id }) => (error ? [] : [{ type: 'Ticket', id }])
    },
    postTicketsByIdPayment: {
      invalidatesTags: []
    },
    patchTicketsById: {
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [{ type: 'Ticket', id }, { type: 'Ticketing' }]
    },
    patchTicketsByIdAcceptEvaluation: {
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [{ type: 'Ticket', id }, { type: 'Ticketing' }]
    },
    postTicketsByIdComments: {
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [{ type: 'Ticket', id }, { type: 'Ticketing' }, { type: 'Comments' }]
    }
  }
});

export const { usePostTicketsByIdPaymentMutation } = enhancedAccountApi;

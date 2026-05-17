import { accountApi } from '../generated/accountApi';

export const enhancedAccountApi = accountApi.enhanceEndpoints({
  endpoints: {
    postTicketsByIdPayment: {
      invalidatesTags: []
    },
    patchTicketsById: {
      invalidatesTags: (result, error) => (error ? [] : ['Ticketing'])
    }
  }
});

export const { usePostTicketsByIdPaymentMutation } = enhancedAccountApi;

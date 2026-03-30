import { accountApi } from '../generated/accountApi';

export const enhancedAccountApi = accountApi.enhanceEndpoints({
  endpoints: {
    postTicketsByIdPayment: {
      invalidatesTags: []
    }
  }
});

export const { usePostTicketsByIdPaymentMutation } = enhancedAccountApi;

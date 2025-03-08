import { authApi } from '@/api/authApi';
import { ticketingApi } from '@/api/ticketingApi';
import { configureStore } from '@reduxjs/toolkit';
import userDataSlice from './slices/UserDataSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [ticketingApi.reducerPath]: ticketingApi.reducer,
      userDataSlice
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(authApi.middleware).concat(ticketingApi.middleware)
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

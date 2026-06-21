import { accountApi } from '@/services/api/generated/accountApi';
import { configureStore } from '@reduxjs/toolkit';
import userDataSlice from './slices/userSlice';
import notificationSlice from './slices/notificationSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [accountApi.reducerPath]: accountApi.reducer,
      userDataSlice,
      notificationSlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(accountApi.middleware)
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

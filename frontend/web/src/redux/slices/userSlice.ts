import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GetAuthMeApiResponse, ThemeType } from '@/services/api/generated/accountApi';

const initialState = {
  user: {
    userId: '',
    categoryId: '',
    categoryName: '',
    email: '',
    role: '',
    city: '',
    name: '',
    surname: '',
    fullName: '',
    theme: ''
  },
  isLoading: true,
  isInitialized: false
};

const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<GetAuthMeApiResponse['data'] | null>) {
      if (!action.payload) return;

      const {
        _id = '',
        email = '',
        role = '',
        category,
        name = '',
        surname = '',
        city = '',
        theme = ''
      } = action.payload;

      state.user = {
        userId: _id,
        categoryId: category?._id ?? '',
        categoryName: category?.name ?? '',
        email,
        role,
        city,
        name,
        surname,
        fullName: `${name} ${surname}`,
        theme
      };

      state.isLoading = false;
      state.isInitialized = true;
    },
    setUserTheme(state, action: PayloadAction<ThemeType | null>) {
      if (!action.payload) return;

      state.user = {
        ...state.user,
        theme: action.payload
      };

      state.isLoading = false;
      state.isInitialized = true;
    },
    clearUserData(state) {
      state.user = initialState.user;
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

// selectors
const selectSelf = (state: RootState) => state.userDataSlice;
const selectUserData = createSelector(selectSelf, state => ({
  ...state.user,
  isLoading: state.isLoading,
  isInitialized: state.isInitialized
}));

export const { setUserData, setUserTheme, clearUserData, setUserLoading } = userSlice.actions;
export { selectUserData };
export default userSlice.reducer;

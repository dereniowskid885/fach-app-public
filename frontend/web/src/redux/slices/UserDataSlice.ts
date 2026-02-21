import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GetUsersMeApiResponse, ThemeType } from '@/api/accountApi';

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
  }
};

const userData = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<GetUsersMeApiResponse['data'] | null>) {
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
    },
    setUserTheme(state, action: PayloadAction<ThemeType | null>) {
      if (!action.payload) return;

      state.user = {
        ...state.user,
        theme: action.payload
      };
    },
    clearUserData(state) {
      state.user = initialState.user;
    }
  }
});

// selectors
const selectSelf = (state: RootState) => state.userDataSlice;
const selectUserData = createSelector(selectSelf, state => state.user);

export const { setUserData, setUserTheme, clearUserData } = userData.actions;
export { selectUserData };
export default userData.reducer;

import { ITokenPayload } from '@/constants/interfaces';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
  user: {
    userId: '',
    categoryId: '',
    email: '',
    role: '',
    city: '',
    name: '',
    surname: '',
    fullName: ''
  }
};

const userData = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<ITokenPayload | null>) {
      if (!action.payload) return;
      state.user = action.payload;
    },
    clearUserData(state) {
      state.user = initialState.user;
    }
  }
});

// selectors
const selectSelf = (state: RootState) => state.userDataSlice;
const selectUserData = createSelector(selectSelf, state => state.user);

export const { setUserData, clearUserData } = userData.actions;
export { selectUserData };
export default userData.reducer;

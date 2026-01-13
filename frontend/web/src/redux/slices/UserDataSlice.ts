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
    }
  }
});

// selectors
const selectSelf = (state: RootState) => state.userDataSlice;
const selectUserData = createSelector(selectSelf, state => state.user);

export const { setUserData } = userData.actions;
export { selectUserData };
export default userData.reducer;

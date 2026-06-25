import { GetNotificationsApiResponse } from '@/services/api/generated/accountApi';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/services/api/generated/accountApi';
import { RootState } from '../store';

interface INotificationState {
  notifications: Notification[];
  isDotIconShown: boolean;
}

const initialState: INotificationState = {
  notifications: [],
  isDotIconShown: false
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<GetNotificationsApiResponse | null>) => {
      if (!action.payload) return;

      const { data = [] } = action.payload;

      state.notifications = data;
      state.isDotIconShown = data.length > 0;
    },
    addNotification: (state, action: PayloadAction<Notification | null>) => {
      if (!action.payload) return;

      state.notifications.unshift(action.payload);
      state.isDotIconShown = true;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
      state.isDotIconShown = state.notifications.length > 0;
    },
    deleteAllNotifications: state => {
      state.notifications = [];
      state.isDotIconShown = false;
    },
    hideDotIcon: state => {
      state.isDotIconShown = false;
    }
  }
});

// selectors
const selectSelf = (state: RootState) => state.notificationSlice;
const selectNotificationData = createSelector(selectSelf, state => ({
  ...state
}));

export const {
  setNotifications,
  addNotification,
  deleteNotification,
  deleteAllNotifications,
  hideDotIcon
} = notificationSlice.actions;
export { selectNotificationData };
export default notificationSlice.reducer;

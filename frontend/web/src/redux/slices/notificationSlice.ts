import { GetNotificationsApiResponse } from '@/services/api/generated/accountApi';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/services/api/generated/accountApi';
import { RootState } from '../store';

interface INotificationState {
  notifications: Notification[];
  unreadCount: number;
  isDotIconShown: boolean;
}

const initialState: INotificationState = {
  notifications: [],
  unreadCount: 0,
  isDotIconShown: false
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<GetNotificationsApiResponse | null>) => {
      if (!action.payload) return;

      const { data = [], unreadCount = 0 } = action.payload;

      state.notifications = data;
      state.unreadCount = unreadCount;
      state.isDotIconShown = unreadCount > 0;
    },
    addNotification: (state, action: PayloadAction<Notification | null>) => {
      if (!action.payload) return;

      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
      state.isDotIconShown = true;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
      state.unreadCount = Math.max(state.unreadCount - 1, 0);
      state.isDotIconShown = state.unreadCount > 0;
    },
    deleteAllNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
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

import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import listingsSlice from '../features/listings/listingsSlice';
import bookingsSlice from '../features/bookings/bookingsSlice';
import notificationsSlice from '../features/notifications/notificationsSlice';
import chatSlice from '../features/chat/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        listings: listingsSlice,
        bookings: bookingsSlice,
        notifications: notificationsSlice,
        chat: chatSlice,
    },
});

export default store;

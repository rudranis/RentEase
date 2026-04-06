import { createSlice } from '@reduxjs/toolkit';

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
        myBookingsAsRenter: [],
        myBookingsAsOwner: [],
        selectedBooking: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        setMyBookingsAsRenter: (state, action) => {
            state.myBookingsAsRenter = action.payload;
        },
        setMyBookingsAsOwner: (state, action) => {
            state.myBookingsAsOwner = action.payload;
        },
        setSelectedBooking: (state, action) => {
            state.selectedBooking = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateBookingStatus: (state, action) => {
            const { bookingId, status } = action.payload;
            const booking = state.myBookingsAsOwner.find(b => b._id === bookingId);
            if (booking) booking.status = status;
        },
    },
});

export const {
    setMyBookingsAsRenter,
    setMyBookingsAsOwner,
    setSelectedBooking,
    setIsLoading,
    setError,
    updateBookingStatus,
} = bookingsSlice.actions;
export default bookingsSlice.reducer;

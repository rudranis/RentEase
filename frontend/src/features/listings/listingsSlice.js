import { createSlice } from '@reduxjs/toolkit';

const listingsSlice = createSlice({
    name: 'listings',
    initialState: {
        listings: [],
        selectedListing: null,
        filters: {
            category: '',
            city: '',
            minPrice: 0,
            maxPrice: Infinity,
            deliveryAvailable: false,
            search: '',
        },
        pagination: {
            page: 1,
            limit: 12,
            total: 0,
        },
        isLoading: false,
        error: null,
    },
    reducers: {
        setListings: (state, action) => {
            state.listings = action.payload;
        },
        setSelectedListing: (state, action) => {
            state.selectedListing = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1;
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setListings,
    setSelectedListing,
    setFilters,
    setPagination,
    setIsLoading,
    setError,
} = listingsSlice.actions;
export default listingsSlice.reducer;

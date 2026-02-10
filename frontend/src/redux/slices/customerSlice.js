import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customers: [],
    loading: false,
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setCustomers: (state, action) => {
            state.customers = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setCustomers, setLoading } = customerSlice.actions;
export default customerSlice.reducer;

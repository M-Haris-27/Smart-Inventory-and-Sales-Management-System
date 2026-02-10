import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sales: [],
    loading: false,
};

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        setSales: (state, action) => {
            state.sales = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setSales, setLoading } = salesSlice.actions;
export default salesSlice.reducer;

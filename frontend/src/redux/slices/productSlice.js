import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    loading: false,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setProducts, setLoading } = productSlice.actions;
export default productSlice.reducer;

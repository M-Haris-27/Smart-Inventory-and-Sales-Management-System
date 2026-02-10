import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import customerReducer from './slices/customerSlice';
import salesReducer from './slices/salesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        customers: customerReducer,
        sales: salesReducer,
    },
});

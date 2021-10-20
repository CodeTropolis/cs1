import { configureStore } from "@reduxjs/toolkit";
import customerReducer from './features/customerSlice'

export const store = configureStore({
    // In reducer, create slices of state i.e. users, customers, etc.
    reducer: {
        customer: customerReducer,
    }

})


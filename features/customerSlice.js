import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        picFromCam: {},
        customer: {}
    }
}

export const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        addCustomerImage: (state, action) => {
            // console.log(`@CodeTropolis ~ action`, action);
            state.value.picFromCam = action.payload;
        },
        editCustomer: (state, action) => {
            console.log(`@CT ~ file: customerSlice.js ~ line 19 ~ action`, action.payload);
            state.value.customerData = action.payload;
        }
    }
})

export const { addCustomerImage, editCustomer } = customerSlice.actions

export default customerSlice.reducer;
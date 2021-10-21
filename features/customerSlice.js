import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    value: {
        // id: '',
        // image: '',
    }
}

export const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        addCustomerImage: (state, action) => {
            console.log(`@CodeTropolis ~ action`, action);
            state.value.image = action.payload;
        }
    }
})

export const { addCustomerImage } = customerSlice.actions

export default customerSlice.reducer;
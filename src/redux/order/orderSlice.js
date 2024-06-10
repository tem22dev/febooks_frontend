import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    carts: [],
    sumPrice: 0,
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts;
            let sumPrice = 0;
            const item = action.payload;

            let isExistIndex = carts.findIndex((c) => c.id === item.id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.quantity;
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantityAvailable) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantityAvailable;
                }
            } else {
                carts.push({ quantity: item.quantity, id: item.id, detail: item.detail });
            }
            state.carts = carts;
            carts?.forEach((item) => {
                sumPrice += item.quantity * item.detail.price;
            });
            state.sumPrice = sumPrice;
            message.success('Sản phẩm đã được thêm vô giỏ hàng');
        },

        doUpdateCartAction: (state, action) => {
            let carts = state.carts;
            let sumPrice = 0;
            const item = action.payload;

            let isExistIndex = carts.findIndex((c) => c.id === item.id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = item.quantity;
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantityAvailable) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantityAvailable;
                }
            } else {
                carts.push({ quantity: item.quantity, id: item.id, detail: item.detail });
            }
            state.carts = carts;
            carts?.forEach((item) => {
                sumPrice += item.quantity * item.detail.price;
            });
            state.sumPrice = sumPrice;
        },

        doDeleteItemCartAction: (state, action) => {
            let sumPrice = 0;
            state.carts = state.carts.filter((c) => c.id !== action.payload.id);
            state.carts?.forEach((item) => {
                sumPrice += item.quantity * item.detail.price;
            });
            state.sumPrice = sumPrice;
        },

        doPlaceOrderAction: (state, action) => {
            state.carts = [];
            state.sumPrice = 0;
        },
    },
});

export const { doAddBookAction, doUpdateCartAction, doDeleteItemCartAction, doPlaceOrderAction } = orderSlice.actions;
export default orderSlice.reducer;

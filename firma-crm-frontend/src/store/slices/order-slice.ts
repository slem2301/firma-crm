import { createSlice } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { OrderStatus, OrderType } from "../../models/IOrder";
import orderService from "../../services/order-service";

type OrderState = {
    types: OrderType[];
    statuses: OrderStatus[];
};

const initialState: OrderState = {
    types: [],
    statuses: [],
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        addCase(getAllOrderTypes.fulfilled, (state, action) => {
            state.types = action.payload;
        });
        addCase(getStatuses.fulfilled, (state, action) => {
            state.statuses = action.payload;
        });
    },
});

export const getAllOrderTypes = createRequest<OrderType[], undefined>(
    "order/get-all-types",
    async () => {
        const response = await orderService.getOrderTypes();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export const getStatuses = createRequest<OrderStatus[], undefined>(
    "order/get-statuses",
    async () => {
        const response = await orderService.getStatuses();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default orderSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { IPriceVersion } from "../../models/IPriceVersion";
import priceService from "../../services/price-service";

type PriceState = {
    versions: IPriceVersion[];
};

const initialState: PriceState = {
    versions: [],
};

const priceSlice = createSlice({
    name: "price",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        addCase(getPriceVersions.fulfilled, (state, action) => {
            state.versions = action.payload;
        });
    },
});

export const getPriceVersions = createRequest<IPriceVersion[], undefined>(
    "price/get-versions",
    async () => {
        const response = await priceService.getVersions();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default priceSlice.reducer;

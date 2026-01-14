import { createSlice } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { ICurrency } from "../../models/ICurrency";
import currencyService from "../../services/currency-service";

type CurrencyState = {
    currencies: ICurrency[];
};

const initialState: CurrencyState = {
    currencies: [],
};

const CurrencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        addCase(getAllCurrencies.fulfilled, (state, action) => {
            state.currencies = action.payload;
        });
    },
});

export const getAllCurrencies = createRequest<ICurrency[], undefined>(
    "currency/get-all",
    async () => {
        const response = await currencyService.getAll();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default CurrencySlice.reducer;

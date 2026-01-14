import { createSlice } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { BalanceLimits, IAd } from "../../models/IAd";
import adService from "../../services/ad-service";

type AdState = {
    ads: IAd[];
    loading: boolean;
    balanceLimits: BalanceLimits;
};

const initialState: AdState = {
    ads: [],
    loading: false,
    balanceLimits: {},
};

const adSlice = createSlice({
    name: "ad",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        addCase(getAllAds.pending, (state) => {
            state.loading = true;
        });
        addCase(getAllAds.fulfilled, (state, action) => {
            state.ads = action.payload;
            state.loading = false;
        });
        addCase(getBalanceLimits.fulfilled, (state, action) => {
            state.balanceLimits = action.payload;
        });
    },
});

export const getAllAds = createRequest<IAd[], undefined>(
    "ad/get-all",
    async () => {
        const response = await adService.getAll();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export const getBalanceLimits = createRequest<BalanceLimits, undefined>(
    "ad/limits",
    async () => {
        const response = await adService.getLimits();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default adSlice.reducer;

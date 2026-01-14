import { createSlice } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { IMask } from "../../models/IMask";
import maskService from "../../services/mask-service";

type MaskState = {
    masks: IMask[] | null;
    loading: boolean;
};

const initialState: MaskState = {
    masks: null,
    loading: false,
};

const maskSlice = createSlice({
    name: "mask",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        addCase(getAllMasks.fulfilled, (state, action) => {
            state.masks = action.payload;
            state.loading = false;
        });
        addCase(getAllMasks.pending, (state) => {
            state.loading = true;
        });
    },
});

export const getAllMasks = createRequest<IMask[], undefined>(
    "mask/get-all",
    async () => {
        const response = await maskService.getAll();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default maskSlice.reducer;

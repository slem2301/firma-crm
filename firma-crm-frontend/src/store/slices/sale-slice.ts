import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type saleState = {
    addSaleData: { [key: string]: string };
};

const initialState: saleState = {
    addSaleData: {},
};

const saleSlice = createSlice({
    name: "sale",
    initialState,
    reducers: {
        clearAddSaleData(state) {
            state.addSaleData = {};
        },
        setSaleData(
            state,
            action: PayloadAction<{ key: string; value: string }>
        ) {
            state.addSaleData[action.payload.key] = action.payload.value;
        },
        setBulcSaleData(
            state,
            action: PayloadAction<{ [key: string]: string }>
        ) {
            state.addSaleData = action.payload;
        },
    },
});

export const { clearAddSaleData, setBulcSaleData, setSaleData } =
    saleSlice.actions;

export default saleSlice.reducer;

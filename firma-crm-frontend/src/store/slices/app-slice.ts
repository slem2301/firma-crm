import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCurrentPeriod } from "../../utils/getCurrentPeriod";

interface AppState {
    period: {
        from: Date;
        to: Date;
    };
    title: string;
}

const initialState: AppState = {
    period: { from: getCurrentPeriod()[0], to: getCurrentPeriod()[1] },
    title: "",
};

export const AppSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setPeriod(state, action: PayloadAction<[Date, Date]>) {
            state.period = {
                from: action.payload[0],
                to: action.payload[1],
            };
        },
        setTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
        },
    },
});

export const { setPeriod, setTitle } = AppSlice.actions;

export default AppSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_POST } from "../../const/http-codes";
import { ICommonStatisticks, IStatisticks } from "../../models/IStatisticks";
import statisticksService, {
    getCommonStatisticksBody,
} from "../../services/statisticks-service";

interface StatisticksState {
    loading: boolean;
    commonLoading: boolean;
    projectsLoading: boolean;
    statisticks: IStatisticks | null;
    commonStatistick: ICommonStatisticks;
    addedExpense: number[];
}

const initialState: StatisticksState = {
    loading: true,
    statisticks: null,
    commonStatistick: {
        requests: {
            calls: 0,
            total: 0,
            yandex: 0,
            other: 0,
            google: 0,
        },
        expenses: {
            expense: 0,
            requestCost: 0,
            orderCost: 0,
            earn: 0,
            supposed: 0,
        },
        orders: {
            zakaz: 0,
            total: 0,
            pred: 0,
            povtor: 0,
        },
    },
    commonLoading: true,
    projectsLoading: true,
    addedExpense: [],
};

export const statisticksSlice = createSlice({
    name: "statisticks",
    initialState,
    reducers: {
        addExpense: (state, action: PayloadAction<number>) => {
            state.addedExpense.push(action.payload);
        },
    },
    extraReducers: ({ addCase }) => {
        // Common Get
        addCase(getCommonStatisticks.pending, (state) => {
            state.commonLoading = true;
        });
        addCase(getCommonStatisticks.fulfilled, (state, action) => {
            state.commonStatistick = action.payload;
            state.commonLoading = false;
        });
        addCase(getCommonStatisticks.rejected, (state) => {
            state.commonLoading = false;
        });
    },
});

export const { addExpense } = statisticksSlice.actions;

export const statisticksReducer = statisticksSlice.reducer;

export const getCommonStatisticks = createAsyncThunk(
    "stat/getCommon",
    async (body: getCommonStatisticksBody, thunkAPI) => {
        try {
            return await statisticksService.getCommon(body); // тут уже data
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

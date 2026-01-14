import { createSlice } from "@reduxjs/toolkit";
import { ChatOptionsScheme } from "../types/chatOptions";
import { fetchDefaultOptions } from "../services/fetchDefaultOptions";
import { fetchProjectOptions } from "../services/fetchProjectOptions";
import { rejectHandler } from "../../../../../axios";
import { NOT_FOUND } from "../../../../../const/http-codes";
import { updateProjectOptions } from "../services/updateProjectOptions";

const initialState: ChatOptionsScheme = {
    defaultOptions: {
        data: null,
        loading: false,
    },
    projectOptions: {
        data: null,
        loading: false,
    },
};

const chatOptionsSlice = createSlice({
    name: "chatOptions",
    initialState,
    reducers: {
        clearOptions(state) {
            state.projectOptions.data = null;
            state.infoMessage = undefined;
            state.errorMessage = undefined;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchDefaultOptions.pending, (state) => {
                state.defaultOptions.loading = true;
            })
            .addCase(fetchDefaultOptions.fulfilled, (state, action) => {
                state.defaultOptions.data = action.payload;
                if (!state.projectOptions.data)
                    state.projectOptions.data = action.payload;
                state.defaultOptions.loading = false;
            })
            .addCase(
                fetchDefaultOptions.rejected,
                rejectHandler((state, action) => {
                    state.errorMessage = action.payload.message;
                    state.defaultOptions.loading = false;
                })
            )
            .addCase(fetchProjectOptions.pending, (state) => {
                state.projectOptions.loading = true;
            })
            .addCase(fetchProjectOptions.fulfilled, (state, action) => {
                state.projectOptions.data = action.payload;
                state.projectOptions.loading = false;
            })
            .addCase(
                fetchProjectOptions.rejected,
                rejectHandler((state, action) => {
                    if (action.payload.status === NOT_FOUND) {
                        state.infoMessage = "Настройки не созданы";
                        if (state.defaultOptions.data) {
                            state.projectOptions.data =
                                state.defaultOptions.data;
                        }
                    } else {
                        state.errorMessage = action.payload.message;
                    }
                    state.projectOptions.loading = false;
                })
            )
            .addCase(updateProjectOptions.pending, (state) => {
                state.projectOptions.loading = true;
            })
            .addCase(updateProjectOptions.fulfilled, (state, action) => {
                state.projectOptions.data = action.payload;
                state.projectOptions.loading = false;
            }),
});

export const { actions: chatOptionsActions, reducer: chatOptionsReducer } =
    chatOptionsSlice;

import { createSlice } from "@reduxjs/toolkit";
import { SUCCESS_GET, SUCCESS_POST } from "../../const/http-codes";
import { IBlacklist } from "../../models/IBlacklist";
import { createRequest, rejectHandler } from "../../axios";
import blacklistService from "../../services/blacklist-service";

interface BlacklistState {
    phones: IBlacklist[];
    loading: boolean;
    errorMessage: string;
}

const initialState: BlacklistState = {
    phones: [],
    loading: true,
    errorMessage: "",
};

export const BlacklistSlice = createSlice({
    name: "blacklist",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        // getAll
        addCase(getAllBlockedPhones.pending, (state) => {
            state.loading = true;
        });
        addCase(getAllBlockedPhones.fulfilled, (state, action) => {
            state.phones = action.payload;
            state.loading = false;
        });
        addCase(
            getAllBlockedPhones.rejected,
            rejectHandler((state) => {
                state.loading = false;
            })
        );
        // Add
        addCase(addPhoneToBlacklist.pending, (state) => {
            state.loading = true;
            state.errorMessage = "";
        });
        addCase(addPhoneToBlacklist.fulfilled, (state) => {
            state.loading = false;
        });
        addCase(
            addPhoneToBlacklist.rejected,
            rejectHandler((state, action) => {
                state.loading = false;
                state.errorMessage = action.payload.message;
            })
        );
        // Delete
        addCase(deletePhoneFromBlacklist.pending, (state) => {
            state.loading = true;
            state.errorMessage = "";
        });
        addCase(deletePhoneFromBlacklist.fulfilled, (state) => {
            state.loading = false;
        });
        addCase(
            deletePhoneFromBlacklist.rejected,
            rejectHandler((state, action) => {
                state.loading = false;
                state.errorMessage = action.payload.message;
            })
        );
    },
});

export default BlacklistSlice.reducer;

export const getAllBlockedPhones = createRequest<IBlacklist[], string>(
    "blacklist/get",
    async (search) => {
        const response = await blacklistService.getAll(search);

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export const addPhoneToBlacklist = createRequest<
    IBlacklist,
    { phone: string; reason: string }
>("blacklist/add", async (data) => {
    const response = await blacklistService.create(data);

    if (response.status === SUCCESS_POST) return response.data;
});

export const deletePhoneFromBlacklist = createRequest<string, number>(
    "blacklist/delete",
    async (id) => {
        await blacklistService.delete(id);
    }
);

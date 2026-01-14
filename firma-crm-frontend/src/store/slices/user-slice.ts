import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { IUser } from "../../models/IUser";
import UserService from "../../services/user-service";

export interface UserState {
    user: IUser | null;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    loading: true,
};

export const getUserByToken = createRequest<IUser, void>(
    "user/getByToken",
    async () => {
        const response = await UserService().getByToken();

        if (response.status === SUCCESS_GET && response.data) {
            const data: any = response.data;
            return data.user ?? data; // ✅ вот это ключ
        }

        throw new Error("User not loaded");
    }
);



export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUser | null>) {
            state.user = action.payload;
        },
    },
    extraReducers: ({ addCase }) => {
        addCase(getUserByToken.pending, (state) => {
            state.loading = true;
        });

        addCase(getUserByToken.fulfilled, (state, action) => {
            state.user = action.payload ?? null;
            state.loading = false; // ✅ важно
        });

        addCase(getUserByToken.rejected, (state) => {
            state.user = null;
            state.loading = false; // ✅ важно
        });
    },
});



export const { setUser } = UserSlice.actions;


export default UserSlice.reducer;

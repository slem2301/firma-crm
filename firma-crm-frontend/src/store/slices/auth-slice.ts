import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createRequest, rejectHandler } from "../../axios";
import { SUCCESS_POST } from "../../const/http-codes";
import AuthService, {
    loginDto,
    loginResponse,
} from "../../services/auth-service";
import { setUser } from "./user-slice";

export interface AuthState {
    auth: boolean;
    loading: boolean;
    responseError: string | null;
}

const initialState: AuthState = {
    auth: true,
    loading: false,
    responseError: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.auth = false;
        },
        auth(state) {
            state.auth = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.responseError = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            // console.log(action.payload);
            localStorage.setItem("token", action.payload.accessToken);
            localStorage.setItem("auth_id", action.payload.refreshToken);
            state.loading = false;
            state.auth = true;
        });
        builder.addCase(
            login.rejected,
            rejectHandler((state, action) => {
                state.loading = false;
                state.responseError = action.payload?.message;
            })
        );
    },
});

export const { auth } = authSlice.actions;

export default authSlice.reducer;

export const logout = createAsyncThunk("auth/logout", (data, { dispatch }) => {
    dispatch(authSlice.actions.logout());
    dispatch(setUser(null));
});

export const login = createRequest<loginResponse, loginDto>(
    "auth/login",
    async (data) => {
        const response = await AuthService().login(data);

        if (response.status === SUCCESS_POST) return response.data;
    }
);

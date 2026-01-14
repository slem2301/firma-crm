import {
    AnyAction,
    createAsyncThunk,
    Store,
    ThunkDispatch,
} from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { UNAUTHORIZED } from "../const/http-codes";
import { logout } from "../store/slices/auth-slice";
import { RootState } from "../store/store";

export const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: `${API_URL}`,
});

export interface ResponseError {
    message: string;
    status: number;
}

const requests: { [key: string]: AbortController } = {};

const addRequest = (url: string, controller: AbortController) => {
    requests[url] = controller;
};

const removeRequest = (url: string) => {
    delete requests[url];
};

export const initInterceptors = (store: Store<RootState>) => {
    api.interceptors.request.use((config: AxiosRequestConfig) => {
        if (config.headers) {
            const accessToken = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("auth_id");
            config.headers.Authorization = `Bearer ${accessToken}`;
            config.headers.AuthId = refreshToken || "";
        }

        return config;
    });

    api.interceptors.response.use(
        (config: AxiosRequestConfig) => {
            if (config.headers?.newTokens) {
                const [acessToken, refreshToken] = config.headers.newTokens
                    .toString()
                    .split(";");
                localStorage.setItem("token", acessToken);
                localStorage.setItem("auth_id", refreshToken);
            }

            return config;
        },
        (error: AxiosError) => {
            if (error.response?.status === UNAUTHORIZED) {
                localStorage.removeItem("token");
                localStorage.removeItem("auth_id");
                store.dispatch(logout() as any);
            }

            return Promise.reject(error);
        }
    );

    api.interceptors.request.use((config: AxiosRequestConfig) => {
        const url = getUrlFromConfig(config);
        const controller = new AbortController();

        if (requests[url]) {
            requests[url].abort();
        }

        config.signal = controller.signal;
        addRequest(url, controller);

        return config;
    });

    api.interceptors.response.use(
        (response: AxiosResponse) => {
            removeRequest(getUrlFromConfig(response.config));
            return response;
        },
        (error: AxiosError) => {
            removeRequest(getUrlFromConfig(error.config));
            return Promise.reject(error);
        }
    );
};

const getUrlFromConfig = (config: AxiosRequestConfig) => {
    if (config?.url) return config.url;

    return "";
};

type ThunkApiConfig = {
    rejectValue: ResponseError | "ABORT";
};

type CreateRequestOptionsType = {
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>;
};

export function createRequest<ResponseType, RequestData>(
    name: string,
    request: (data: RequestData, options: CreateRequestOptionsType) => any
) {
    return createAsyncThunk<ResponseType, RequestData, ThunkApiConfig>(
        name,
        async (data, { rejectWithValue, dispatch }) => {
            try {
                return await request(data, { dispatch });
            } catch (e) {
                const error = e as AxiosError<ResponseError>;
                if (error.response)
                    return rejectWithValue({
                        message: error.response.data.message,
                        status: error.response.status,
                    });

                return rejectWithValue("ABORT");
            }
        }
    );
}

export function rejectHandler<State>(cb: (state: State, action: any) => void) {
    return (state: State, action: any) => {
        if (action.payload === "ABORT") return;

        cb(state, action);
    };
}

export const isApiError = (e: unknown) => e instanceof AxiosError;

export const isError = (
    payload?: ResponseError | "ABORT" | void
): payload is ResponseError => {
    return (
        typeof payload === "object" &&
        "status" in payload &&
        "message" in payload
    );
};

export default api;

export const SUCCESS_GET = 200;
export const SUCCESS_POST = 201;
export const UNAUTHORIZED = 401;
export const SUCCESS_PUT = 200;
export const SUCCESS_DELETE = 200;
export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;

export type FetchStatus =
    | "LOADING"
    | "RELOADING"
    | "ERROR"
    | "SUCCESS"
    | "IDLE";

export const FETCH_STATUS: Record<FetchStatus, FetchStatus> = {
    LOADING: "LOADING",
    RELOADING: "RELOADING",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS",
    IDLE: "IDLE",
};

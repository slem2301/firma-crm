import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { IRequest } from "../../models/IRequest";
import requestService, {
    getRequestsFilters,
} from "../../services/request-service";

interface RequestState {
    loading: boolean;
    requests: IRequest[];
    pagination: {
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
    checked: number[];
}

const initialState: RequestState = {
    loading: false,
    requests: [],
    pagination: {
        totalPages: 1,
        total: 0,
        hasMore: false,
    },
    checked: [],
};

export const RequestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        setRequests: (state, action: PayloadAction<IRequest[]>) => {
            state.requests = action.payload;
        },
        addToChecked: (state, action: PayloadAction<number>) => {
            state.checked.push(action.payload);
        },
        removeFromChecked: (state, action: PayloadAction<number>) => {
            state.checked = state.checked.filter((id) => id !== action.payload);
        },
        setChecked: (state, action: PayloadAction<number[]>) => {
            state.checked = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getByProjectId
        builder.addCase(getRequestsByProjectId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getRequestsByProjectId.fulfilled, (state, action) => {
            state.requests = action.payload.requests;
            state.pagination = {
                total: action.payload.total,
                totalPages: action.payload.totalPages,
                hasMore: action.payload.hasMore,
            };
            state.loading = false;
        });
    },
});

export const { setRequests, setChecked, removeFromChecked, addToChecked } =
    RequestSlice.actions;

export const getRequestsByProjectId = createRequest<
    {
        requests: IRequest[];
        total: number;
        totalPages: number;
        hasMore: boolean;
    },
    {
        projectId: number;
        filters: getRequestsFilters;
    }
>("request/get-by-project-id", async ({ projectId, filters }) => {
    const response = await requestService.getByProjectId(projectId, filters);

    return response.data;
});

export default RequestSlice.reducer;

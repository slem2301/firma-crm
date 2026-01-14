import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { IPhone } from "../../models/IPhone";
import phoneService from "../../services/phone-service";

type PhoneState = {
    phones: IPhone[] | null;
    loading: boolean;
    checkedPhone: string;
};

const initialState: PhoneState = {
    phones: null,
    loading: false,
    checkedPhone: "",
};

const phoneSlice = createSlice({
    name: "phone",
    initialState,
    reducers: {
        setPhones: (state, action: PayloadAction<IPhone[]>) => {
            state.phones = action.payload;
        },
        setCheckedPhone: (state, action: PayloadAction<string>) => {
            state.checkedPhone = action.payload;
        },
    },
    extraReducers: ({ addCase }) => {
        addCase(getAllPhones.fulfilled, (state, action) => {
            state.phones = action.payload;
            state.loading = false;
        });
        addCase(getAllPhones.pending, (state) => {
            state.loading = true;
        });
    },
});

export const getAllPhones = createRequest<IPhone[], undefined>(
    "phone/get-all",
    async () => {
        const response = await phoneService.getAll();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default phoneSlice.reducer;

export const { setPhones, setCheckedPhone } = phoneSlice.actions;

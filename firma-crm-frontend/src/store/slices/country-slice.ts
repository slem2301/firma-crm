import { createSlice } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { ICountry } from "../../models/ICountry";
import countryService from "../../services/country-service";

type CountryState = {
    countries: ICountry[];
};

const initialState: CountryState = {
    countries: [],
};

const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        addCase(getAllCountries.fulfilled, (state, action) => {
            state.countries = action.payload;
        });
    },
});

export const getAllCountries = createRequest<ICountry[], undefined>(
    "country/get-all",
    async () => {
        const response = await countryService.getAll();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default countrySlice.reducer;

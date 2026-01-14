import { createSlice } from "@reduxjs/toolkit";
import { createRequest } from "../../axios";
import { SUCCESS_GET } from "../../const/http-codes";
import { IProduct } from "../../models/IProduct";
import productService from "../../services/product-service";

type ProductState = {
    products: IProduct[];
};

const initialState: ProductState = {
    products: [],
};

const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: ({ addCase }) => {
        addCase(getAllProducts.fulfilled, (state, action) => {
            state.products = action.payload;
        });
    },
});

export const getAllProducts = createRequest<IProduct[], undefined>(
    "product/get-all",
    async () => {
        const response = await productService.getAll();

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export default ProductSlice.reducer;

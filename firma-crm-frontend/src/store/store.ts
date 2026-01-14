import { configureStore } from "@reduxjs/toolkit";
import adSlice from "./slices/ad-slice";
import appSlice from "./slices/app-slice";
import authSlice from "./slices/auth-slice";
import BlacklistSlice from "./slices/blacklist-slice";
import countrySlice from "./slices/country-slice";
import currencySlice from "./slices/currency-slice";
import maskSlice from "./slices/mask-slice";
import orderSlice from "./slices/order-slice";
import phoneSlice from "./slices/phone-slice";
import priceSlice from "./slices/price-slice";
import productSlice from "./slices/product-slice";
import ProjectSlice from "./slices/project-slice";
import RequestSlice from "./slices/request-slice";
import saleSlice from "./slices/sale-slice";
import { statisticksReducer } from "./slices/statisticks-slice";
import UserSlice from "./slices/user-slice";
import { chatOptionsReducer } from "../pages/project/chat";
import { quizOptionsReducer } from "../pages/project/quiz";

export const store = configureStore({
    reducer: {
        blacklist: BlacklistSlice,
        auth: authSlice,
        user: UserSlice,
        project: ProjectSlice,
        request: RequestSlice,
        app: appSlice,
        stat: statisticksReducer,
        currency: currencySlice,
        product: productSlice,
        country: countrySlice,
        ad: adSlice,
        order: orderSlice,
        sale: saleSlice,
        price: priceSlice,
        phone: phoneSlice,
        mask: maskSlice,
        chatOptions: chatOptionsReducer,
        quizOptions: quizOptionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});


if (process.env.NODE_ENV === "development") {
    (window as any).store = store;
}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

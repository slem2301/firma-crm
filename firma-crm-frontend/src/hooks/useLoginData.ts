import { useCallback } from "react";
import orderService from "../services/order-service";
import { getAllCountries } from "../store/slices/country-slice";
import { getAllCurrencies } from "../store/slices/currency-slice";
import { getAllOrderTypes, getStatuses } from "../store/slices/order-slice";
import { getPriceVersions } from "../store/slices/price-slice";
import { getAllProducts } from "../store/slices/product-slice";
import { store } from "../store/store";
import { useAppDispatch } from "./redux";
import { ROLES, userHasRoles } from "./useRoles";
import { getBalanceLimits } from "../store/slices/ad-slice";

export const checkSessionId = async () => {
    const user = store.getState().user.user;

    if (user && userHasRoles(user, [ROLES.ADMIN, ROLES.MANAGER])) {
        try {
            await orderService.checkKey();
        } catch (e) {
            return false;
        }
    }

    return true;
};

export const useLoginData = () => {
    const dispatch = useAppDispatch();

    const loadAppData = useCallback(async () => {
        await dispatch(getAllCurrencies());
        await dispatch(getAllCountries());
        await dispatch(getAllProducts());
        await dispatch(getAllOrderTypes());
        await dispatch(getStatuses());
        await dispatch(getPriceVersions());
        await dispatch(getBalanceLimits());
    }, [dispatch]);

    return loadAppData;
};

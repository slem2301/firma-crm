import { RootState } from "../../../store/store";

export const getSelectedRegions = (regionIds: number[]) => (state: RootState) =>
    regionIds.length === state.country.countries.length
        ? null
        : state.country.countries.filter((country) =>
              regionIds.includes(country.id)
          );

export const getSelectedProductTypes =
    (productTypeIds: number[]) => (state: RootState) =>
        productTypeIds.length === state.product.products.length
            ? null
            : state.product.products.filter((product) =>
                  productTypeIds.includes(product.id)
              );

export const getSelectedOrderTypes =
    (orderTypeIds: number[]) => (state: RootState) =>
        orderTypeIds.length === state.order.types.length
            ? null
            : state.order.types.filter((orderType) =>
                  orderTypeIds.includes(orderType.id)
              );

export const getSelectedOrderStatuses =
    (statusIds: number[]) => (state: RootState) =>
        statusIds.length === state.order.statuses.length
            ? null
            : state.order.statuses.filter((status) =>
                  statusIds.includes(status.id)
              );

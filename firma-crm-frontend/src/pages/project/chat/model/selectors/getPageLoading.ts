import { RootState } from "../../../../../store/store";

export const getPageLoading = (state: RootState) => {
    const { defaultOptions, projectOptions } = state.chatOptions;

    const dataNotLoaded = !defaultOptions.data || !projectOptions.data;

    return dataNotLoaded || defaultOptions.loading || projectOptions.loading;
};

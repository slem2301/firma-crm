import { RootState } from "../../../../../store/store";

export const getDefaultData = (state: RootState) =>
    state.chatOptions.defaultOptions.data;

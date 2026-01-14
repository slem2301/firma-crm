import { RootState } from "../../../../../store/store";

export const getErrorMessage = (state: RootState) =>
    state.chatOptions.errorMessage;

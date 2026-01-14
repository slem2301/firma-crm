import { RootState } from "../../../../../store/store";

export const getInfoMessage = (state: RootState) =>
    state.chatOptions.infoMessage;

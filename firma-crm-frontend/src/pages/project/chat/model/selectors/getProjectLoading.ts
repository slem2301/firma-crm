import { RootState } from "../../../../../store/store";

export const getProjectLoading = (state: RootState) =>
    state.chatOptions.projectOptions.loading;

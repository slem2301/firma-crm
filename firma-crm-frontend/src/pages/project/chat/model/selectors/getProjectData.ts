import { RootState } from "../../../../../store/store";

export const getProjectData = (state: RootState) =>
    state.chatOptions.projectOptions.data;

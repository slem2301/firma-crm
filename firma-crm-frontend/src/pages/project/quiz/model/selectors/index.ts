import {
    ApiFormOptions,
    ApiQuizOptions,
    Question,
    ClientQuizProps,
} from "firma-crm-quiz/dist/quiz/types";
import { RootState } from "../../../../../store/store";

export const getQuizOptions = (state: RootState) => state.quizOptions.options;

export const getQuizCommonInfo = (state: RootState) =>
    state.quizOptions.options?.quiz as NonNullable<ApiQuizOptions>;

export const getFormCommonInfo = (state: RootState) =>
    state.quizOptions.options?.form as NonNullable<ApiFormOptions>;

export const getCommonInfo = (state: RootState) =>
    state.quizOptions.options as NonNullable<ClientQuizProps>;

export const getQuizLoading = (state: RootState) => state.quizOptions.isLoading;

export const getPageLoading = (state: RootState) =>
    state.quizOptions.quizOptionsLoading;

export const getMode = (state: RootState) => state.quizOptions.mode;

export const getQuestions = (state: RootState) =>
    state.quizOptions.options?.quiz?.questions as Question[];

export const getTemplate = (state: RootState) => state.quizOptions.template;

export const getEnabled = (state: RootState) => state.quizOptions.enabled;

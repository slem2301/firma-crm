import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type ClientQuizProps, type DefaultQuizProps } from "firma-crm-quiz";
import {
    AnswerImage,
    AnswerText,
    AnswerType,
    ApiFormOptions,
    ApiQuizOptions,
    defaultProps,
} from "firma-crm-quiz/dist/web";
import { fetchProjectQuizOptions } from "../services/fetchProjectQuizOptions";
import { QuizSettingsMode, QuizTemplate } from "../types/mode";
import { getEmptyQuizOptions } from "../services/getEmptyQuizOptions";
import { createProjectQuizOptions } from "../services/createProjectQuizOptions";
import { deleteProjectQuizOptions } from "../services/deleteProjectQuizOptions";

export interface QuizOptionsScheme {
    isLoading: boolean;
    quizOptionsLoading: boolean;
    options: ClientQuizProps | null;
    defaultOptions: DefaultQuizProps;
    template: QuizTemplate | null;
    mode: QuizSettingsMode;
    enabled: boolean;
}

const initialState: QuizOptionsScheme = {
    isLoading: false,
    quizOptionsLoading: true,
    template: null,
    options: null,
    defaultOptions: defaultProps,
    mode: "none",
    enabled: true,
};

const quizOptionsSlice = createSlice({
    name: "quizOptions",
    initialState,
    reducers: {
        clearOptions(state) {
            state.isLoading = false;
            state.options = null;
            state.quizOptionsLoading = false;
            state.mode = "none";
            state.enabled = true;
        },
        changeMode(state, action: PayloadAction<QuizSettingsMode>) {
            state.mode = action.payload;

            if (action.payload === "creating") {
                if (state.template) state.options = state.template.settings;
                else state.options = getEmptyQuizOptions(state.defaultOptions);
                state.enabled = true;
            }
        },
        changeQuestionTitle(
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) {
            if (state.options?.quiz?.questions[action.payload.index]) {
                state.options.quiz.questions[action.payload.index].title =
                    action.payload.value;
            }
        },
        changeQuestionType(
            state,
            action: PayloadAction<{ index: number; value: AnswerType }>
        ) {
            if (state.options?.quiz?.questions[action.payload.index]) {
                state.options.quiz.questions[action.payload.index].type =
                    action.payload.value;
            }
        },
        changeTemplate(state, action: PayloadAction<QuizTemplate | null>) {
            state.template = action.payload;
        },
        addEmptyQuestion(state) {
            state.options?.quiz?.questions.push({
                title: "",
                type: AnswerType.TEXT,
                answers: [
                    {
                        label: "",
                    },
                ],
            });
        },
        addEmptyAnswer(state, action: PayloadAction<number>) {
            state.options?.quiz?.questions[action.payload].answers.push({
                label: "",
                image: "",
            });
        },
        changeTextAnswer(
            state,
            action: PayloadAction<{
                questionIndex: number;
                answerIndex: number;
                data: AnswerText;
            }>
        ) {
            const {
                payload: { questionIndex, answerIndex, data },
            } = action;
            const answer = state.options?.quiz?.questions[questionIndex]
                .answers[answerIndex] as AnswerText;
            if (answer) {
                answer.label = data.label;
            }
        },
        changeImageAnswer(
            state,
            action: PayloadAction<{
                questionIndex: number;
                answerIndex: number;
                data: AnswerImage;
            }>
        ) {
            const {
                payload: { questionIndex, answerIndex, data },
            } = action;
            const answer = state.options?.quiz?.questions[questionIndex]
                .answers[answerIndex] as AnswerImage;
            if (answer) {
                answer.image = data.image;
                answer.label = data.label;
            }
        },
        deleteAnswer(
            state,
            action: PayloadAction<{
                questionIndex: number;
                answerIndex: number;
            }>
        ) {
            const {
                payload: { questionIndex, answerIndex },
            } = action;
            state.options?.quiz?.questions[questionIndex].answers.splice(
                answerIndex,
                1
            );
        },
        deleteQuestion(state, action: PayloadAction<number>) {
            state.options?.quiz?.questions.splice(action.payload, 1);
        },
        moveQuestion(
            state,
            action: PayloadAction<{
                selectedIndex: number;
                step: number;
            }>
        ) {
            const questions = state.options?.quiz?.questions;
            if (questions && questions.length > 1) {
                const { selectedIndex, step } = action.payload;
                const [selected] = questions.splice(selectedIndex, 1);
                questions.splice(selectedIndex + step, 0, selected);
            }
        },
        changeQuizCommonInfo(
            state,
            action: PayloadAction<Omit<ApiQuizOptions, "questions">>
        ) {
            if (state.options?.quiz) {
                state.options.quiz = {
                    ...state.options?.quiz,
                    ...action.payload,
                };
            }
        },
        changeFormCommonInfo(state, action: PayloadAction<ApiFormOptions>) {
            if (state.options?.form) {
                state.options.form = {
                    ...state.options?.form,
                    ...action.payload,
                };
            }
        },
        changeThemeColor(state, action: PayloadAction<string>) {
            state.options!.themeColor = action.payload;
        },
        changeAutoshowDelay(state, action: PayloadAction<number>) {
            state.options!.autoShowDelay = action.payload;
        },
        changeMobilePosition(state, action: PayloadAction<number>) {
            state.options!.mobilePosition = action.payload;
        },
        cancelCreating(state) {
            state.mode = "none";
            state.options = null;
        },
        toggleEnabled(state) {
            state.enabled = !state.enabled;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjectQuizOptions.pending, (state, action) => {
            state.quizOptionsLoading = true;
        });
        builder.addCase(fetchProjectQuizOptions.fulfilled, (state, action) => {
            if (action.payload) {
                state.options = action.payload.settings;
                state.enabled = action.payload.options.enabled;
                state.mode = "editing";
            } else {
                state.options = null;
            }
            state.quizOptionsLoading = false;
        });
        builder.addCase(fetchProjectQuizOptions.rejected, (state, action) => {
            state.quizOptionsLoading = false;
        });
        builder.addCase(createProjectQuizOptions.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(createProjectQuizOptions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.mode = "editing";
        });
        builder.addCase(createProjectQuizOptions.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(deleteProjectQuizOptions.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(deleteProjectQuizOptions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.mode = "none";
            state.options = null;
        });
        builder.addCase(deleteProjectQuizOptions.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});

export const { actions: quizOptionsActions, reducer: quizOptionsReducer } =
    quizOptionsSlice;

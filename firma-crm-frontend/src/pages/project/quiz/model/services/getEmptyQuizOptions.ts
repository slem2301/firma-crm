import type { ClientQuizProps, Full, DefaultQuizProps } from "firma-crm-quiz";
import { AnswerType } from "firma-crm-quiz/dist/web";

export const getEmptyQuizOptions = (
    defaultProps: DefaultQuizProps
): Full<ClientQuizProps> => {
    return {
        themeColor: defaultProps.themeColor,
        autoShowDelay: defaultProps.autoShowDelay,
        mobilePosition: defaultProps.mobilePosition,
        quiz: {
            ...defaultProps.quiz,
            questions: [
                {
                    type: AnswerType.TEXT,
                    title: "",
                    answers: [
                        {
                            label: "",
                        },
                    ],
                },
            ],
        },
        form: {
            ...defaultProps.form,
        },
    };
};

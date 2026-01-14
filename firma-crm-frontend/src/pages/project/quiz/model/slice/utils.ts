import { Full, ClientQuizProps } from "firma-crm-quiz";
import { Question } from "firma-crm-quiz/dist/quiz/types";
import { AnswerType, AnswerImage } from "firma-crm-quiz/dist/web";

export const validateOptions = (options: Full<ClientQuizProps>): string[] => {
    const errors: string[] = [];

    if (!options.themeColor) errors.push("Укажите цветовую тему квиза.");

    if (!options.form.button) errors.push("Укажите название для кнопки формы.");

    if (!options.form.title) errors.push("Укажите заголовок формы.");

    if (!options.form.subtitle) errors.push("Укажите подзаголовок формы.");

    if (!options.quiz.button) errors.push("Укажите название для кнопки квиза.");

    if (!options.quiz.title) errors.push("Укажите заголовок для квиза.");

    if (!options.quiz.formTitle)
        errors.push("Укажите заголовок для формы квиза.");

    errors.push(...validateQuestions(options.quiz.questions));

    return errors;
};

const validateQuestions = (questions: Question[]) => {
    const errors: string[] = [];

    questions.forEach((question, questionIndex) => {
        if (!question.title) {
            errors.push(`Укажите название для вопроса ${questionIndex + 1}.`);
        }

        if (!question.answers.length) {
            errors.push(
                `В вопросе ${
                    questionIndex + 1
                } должен быть как минимум один ответ.`
            );
        }

        question.answers.forEach((answer, answerIndex) => {
            if (!answer.label) {
                errors.push(
                    `В вопросе ${questionIndex + 1} у ответа ${
                        answerIndex + 1
                    } должно быть название. `
                );
            }

            if (question.type === AnswerType.IMAGE) {
                const typedAnswer = answer as AnswerImage;

                if (!typedAnswer.image)
                    errors.push(
                        `В вопросе ${questionIndex + 1} у ответа ${
                            answerIndex + 1
                        } должна быть картинка. `
                    );
            }
        });
    });

    return errors;
};

export const prepareQuestions = (options: ClientQuizProps): ClientQuizProps => {
    return {
        ...options,
        quiz: {
            ...options.quiz,
            questions: options.quiz!.questions.map((question) => {
                return {
                    ...question,
                    answers: question.answers.map((answer) => {
                        if (question.type === AnswerType.TEXT) {
                            return { label: answer.label };
                        }

                        return answer;
                    }),
                };
            }) as Question[],
        },
    };
};

import api, { createRequest } from "../../../../../axios";
import { SUCCESS_DELETE } from "../../../../../const/http-codes";

export const deleteProjectQuizOptions = createRequest<void, number>(
    "quizOptions/deleteOptions",
    async (projectId) => {
        const response = await api.delete(`/quiz-settings/${projectId}`);

        if (response.status === SUCCESS_DELETE) {
            return response.data;
        }
    }
);

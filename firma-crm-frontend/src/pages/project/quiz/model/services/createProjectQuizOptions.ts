import { ClientQuizProps } from "firma-crm-quiz";
import api, { createRequest } from "../../../../../axios";
import { SUCCESS_POST } from "../../../../../const/http-codes";

interface CreateProjectQuizOptionsData {
    projectId: number;
    props: ClientQuizProps;
    enabled: boolean;
}

export const createProjectQuizOptions = createRequest<
    void,
    CreateProjectQuizOptionsData
>("quizOptions/createOptions", async (data) => {
    const response = await api.post(`/quiz-settings`, data);

    if (response.status === SUCCESS_POST) {
        return response.data;
    }
});

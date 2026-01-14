import { ClientQuizProps } from "firma-crm-quiz";
import api, { createRequest } from "../../../../../axios";

interface FetchProjectQuizOptionsResponse {
    settings: ClientQuizProps | null;
    options: {
        enabled: boolean;
    };
}

export const fetchProjectQuizOptions = createRequest<
    FetchProjectQuizOptionsResponse | null,
    number
>("quizOptions/fetchProjectQuizOptions", async (projectId) => {
    const response = await api.get<FetchProjectQuizOptionsResponse>(
        `/quiz-settings/${projectId}`
    );

    if (response.status === 200) {
        return response.data;
    }
});

import api from "../../../../../axios";
import { SUCCESS_GET } from "../../../../../const/http-codes";
import { QuizTemplate } from "../types/mode";

export const fetchProjectQuizTemplates = async (
    search: string
): Promise<QuizTemplate[]> => {
    try {
        const response = await api.get<QuizTemplate[]>(
            `/quiz-settings/templates?search=${search}`
        );

        if (response.status === SUCCESS_GET) {
            return response.data;
        }

        return [];
    } catch (e) {
        return [];
    }
};

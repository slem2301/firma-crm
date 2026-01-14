import api, { createRequest } from "../../../../../axios";
import { IChatOptions } from "../types/chatOptions";

export const fetchProjectOptions = createRequest<IChatOptions, number>(
    "chatOptions/fetchProjectOptions",
    async (projectId) => {
        const response = await api.get<IChatOptions>(
            `/chat-options/${projectId}`
        );

        return response.data;
    }
);

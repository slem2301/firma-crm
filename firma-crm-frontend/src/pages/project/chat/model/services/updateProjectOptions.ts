import api, { createRequest } from "../../../../../axios";
import { IChatOptions } from "../types/chatOptions";

export const updateProjectOptions = createRequest<IChatOptions, IChatOptions>(
    "chatOptions/updateProjectOptions",
    async (data) => {
        const response = await api.put("/chat-options/update", data);

        return response.data;
    }
);

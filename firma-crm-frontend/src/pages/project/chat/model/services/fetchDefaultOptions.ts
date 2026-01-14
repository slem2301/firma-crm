import api, { createRequest } from "../../../../../axios";
import { IChatOptions } from "../types/chatOptions";

export const fetchDefaultOptions = createRequest<IChatOptions, void>(
    "chatOptions/fetchDefaultOptions",
    async () => {
        const response = await api.get<IChatOptions>("/chat-options/default");

        return response.data;
    }
);

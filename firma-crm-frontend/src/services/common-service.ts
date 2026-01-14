import axios from "axios";
import { SUCCESS_GET } from "../const/http-codes";

type getTelegramBotInfoResponse = {
    status: "ok" | "error";
    data: string;
};

class CommonService {
    static async getTelegramBotInfo(
        token: string
    ): Promise<getTelegramBotInfoResponse | undefined> {
        try {
            const response = await axios.get(
                `https://api.telegram.org/bot${token}/getMe`
            );
            if (response.status === SUCCESS_GET)
                return {
                    status: "ok",
                    data: response.data.result.first_name,
                };
        } catch (e) {
            return {
                status: "error",
                data: "Неверный токен",
            };
        }
    }
}

export default CommonService;

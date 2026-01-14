import { Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/loader/Loader";
import Page from "../../components/ui/page/Page";
import { SUCCESS_GET, SUCCESS_PUT } from "../../const/http-codes";
import adService from "../../services/ad-service";

type TokenStatus =
    | "parsing"
    | "fetching"
    | "parsing-error"
    | "fetching-error"
    | "saving"
    | "saving-error";

const messages: Record<TokenStatus, string> = {
    parsing: "Обработка токена",
    "parsing-error": "Ошибка обработки токена.",
    fetching: "Получение аккаунта",
    "fetching-error": "Ошибка получения аккаунта. Попробуйте снова.",
    saving: "Сохранение токена",
    "saving-error": "Ошибка сохранения токена. Попробуйте снова.",
};

const AdGetToken = () => {
    const [status, setStatus] = useState<TokenStatus>("parsing");

    const isError =
        status === "fetching-error" ||
        status === "parsing-error" ||
        status === "saving-error";

    const navigate = useNavigate();

    const saveToken = useCallback(
        async (login: string, token: string) => {
            setStatus("saving");
            try {
                const response = await adService.saveToken(login, token);

                if (response.status !== SUCCESS_PUT) throw new Error();

                navigate(`/ad/${login}`);
            } catch (e) {
                setStatus("saving-error");
            }
        },
        [navigate]
    );

    const fetchAdByToken = useCallback(
        async (token: string) => {
            setStatus("fetching");
            try {
                const response = await axios.get(
                    `https://login.yandex.ru/info?format=json&oauth_token=${token}`
                );

                if (response.status !== SUCCESS_GET) throw new Error();

                saveToken(response.data.login, token);
            } catch (e) {
                setStatus("fetching-error");
            }
        },
        [saveToken]
    );

    const parseToken = () => {
        if (!document.location.hash) return setStatus("parsing-error");

        const match = /access_token=([^&]+)/.exec(document.location.hash);
        if (!match) return setStatus("parsing-error");

        const token = match[1];
        if (!token) return setStatus("parsing-error");

        return token;
    };

    useEffect(() => {
        const token = parseToken();
        if (token) fetchAdByToken(token);
    }, [fetchAdByToken]);

    return (
        <Page>
            <Loader hideSpinner={isError} permanent>
                <Text mb={4}>{messages[status]}</Text>
            </Loader>
        </Page>
    );
};

export default AdGetToken;

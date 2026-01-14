import { Button, Spinner, VStack, useBoolean } from "@chakra-ui/react";
import { AxiosError, CanceledError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
    FetchStatus,
    FETCH_STATUS,
    SUCCESS_DELETE,
    SUCCESS_GET,
    SUCCESS_PUT,
} from "../../../../../const/http-codes";
import useAppToast from "../../../../../hooks/useAppToast";
import { IProjectYandexSettings } from "../../../../../models/IProject";
import projectService from "../../../../../services/project-service";
import SettingsView, { SetSettingsStatus } from "./SettingsView";
import { FaPlus } from "react-icons/fa";

type YandexSettingsProps = {
    projectId: number;
};
const MODE = "yandex";
const MODE_NAME = "Яндекс";

const YandexSettings: React.FC<YandexSettingsProps> = ({ projectId }) => {
    const [status, setStatus] = useState<FetchStatus>(FETCH_STATUS.IDLE);
    const toast = useAppToast();

    const [createMode, setCreateMode] = useBoolean();
    const [currentConversion, setCurrentConversion] =
        useState<IProjectYandexSettings | null>(null);
    const [conversions, setConversions] = useState<IProjectYandexSettings[]>(
        []
    );

    const isLoading = status === "LOADING";

    const fetchConversions = useCallback(async () => {
        setStatus(FETCH_STATUS.LOADING);
        try {
            const response = await projectService.getYSettingsById(projectId);

            if (response.status === SUCCESS_GET) {
                setConversions(response.data || []);
                setStatus(FETCH_STATUS.SUCCESS);
            }
        } catch (e: any) {
            const error = e as AxiosError;
            if (error instanceof CanceledError) return;

            console.error(e.message);
            toast({
                text: "Ошибка загрузки настроек Яндекс конверсий",
                status: "error",
            });
            setStatus(FETCH_STATUS.ERROR);
        }
    }, [projectId, toast]);

    useEffect(() => {
        fetchConversions();
    }, [fetchConversions]);

    const handleUpdate = useCallback(
        async (
            item: IProjectYandexSettings,
            setStatus: SetSettingsStatus,
            onUpdated: (data: any) => void
        ) => {
            setStatus(FETCH_STATUS.RELOADING);
            try {
                const response = await projectService.updateYSettings(item);
                if (response.status === SUCCESS_PUT) {
                    toast({
                        text: `Настройки Яндекс успешно ${item.id === undefined ? "созданы" : "обновлены"
                            }`,
                    });
                    onUpdated(response.data);
                    setStatus(FETCH_STATUS.SUCCESS);
                }
            } catch (e) {
                toast({
                    status: "error",
                    text: "Ошибка операции!",
                });
                setStatus(FETCH_STATUS.ERROR);
            }
        },
        [toast]
    );

    const handleDelete = useCallback(
        async (id: number, setStatus: SetSettingsStatus) => {
            setStatus(FETCH_STATUS.RELOADING);
            try {
                const response = await projectService.deleteYSettingsById(id);

                if (response.status === SUCCESS_DELETE) {
                    toast({
                        text: `Настройки Яндекс успешно удалены`,
                    });
                    setStatus(FETCH_STATUS.SUCCESS);
                }
            } catch (e) {
                setStatus(FETCH_STATUS.ERROR);
            }
        },
        [toast]
    );

    const handleClickOnSettings = (item: IProjectYandexSettings) => () =>
        setCurrentConversion(item);

    const renderContent = () => {
        if (isLoading) return <Spinner display={"block"} my={10} mx="auto" />;

        if (createMode)
            return (
                <SettingsView<IProjectYandexSettings>
                    mode={MODE}
                    modeName={MODE_NAME}
                    projectId={projectId}
                    item={{
                        id: -1,
                        counterId: "" as any,
                        requestEvent: "",
                        callEvent: "",
                        projectId,
                    }}
                    deleteHandler={handleDelete}
                    updateHandler={handleUpdate}
                />
            );

        if (currentConversion)
            return (
                <SettingsView<IProjectYandexSettings>
                    mode={MODE}
                    modeName={MODE_NAME}
                    projectId={projectId}
                    item={currentConversion}
                    deleteHandler={handleDelete}
                    updateHandler={handleUpdate}
                />
            );

        return (
            <VStack align={"stretch"}>
                <Button
                    leftIcon={<FaPlus />}
                    colorScheme="green"
                    onClick={setCreateMode.on}
                >
                    Добавить Яндекс конверсию
                </Button>
                {conversions.map((settings) => (
                    <Button
                        key={settings.id}
                        onClick={handleClickOnSettings(settings)}
                    >
                        {settings.counterId}
                    </Button>
                ))}
            </VStack>
        );
    };

    return renderContent();
};

export default YandexSettings;

import { Button, Spinner, useBoolean, VStack } from "@chakra-ui/react";
import { AxiosError, CanceledError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    FetchStatus,
    FETCH_STATUS,
    SUCCESS_DELETE,
    SUCCESS_GET,
    SUCCESS_PUT,
} from "../../../../../const/http-codes";
import useAppToast from "../../../../../hooks/useAppToast";
import { IGoogleConversion } from "../../../../../models/IProject";
import projectService from "../../../../../services/project-service";
import SettingsView, { SetSettingsStatus } from "./SettingsView";

type GoogleSettingsProps = {
    projectId: number;
};

const MODE = "google";
const MODE_NAME = "Google";

const GoogleSettings: React.FC<GoogleSettingsProps> = ({ projectId }) => {
    const [status, setStatus] = useState<FetchStatus>(FETCH_STATUS.IDLE);
    const toast = useAppToast();

    const [createMode, setCreateMode] = useBoolean();
    const [currentSettings, setCurrentSettings] =
        useState<IGoogleConversion | null>(null);

    const [googleSettings, setGoogleSettings] = useState<IGoogleConversion[]>(
        []
    );

    const isLoading = status === "LOADING";

    const fetchGoogleSettings = useCallback(async () => {
        setStatus(FETCH_STATUS.LOADING);
        try {
            const response = await projectService.getGConversionById(projectId);

            if (response.status === SUCCESS_GET && response.data) {
                setGoogleSettings(response.data);
                setStatus(FETCH_STATUS.SUCCESS);
            }
        } catch (e: any) {
            const error = e as AxiosError;
            if (error instanceof CanceledError) return;

            console.error(e.message);
            toast({
                text: "Ошибка загрузки настроек Google конверсий",
                status: "error",
            });
            setStatus(FETCH_STATUS.ERROR);
        }
    }, [projectId, toast]);

    useEffect(() => {
        fetchGoogleSettings();
    }, [fetchGoogleSettings]);

    const handleClickOnSettings = (item: IGoogleConversion) => () =>
        setCurrentSettings(item);

    const handleUpdate = useCallback(
        async (
            item: IGoogleConversion,
            setStatus: SetSettingsStatus,
            onUpdated: (data: any) => void
        ) => {
            setStatus(FETCH_STATUS.RELOADING);
            try {
                const response = await projectService.updateGConversion(item);
                if (response.status === SUCCESS_PUT) {
                    toast({
                        text: `Настройки Google успешно ${item.id === undefined ? "созданы" : "обновлены"
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
            try {
                const response = await projectService.deleteGConversionById(id);

                if (response.status === SUCCESS_DELETE) {
                    toast({
                        text: `Настройки Google успешно удалены`,
                    });
                    setCurrentSettings(null);
                    fetchGoogleSettings();
                    setStatus(FETCH_STATUS.SUCCESS);
                }
            } catch (e) {
                setStatus(FETCH_STATUS.ERROR);
            }
        },
        [toast, fetchGoogleSettings]
    );

    const renderContent = () => {
        if (isLoading) return <Spinner display={"block"} my={10} mx="auto" />;

        if (createMode)
            return (
                <SettingsView<IGoogleConversion>
                    mode={MODE}
                    modeName={MODE_NAME}
                    projectId={projectId}
                    item={{
                        id: -1,
                        counterId: "",
                        requestEvent: "",
                        callEvent: "",
                        isAnalytics: false,
                        projectId,
                    }}
                    deleteHandler={handleDelete}
                    updateHandler={handleUpdate}
                />
            );

        if (currentSettings)
            return (
                <SettingsView<IGoogleConversion>
                    mode={MODE}
                    modeName={MODE_NAME}
                    projectId={projectId}
                    item={currentSettings}
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
                    Добавить настройки
                </Button>
                {googleSettings.map((settings) => (
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

export default GoogleSettings;

import { useCallback, useEffect, useId, useState } from "react";
import Loader from "../../../../components/ui/loader/Loader";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import {
    getEnabled,
    getMode,
    getPageLoading,
    getQuizLoading,
    getQuizOptions,
} from "../model/selectors";
import { QuizOptionsNotCreated } from "./QuizOptionsNotCreated";
import { quizOptionsActions } from "../model/slice/quizOptionsSlice";
import { fetchProjectQuizOptions } from "../model/services/fetchProjectQuizOptions";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Switch,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import { Questions } from "./question/Questions";
import { QuizCommonInfo } from "./quiz/QuizCommon";
import { FormCommonInfo } from "./form/FormCommon";
import useAppToast from "../../../../hooks/useAppToast";
import { CommonInfo } from "./CommonInfo";
import { prepareQuestions, validateOptions } from "../model/slice/utils";
import { ClientQuizProps, Full } from "firma-crm-quiz";
import { createProjectQuizOptions } from "../model/services/createProjectQuizOptions";
import ConfirmDialog from "../../../../components/confirmDialog/ConfirmDialog";
import { deleteProjectQuizOptions } from "../model/services/deleteProjectQuizOptions";
import { isError } from "../../../../axios";

interface QuizOptionsProps {
    projectId: number;
}

export const QuizOptions = ({ projectId }: QuizOptionsProps) => {
    const dispatch = useAppDispatch();

    const toast = useAppToast();

    const isLoading = useAppSelector(getQuizLoading);
    const quizOptions = useAppSelector(getQuizOptions);
    const pageLoading = useAppSelector(getPageLoading);
    const enabled = useAppSelector(getEnabled);
    const mode = useAppSelector(getMode);

    const switchId = useId();

    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const fetchOptions = useCallback(() => {
        dispatch(fetchProjectQuizOptions(projectId));
    }, [dispatch, projectId]);

    const handleSave = () => {
        if (!quizOptions) return;

        const errors = validateOptions(quizOptions as Full<ClientQuizProps>);

        if (errors.length) {
            return errors.forEach((message) => {
                toast({
                    status: "error",
                    text: message,
                    duration: 6000,
                });
            });
        }

        const data = {
            props: prepareQuestions(quizOptions),
            projectId,
            enabled,
        };

        dispatch(createProjectQuizOptions(data)).then((response) => {
            if (isError(response.payload)) {
                toast({
                    status: "error",
                    text: `${response.payload.status} ${response.payload.message}`,
                });
            } else {
                toast({
                    status: "success",
                    text:
                        mode === "creating"
                            ? "Сохранено успешно"
                            : "Обновлено успешно",
                });
            }
        });
    };

    const handleDelete = () => {
        dispatch(deleteProjectQuizOptions(projectId));
        setConfirmOpen(false);
    };

    const handleCancel = () => {
        dispatch(quizOptionsActions.cancelCreating());
    };

    const handleChangeEnabled = () =>
        dispatch(quizOptionsActions.toggleEnabled());

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    useEffect(() => {
        return () => {
            dispatch(quizOptionsActions.clearOptions());
        };
    }, [dispatch]);

    const renderTitle = () => {
        switch (mode) {
            case "creating":
                return "Создание квиза";
            case "editing":
                return "Редактирование квиза";
            default:
                return null;
        }
    };

    const renderButtonTitle = () => {
        switch (mode) {
            case "creating":
                return "Сохранить";
            case "editing":
                return "Обновить";
            default:
                return null;
        }
    };

    if (pageLoading) {
        return <Loader />;
    }

    if (quizOptions === null && mode === "none") {
        return <QuizOptionsNotCreated />;
    }

    return (
        <>
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onAccept={handleDelete}
                title="Удаление"
                text="Удалить квиз?"
                onCancel={() => setConfirmOpen(false)}
            />
            <Flex flexDirection={"column"} gap={1}>
                <Flex
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    gap={1}
                    position={"relative"}
                >
                    <FormControl
                        w="auto"
                        display="flex"
                        alignItems="center"
                        mr="auto"
                    >
                        <FormLabel htmlFor={switchId} mb={0}>
                            Включён
                        </FormLabel>
                        <Switch
                            id={switchId}
                            isChecked={enabled}
                            onChange={handleChangeEnabled}
                        />
                    </FormControl>
                    <Heading
                        flexGrow={1}
                        textAlign={"center"}
                        size="md"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                    >
                        {renderTitle()}
                    </Heading>
                    <Button
                        size="sm"
                        colorScheme="green"
                        onClick={handleSave}
                        isLoading={isLoading}
                    >
                        {renderButtonTitle()}
                    </Button>
                    {mode === "creating" && (
                        <Button
                            size="sm"
                            colorScheme="gray"
                            onClick={handleCancel}
                        >
                            Отмена
                        </Button>
                    )}
                    {mode === "editing" && (
                        <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => setConfirmOpen(true)}
                        >
                            Удалить квиз
                        </Button>
                    )}
                </Flex>
                <CommonInfo />
                <Tabs>
                    <TabList>
                        <Tab>Квиз</Tab>
                        <Tab>Форма</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel px={0}>
                            <QuizCommonInfo />
                            <Questions />
                        </TabPanel>
                        <TabPanel px={0}>
                            <FormCommonInfo />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </>
    );
};

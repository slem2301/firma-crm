import { Flex, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { getFormCommonInfo, getQuizLoading } from "../../model/selectors";
import { ApiFormOptions } from "firma-crm-quiz";
import { ChangeEvent } from "react";
import { quizOptionsActions } from "../../model/slice/quizOptionsSlice";

export const FormCommonInfo = () => {
    const dispatch = useAppDispatch();
    const { title, subtitle, button } = useAppSelector(getFormCommonInfo);
    const isLoading = useAppSelector(getQuizLoading);

    const getOnChange =
        (key: keyof Omit<ApiFormOptions, "questions">) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            dispatch(
                quizOptionsActions.changeFormCommonInfo({
                    title,
                    button,
                    subtitle,
                    [key]: e.currentTarget.value,
                })
            );
        };

    return (
        <Flex flexDir={"column"} gap={1} mb={2}>
            <FormLabel m={0}>Заголовок формы</FormLabel>
            <Input
                isDisabled={isLoading}
                value={title}
                onChange={getOnChange("title")}
            />
            <FormLabel m={0}>Подзаголовок формы</FormLabel>
            <Textarea
                isDisabled={isLoading}
                value={subtitle}
                onChange={getOnChange("subtitle")}
            />
            <FormLabel m={0}>Название кнопки</FormLabel>
            <Input
                isDisabled={isLoading}
                value={button}
                onChange={getOnChange("button")}
            />
        </Flex>
    );
};

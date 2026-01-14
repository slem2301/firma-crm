import {
    Flex,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { getCommonInfo, getQuizLoading } from "../model/selectors";
import { ChangeEvent } from "react";
import { quizOptionsActions } from "../model/slice/quizOptionsSlice";

export const CommonInfo = () => {
    const dispatch = useAppDispatch();
    const { autoShowDelay, themeColor, mobilePosition } =
        useAppSelector(getCommonInfo);
    const isLoading = useAppSelector(getQuizLoading);

    const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            quizOptionsActions.changeThemeColor(event.currentTarget.value)
        );
    };

    const onChangeAutoShowDelay = (value: string) => {
        dispatch(quizOptionsActions.changeAutoshowDelay(Number(value)));
    };

    const onChangeMobilePosition = (value: string) => {
        dispatch(quizOptionsActions.changeMobilePosition(Number(value)));
    };

    return (
        <Flex flexDirection={"column"} gap={1} w={300}>
            <FormLabel m={0}>Автопоявление через</FormLabel>
            <InputGroup size="sm">
                <InputLeftAddon>сек.</InputLeftAddon>
                <NumberInput
                    value={autoShowDelay}
                    min={0}
                    onChange={onChangeAutoShowDelay}
                    isDisabled={isLoading}
                >
                    <NumberInputField
                        borderTopLeftRadius={0}
                        borderBottomLeftRadius={0}
                    />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </InputGroup>
            <FormLabel m={0}>Цветовая тема</FormLabel>
            <InputGroup w={200} size="sm">
                <InputLeftElement>
                    <Input
                        isDisabled={isLoading}
                        borderRadius={0}
                        p={0}
                        value={themeColor}
                        type="color"
                        onChange={onChangeColor}
                        w="50px"
                        border={0}
                        pr={1}
                        cursor={"pointer"}
                    />
                </InputLeftElement>
                <Input
                    isDisabled={isLoading}
                    borderRadius={0}
                    value={themeColor}
                    onChange={onChangeColor}
                />
            </InputGroup>
            <FormLabel m={0}>Высота мобильной кнопки</FormLabel>
            <InputGroup size="sm">
                <InputLeftAddon>px.</InputLeftAddon>
                <NumberInput
                    value={mobilePosition}
                    min={0}
                    onChange={onChangeMobilePosition}
                    isDisabled={isLoading}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </InputGroup>
        </Flex>
    );
};

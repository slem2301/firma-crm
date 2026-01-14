import {
    Box,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";
import { BaseAnswerProps } from "./types";
import { AnswerImage as AnswerImageType } from "firma-crm-quiz";
import { FaFont, FaImage, FaTimes } from "react-icons/fa";
import { ChangeEvent } from "react";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { quizOptionsActions } from "../../../model/slice/quizOptionsSlice";

interface AnswerImageProps extends BaseAnswerProps {
    answer: AnswerImageType;
}

export const AnswerImage = (props: AnswerImageProps) => {
    const { answer, questionIndex, onDelete, index, isLoading } = props;
    const dispatch = useAppDispatch();

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) =>
        dispatch(
            quizOptionsActions.changeImageAnswer({
                questionIndex,
                answerIndex: index,
                data: {
                    label: answer.label,
                    image: e.target.value,
                },
            })
        );

    const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) =>
        dispatch(
            quizOptionsActions.changeImageAnswer({
                questionIndex,
                answerIndex: index,
                data: {
                    label: e.target.value,
                    image: answer.image,
                },
            })
        );

    return (
        <Flex
            gap={"10px"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            position={"relative"}
        >
            <IconButton
                size="sm"
                colorScheme="red"
                aria-label="delete"
                onClick={onDelete}
                position={"absolute"}
                zIndex={1}
                top="5px"
                right={"5px"}
                icon={<FaTimes />}
                isDisabled={isLoading}
            />
            <Box
                backgroundImage={`url(${
                    answer.image || "https://placehold.co/300"
                })`}
                backgroundPosition={"center"}
                backgroundSize="cover"
                flexGrow={1}
                h={"244px"}
            />
            <InputGroup size="sm">
                <InputLeftElement>
                    <FaImage />
                </InputLeftElement>
                <Input
                    isDisabled={isLoading}
                    placeholder="URL"
                    value={answer.image}
                    onChange={handleChangeImage}
                />
            </InputGroup>
            <InputGroup size="sm">
                <InputLeftElement>
                    <FaFont />
                </InputLeftElement>
                <Input
                    isDisabled={isLoading}
                    placeholder="Вопрос"
                    value={answer.label}
                    onChange={handleChangeLabel}
                />
            </InputGroup>
        </Flex>
    );
};

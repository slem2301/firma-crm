import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from "@chakra-ui/react";
import { BaseAnswerProps } from "./types";
import { AnswerText as AnswerTextType } from "firma-crm-quiz";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { quizOptionsActions } from "../../../model/slice/quizOptionsSlice";
import { ChangeEvent } from "react";
import { FaTimes } from "react-icons/fa";

interface AnswerTextProps extends BaseAnswerProps {
    answer: AnswerTextType;
}

export const AnswerText = (props: AnswerTextProps) => {
    const { index, answer, questionIndex, onDelete, isLoading } = props;
    const dispatch = useAppDispatch();

    const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            quizOptionsActions.changeTextAnswer({
                questionIndex,
                answerIndex: index,
                data: {
                    label: e.currentTarget.value,
                },
            })
        );
    };

    return (
        <div>
            <InputGroup w="100%">
                <InputLeftElement>{index + 1}</InputLeftElement>
                <Input
                    isDisabled={isLoading}
                    placeholder="Ответ"
                    value={answer.label}
                    onChange={handleChangeLabel}
                />
                <InputRightElement>
                    <IconButton
                        isDisabled={isLoading}
                        aria-label="delete"
                        icon={<FaTimes />}
                        colorScheme="red"
                        onClick={onDelete}
                    />
                </InputRightElement>
            </InputGroup>
        </div>
    );
};

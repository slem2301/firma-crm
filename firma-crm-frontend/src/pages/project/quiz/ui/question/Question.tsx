import {
    Box,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    VStack,
} from "@chakra-ui/react";
import { Question as QuestionType } from "firma-crm-quiz/dist/quiz/types";
import { AnswerType } from "firma-crm-quiz/dist/web";
import { useAppDispatch } from "../../../../../hooks/redux";
import { quizOptionsActions } from "../../model/slice/quizOptionsSlice";
import { ChangeEvent } from "react";
import { FaFont, FaImage } from "react-icons/fa";
import { Answers } from "./answer/Answers";

interface QuestionProps {
    question: QuestionType;
    index: number;
    isLoading: boolean;
}

const answerTypeOptions = Object.keys(AnswerType).map((type) => ({
    value: type,
    name: type,
}));

const getAnswerType = (value: string): AnswerType => {
    if (Object.keys(AnswerType).includes(value)) {
        return value as AnswerType;
    }

    return AnswerType.TEXT;
};

export const Question = (props: QuestionProps) => {
    const dispatch = useAppDispatch();
    const { question, index, isLoading } = props;

    const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) =>
        dispatch(
            quizOptionsActions.changeQuestionTitle({
                index,
                value: e.currentTarget.value,
            })
        );

    const handleChangeType = (e: ChangeEvent<HTMLSelectElement>) => {
        dispatch(
            quizOptionsActions.changeQuestionType({
                index,
                value: getAnswerType(e.currentTarget.value),
            })
        );
    };

    const renderIcon = () => {
        switch (question.type) {
            case AnswerType.TEXT:
                return <FaFont />;
            case AnswerType.IMAGE:
                return <FaImage />;
        }
    };

    return (
        <Box p={5} borderWidth={1} borderRadius={2} mt={3}>
            <VStack align={"flex-start"}>
                <HStack w="100%" justifyContent={"space-between"}>
                    <Select
                        width={150}
                        placeholder="Тип ответа"
                        value={question.type}
                        onChange={handleChangeType}
                        isDisabled={isLoading}
                    >
                        {answerTypeOptions.map((item) => (
                            <option value={item.value} key={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                    <InputGroup flexGrow={1}>
                        <InputLeftElement>{renderIcon()}</InputLeftElement>
                        <Input
                            isDisabled={isLoading}
                            onChange={handleChangeTitle}
                            value={question.title}
                            placeholder="Вопрос"
                        />
                    </InputGroup>
                </HStack>
                <Answers
                    isLoading={isLoading}
                    answers={question.answers}
                    type={question.type}
                    questionIndex={index}
                />
            </VStack>
        </Box>
    );
};

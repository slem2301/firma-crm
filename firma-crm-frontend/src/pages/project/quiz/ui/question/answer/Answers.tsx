import { Answer as TAnswer, AnswerType } from "firma-crm-quiz/dist/web";
import { FunctionComponent, useMemo } from "react";
import { AnswerText } from "./AnswerText";
import { AnswerImage } from "./AnswerImage";
import { BaseAnswerProps } from "./types";
import { Flex } from "@chakra-ui/react";
import { AddAnswer } from "./AddAnswer";
import styles from "./Answers.module.scss";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { quizOptionsActions } from "../../../model/slice/quizOptionsSlice";

interface AnswersProps<Type extends AnswerType> {
    type: Type;
    answers: TAnswer<Type>[];
    questionIndex: number;
    isLoading: boolean;
}

export const Answers = <Type extends AnswerType>(props: AnswersProps<Type>) => {
    const { answers, type, questionIndex, isLoading } = props;
    const dispatch = useAppDispatch();

    const getAnswerComponent = (): FunctionComponent<BaseAnswerProps> => {
        switch (type) {
            case AnswerType.TEXT:
                return AnswerText;
            case AnswerType.IMAGE:
                return AnswerImage as FunctionComponent<BaseAnswerProps>;
            default:
                return AnswerText;
        }
    };

    const handleDelete = (index: number) => () =>
        dispatch(
            quizOptionsActions.deleteAnswer({
                answerIndex: index,
                questionIndex,
            })
        );

    const AnswerComponent = getAnswerComponent();

    const className = useMemo(() => {
        const classes: string[] = [];

        if (type === AnswerType.TEXT) {
            classes.push(styles.withTextAnswers);
        }

        if (type === AnswerType.IMAGE) {
            classes.push(styles.withImageAnswers);
        }

        return classes.join(" ");
    }, [type]);

    return (
        <Flex
            py={5}
            className={className}
            w="100%"
            gap="20px"
            alignItems={"stretch"}
            flexWrap={"wrap"}
        >
            {answers.map((answer, index) => (
                <AnswerComponent
                    key={index}
                    index={index}
                    answer={answer}
                    questionIndex={questionIndex}
                    onDelete={handleDelete(index)}
                    isLoading={isLoading}
                />
            ))}
            <AddAnswer index={questionIndex} />
        </Flex>
    );
};

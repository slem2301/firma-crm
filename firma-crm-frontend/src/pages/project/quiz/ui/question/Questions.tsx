import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../../../components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { getQuestions, getQuizLoading } from "../../model/selectors";
import { Question } from "./Question";
import { Box, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { quizOptionsActions } from "../../model/slice/quizOptionsSlice";
import { BiMoveHorizontal } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";

const getButtonPosition = (index: number) => {
    const offset = 56;

    return index * 40 + offset;
};

export const Questions = () => {
    const [selectedNumber, setSelectedNumber] = useState(1);
    const selectedIndex = selectedNumber - 1;
    const dispatch = useAppDispatch();
    const questions = useAppSelector(getQuestions);
    const isLoading = useAppSelector(getQuizLoading);
    const [iconPosition, setIconPosition] = useState(0);

    const [showIcon, setShowIcon] = useState(false);

    const selectedQuestion = useMemo(() => {
        return questions[selectedIndex];
    }, [selectedIndex, questions]);

    const handleAddQuestion = () => {
        dispatch(quizOptionsActions.addEmptyQuestion());
        setSelectedNumber(questions.length + 1);
    };

    const handleDeleteQuestion = () => {
        dispatch(quizOptionsActions.deleteQuestion(selectedIndex));
        setSelectedNumber(questions.length - 1);
    };

    const handleMoveQuestion = (step: number) => () => {
        const targetIndex = selectedIndex + step;

        dispatch(
            quizOptionsActions.moveQuestion({
                selectedIndex,
                step,
            })
        );

        setSelectedNumber(targetIndex + 1);
        setIconPosition(getButtonPosition(targetIndex) - 8 + step * -20);
        setShowIcon(true);
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showIcon) {
            timeout = setTimeout(() => {
                setShowIcon(false);
            }, 300);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [showIcon]);

    return (
        <>
            <Heading size="md" mb={2}>
                Вопросы
            </Heading>
            <Flex
                justifyContent={"flex-start"}
                gap={"10px"}
                position="relative"
            >
                <Pagination
                    controlled
                    renderAll
                    page={selectedNumber}
                    total={questions.length}
                    onChange={setSelectedNumber}
                    disabled={isLoading}
                />
                <Flex gap={1}>
                    <IconButton
                        isDisabled={isLoading || selectedIndex === 0}
                        w="calc(16px - .25rem / 2)"
                        minW="calc(16px - .25rem / 2)"
                        h="32px"
                        size="xs"
                        aria-label="move-left"
                        icon={<FaChevronLeft />}
                        onClick={handleMoveQuestion(-1)}
                    />
                    <IconButton
                        isDisabled={
                            isLoading || selectedIndex === questions.length - 1
                        }
                        w="calc(16px - .25rem / 2)"
                        minW="calc(16px - .25rem / 2)"
                        h="32px"
                        size="xs"
                        aria-label="move-right"
                        icon={<FaChevronRight />}
                        onClick={handleMoveQuestion(1)}
                    />
                </Flex>
                <IconButton
                    isDisabled={isLoading}
                    size="sm"
                    aria-label={"add"}
                    icon={<FaPlus />}
                    colorScheme="green"
                    onClick={handleAddQuestion}
                />
                {questions.length > 1 && (
                    <Box ml="auto">
                        <Button
                            isDisabled={isLoading}
                            colorScheme="red"
                            size="sm"
                            onClick={handleDeleteQuestion}
                        >
                            Удалить вопрос
                        </Button>
                    </Box>
                )}
                <AnimatePresence>
                    {showIcon && (
                        <Box
                            position="absolute"
                            zIndex={1}
                            as={motion.div}
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            left={`${iconPosition}px`}
                            bottom="-15px"
                        >
                            <BiMoveHorizontal />
                        </Box>
                    )}
                </AnimatePresence>
            </Flex>
            {selectedQuestion && (
                <Question
                    isLoading={isLoading}
                    question={selectedQuestion}
                    index={selectedIndex}
                />
            )}
        </>
    );
};

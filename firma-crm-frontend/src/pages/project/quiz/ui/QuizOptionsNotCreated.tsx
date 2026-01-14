import { Button, Heading, VStack } from "@chakra-ui/react";
import { useAppDispatch } from "../../../../hooks/redux";
import { quizOptionsActions } from "../model/slice/quizOptionsSlice";
import { SelectTemplate } from "./SelectTemplate";

export const QuizOptionsNotCreated = () => {
    const dispatch = useAppDispatch();

    const handleClick = () =>
        dispatch(quizOptionsActions.changeMode("creating"));

    return (
        <VStack alignItems={"center"} spacing={5} pt={12}>
            <Heading size="lg" textAlign={"center"} mt={2}>
                Квиз не создан
            </Heading>
            <SelectTemplate
                actionButton={
                    <Button colorScheme="green" size="sm" onClick={handleClick}>
                        Создать
                    </Button>
                }
            />
        </VStack>
    );
};

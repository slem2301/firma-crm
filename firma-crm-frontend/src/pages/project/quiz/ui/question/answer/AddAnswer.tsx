import { Box, Button } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { quizOptionsActions } from "../../../model/slice/quizOptionsSlice";

interface AddAnswerProps {
    index: number;
}

export const AddAnswer = (props: AddAnswerProps) => {
    const dispatch = useAppDispatch();

    const handleClick = () =>
        dispatch(quizOptionsActions.addEmptyAnswer(props.index));

    return (
        <Box>
            <Button
                onClick={handleClick}
                w="100%"
                borderWidth={4}
                borderStyle={"dashed"}
                h={"100%"}
                bg="transparent"
                _hover={{
                    bg: "gray.100",
                }}
            >
                <FaPlus />{" "}
            </Button>
        </Box>
    );
};

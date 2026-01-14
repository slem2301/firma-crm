import {
    Box,
    Button,
    Flex,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Spinner,
} from "@chakra-ui/react";
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { getTemplate } from "../model/selectors";
import { FaChevronDown } from "react-icons/fa";
import { QuizTemplate } from "../model/types/mode";
import { fetchProjectQuizTemplates } from "../model/services/fetchProjectQuizTemplates";
import { quizOptionsActions } from "../model/slice/quizOptionsSlice";

interface SelectTemplateProps {
    actionButton: ReactNode;
}

export const SelectTemplate = (props: SelectTemplateProps) => {
    const dispatch = useAppDispatch();
    const selectedTemplate = useAppSelector(getTemplate);
    const [isLoading, setIsLoading] = useState(false);
    const [templates, setTemplates] = useState<QuizTemplate[]>([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const initialFocusRef = useRef<HTMLInputElement | null>(null);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const changeTemplate = (projectId: number | null) => () => {
        if (projectId === null) {
            return dispatch(quizOptionsActions.changeTemplate(null));
        }

        const template = templates.find(
            (template) => template.projectId === projectId
        );

        if (template) {
            dispatch(quizOptionsActions.changeTemplate(template));
        }
    };

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchProjectQuizTemplates(search).then((templates) => {
                setTemplates(templates);
                setIsLoading(false);
            });
        }
    }, [search, isOpen]);

    return (
        <Box w="220px" gap={2} alignItems={"flex-end"}>
            {selectedTemplate && (
                <FormLabel whiteSpace={"nowrap"}>
                    Шаблон: {selectedTemplate.projectName}
                </FormLabel>
            )}
            <Flex gap={2}>
                <Popover
                    onOpen={handleOpen}
                    onClose={handleClose}
                    initialFocusRef={initialFocusRef}
                >
                    <PopoverTrigger>
                        <Button rightIcon={<FaChevronDown />} size="sm">
                            Шаблон
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverBody
                            display="flex"
                            flexDirection={"column"}
                            gap={2}
                        >
                            <InputGroup size="sm">
                                <Input
                                    ref={initialFocusRef}
                                    value={search}
                                    autoFocus
                                    borderRadius={0}
                                    placeholder="Поиск: Название проекта"
                                    onChange={handleChangeSearch}
                                />
                                <InputRightElement>
                                    {isLoading && (
                                        <Spinner
                                            thickness="3px"
                                            w={"20px"}
                                            height="20px"
                                            mr={2}
                                        />
                                    )}
                                </InputRightElement>
                            </InputGroup>
                            <>
                                <Button
                                    w="100%"
                                    size="sm"
                                    onClick={changeTemplate(null)}
                                    bg={
                                        selectedTemplate === null
                                            ? "green.100"
                                            : "transparent"
                                    }
                                >
                                    Ничего
                                </Button>
                                {templates.map((template, index) => {
                                    return (
                                        <Button
                                            w="100%"
                                            bg={
                                                selectedTemplate?.projectId ===
                                                template.projectId
                                                    ? "green.100"
                                                    : "transparent"
                                            }
                                            size="sm"
                                            key={index}
                                            onClick={changeTemplate(
                                                template.projectId
                                            )}
                                        >
                                            {template.projectName}
                                        </Button>
                                    );
                                })}
                            </>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                {props.actionButton}
            </Flex>
        </Box>
    );
};

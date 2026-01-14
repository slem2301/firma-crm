import {
    Button,
    Heading,
    Text,
    useBoolean,
    useClipboard,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import { API_URL } from "../../axios";
import useAppToast from "../../hooks/useAppToast";
import { IProject } from "../../models/IProject";

type ConnectionProps = {
    project: IProject;
};

const Connection: React.FC<ConnectionProps> = ({ project }) => {
    const connectString = `<script src="${API_URL}/connect?domain=${project.domain}&url=${project.url}"></script>`;
    const { hasCopied, onCopy } = useClipboard(connectString);
    const toast = useAppToast();
    const [disabled, setDisabled] = useBoolean(false);

    const onClick = () => {
        onCopy();
        toast({ text: "Скопировано" });
        setDisabled.toggle();
        setTimeout(() => {
            setDisabled.toggle();
        }, 3000);
    };

    return (
        <>
            <Heading
                mb={{ base: 3, sm: 6 }}
                size="md"
                fontSize={{ base: "4vw", sm: 20 }}
            >
                Для подключения сайта к приложению скопируйте и вставьте скрипт
                перед закрывающимся тегом <code>{"</body>"}</code>
            </Heading>
            <VStack spacing={2} alignItems="flex-start">
                <Text
                    as="code"
                    wordBreak="break-all"
                    px={3}
                    py={2}
                    bg={"blue.200"}
                    rounded={2}
                    fontSize={{ base: "2.6vw", sm: 16 }}
                    fontWeight={{ base: 600, sm: 400 }}
                >
                    {connectString}
                </Text>
                <Button
                    onClick={onClick}
                    ml={2}
                    colorScheme={"green"}
                    isDisabled={disabled}
                    size={{ base: "sm", sm: "md" }}
                >
                    {hasCopied ? "Скопировано" : "Скопировать"}
                </Button>
            </VStack>
        </>
    );
};

export default Connection;

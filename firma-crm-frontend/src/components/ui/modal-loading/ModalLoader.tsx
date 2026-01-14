import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

type ModalLoaderProps = {
    text?: string;
    onCancel?: () => void;
};

const ModalLoader: React.FC<ModalLoaderProps> = ({ text, onCancel }) => {
    return (
        <Flex
            align="center"
            justify={"center"}
            flexDirection="column"
            gap={10}
            top={0}
            left={0}
            w="100%"
            h={"100%"}
            position="absolute"
            zIndex={2000}
        >
            {text && (
                <Text fontWeight={500} color="white">
                    {text}
                </Text>
            )}
            <Spinner color="white" w={"60px"} h={"60px"} thickness={"6px"} />
            {onCancel && (
                <Button
                    size="sm"
                    color="white"
                    _hover={{ color: "gray.800", bg: "white" }}
                    variant="outline"
                    onClick={onCancel}
                >
                    Отмена
                </Button>
            )}
        </Flex>
    );
};

export default ModalLoader;

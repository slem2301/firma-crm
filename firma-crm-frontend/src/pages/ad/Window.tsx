import { Divider, Flex, Heading, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface WindowProps {
    title: string;
    action?: JSX.Element;
}

const Window = ({
    title,
    children,
    action,
}: PropsWithChildren<WindowProps>) => {
    return (
        <VStack
            as={motion.div}
            borderWidth={1}
            borderTopWidth={4}
            borderTopColor={"blue.500"}
            p={3}
            flexGrow={1}
            alignItems={"stretch"}
            initial={{ opacity: 0, transform: "scale(.8)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
        >
            <Flex gap={2}>
                <Heading textTransform={"uppercase"} pb={1} size="md">
                    {title}
                </Heading>
                {action && (
                    <Flex gap={2} ml="auto">
                        {action}
                    </Flex>
                )}
            </Flex>
            <Divider />
            {children}
        </VStack>
    );
};

export default Window;

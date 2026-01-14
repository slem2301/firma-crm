import { Flex, Spinner } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { PropsWithChildren } from "react";

interface LoaderProps {
    permanent?: boolean;
    hideSpinner?: boolean;
}

const Loader = ({
    permanent,
    children,
    hideSpinner,
}: PropsWithChildren<LoaderProps>) => {
    return (
        <AnimatePresence>
            <Flex
                align={"center"}
                justify="center"
                position={"absolute"}
                top={0}
                right={0}
                bottom={0}
                left={0}
            >
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: permanent ? 1 : 0 }}
                    transition={{ delay: 1 }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {children}
                    {!hideSpinner && (
                        <Spinner
                            h={"50px"}
                            w={"50px"}
                            thickness="6px"
                            speed="0.65s"
                            color="blue.500"
                        />
                    )}
                </motion.div>
            </Flex>
        </AnimatePresence>
    );
};

export default Loader;

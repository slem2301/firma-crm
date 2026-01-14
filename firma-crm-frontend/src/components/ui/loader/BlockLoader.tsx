import { Flex, FlexProps, Spinner, SpinnerProps } from "@chakra-ui/react";
import React from "react";

type BlockLoaderProps = {
    blockProps?: FlexProps;
    spinnerProps?: SpinnerProps;
};

const BlockLoader: React.FC<BlockLoaderProps> = (props) => {
    return (
        <Flex
            borderWidth={1}
            rounded={2}
            w={"100px"}
            h="32px"
            align="center"
            justify={"center"}
            {...props.blockProps}
        >
            <Spinner h={"15px"} w={"15px"} {...props.spinnerProps} />
        </Flex>
    );
};

export default BlockLoader;

import {
    ButtonProps,
    Button as ChakraButton,
    Box,
    Tooltip,
} from "@chakra-ui/react";
import React from "react";

const Button: React.FC<ButtonProps & { tooltipdisabled: boolean }> = (
    props
) => {
    return (
        <Tooltip
            label={props.children}
            fontSize="xs"
            isDisabled={props.tooltipdisabled}
        >
            <ChakraButton
                rounded={0}
                justifyContent="flex-start"
                bg="transparent"
                w={"100%"}
                pl={"12px"}
                leftIcon={
                    <Box marginInlineEnd="12px" as="span">
                        {props.leftIcon}
                    </Box>
                }
            >
                {props.children}
            </ChakraButton>
        </Tooltip>
    );
};

export default Button;

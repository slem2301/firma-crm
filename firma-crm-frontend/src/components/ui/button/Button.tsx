import { ButtonProps, Button as ChakraButton } from "@chakra-ui/react";
import React from "react";
import { COLOR_SCHEME } from "../../../const/colors";

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <ChakraButton colorScheme={COLOR_SCHEME} {...props}>
            {props.children}
        </ChakraButton>
    );
};

export default Button;

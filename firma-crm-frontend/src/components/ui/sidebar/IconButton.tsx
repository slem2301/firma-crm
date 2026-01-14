import {
    IconButtonProps,
    IconButton as ChakraIconButton,
} from "@chakra-ui/react";
import React from "react";

const IconButton: React.FC<IconButtonProps> = (props) => {
    return <ChakraIconButton rounded={0} bg="transparent" {...props} />;
};

export default IconButton;

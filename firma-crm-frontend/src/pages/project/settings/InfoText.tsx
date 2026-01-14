import { Text, TextProps } from "@chakra-ui/react";
import React from "react";

const InfoText: React.FC<TextProps> = (props) => {
    return (
        <Text
            fontWeight={300}
            fontSize={{ base: 13, sm: 16 }}
            ml="17px"
            lineHeight={"32px"}
            textAlign={"left"}
            {...props}
        />
    );
};

export default InfoText;

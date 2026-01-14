import { Text } from "@chakra-ui/react";
import React from "react";

interface PreSymbolProps {
    isRefill: boolean;
}

const PreSymbol: React.FC<PreSymbolProps> = ({ isRefill }) => {
    return (
        <Text as="span" color={isRefill ? "green.500" : "red.600"}>
            {isRefill ? "+ " : "- "}
        </Text>
    );
};

export default PreSymbol;

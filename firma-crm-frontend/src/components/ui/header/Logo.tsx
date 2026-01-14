import { Box, BoxProps, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { COLOR_PRIMARY } from "../../../const/colors";
import { DEFAULT_ROUTE } from "../../../router/routes";

const Logo: React.FC<BoxProps> = (props) => {
    return (
        <Box
            as="div"
            color={COLOR_PRIMARY}
            fontWeight={800}
            fontSize={32}
            lineHeight={1}
            {...props}
        >
            <Link to={DEFAULT_ROUTE.path}>
                F<Text display={{ base: "none", sm: "inline" }}>irma </Text>
                CRM
            </Link>
        </Box>
    );
};

export default Logo;

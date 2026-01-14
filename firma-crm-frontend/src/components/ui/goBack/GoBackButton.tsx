import { Flex, Link } from "@chakra-ui/react";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link as NavLink } from "react-router-dom";

interface GoBackButtonProps {
    to: string;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({ to }) => {
    return (
        <Link
            as={NavLink}
            to={to}
            _hover={{
                color: "#fff",
                bg: "blue.500",
            }}
            display="inline-block"
            mb={2}
        >
            <Flex
                alignItems={"center"}
                gap={2}
                py={2}
                px={3}
                borderWidth={1}
                width={100}
            >
                <FaArrowLeft />
                Назад
            </Flex>
        </Link>
    );
};

export default GoBackButton;

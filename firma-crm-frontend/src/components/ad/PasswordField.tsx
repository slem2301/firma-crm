import {
    HStack,
    IconButton,
    Text,
    TextProps,
    useBoolean,
} from "@chakra-ui/react";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type PasswordFieldProps = {
    password: string;
} & TextProps;

const PasswordField: React.FC<PasswordFieldProps> = ({
    password,
    ...props
}) => {
    const [show, setShow] = useBoolean(false);

    return (
        <HStack align={"center"}>
            <Text {...props}>
                {show
                    ? password
                    : Array.from(Array(password.length).keys()).map(() => "*")}
            </Text>
            <IconButton
                bg="transparent"
                rounded={20}
                size="sm"
                aria-label="show"
                onClick={setShow.toggle}
                icon={show ? <FaEye /> : <FaEyeSlash />}
            />
        </HStack>
    );
};

export default PasswordField;

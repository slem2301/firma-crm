import { Flex, Input, Text, Textarea } from "@chakra-ui/react";
import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { IOrder } from "../../../models/IOrder";

export type Field = {
    name: string | JSX.Element;
    key: keyof IOrder;
    isDisabled?: boolean;
    isTextArea?: boolean;
    type?: string;
    formatValue?: (value: string) => string;
};

type OrderFieldProps = {
    field: Field;
    register: UseFormRegister<FieldValues>;
    blocks: string[];
    isLoading: boolean;
};

const OrderField: React.FC<OrderFieldProps> = ({
    field,
    register,
    blocks,
    isLoading,
}) => {
    const { type = "text" } = field;

    return (
        <Flex
            ps={2}
            pe={{ base: 2, sm: 0 }}
            key={field.key}
            bg={{
                base: "transparent",
                sm: field.isDisabled ? "gray.100" : "transparent",
            }}
            align="flex-start"
            flexDirection={{ base: "column", sm: "row" }}
            gap={1}
            _hover={{ bg: field.isDisabled ? "gray.100" : "gray.100" }}
            borderLeftWidth={4}
            borderLeftColor={
                blocks.includes(field.key) ? "blue.500" : "transparent"
            }
        >
            <Text
                pt={
                    typeof field.name !== "string"
                        ? {}
                        : { base: ".5em", md: ".35em" }
                }
                as="div"
                alignSelf={"stretch"}
                lineHeight={1.2}
                fontSize={{ base: 14, md: 16 }}
                w={{ base: "100%", sm: "50%" }}
                borderRightWidth={{ base: 0, sm: 1 }}
            >
                {typeof field.name === "string" ? (
                    <>{field.name}:</>
                ) : (
                    field.name
                )}
            </Text>
            {field.isTextArea ? (
                <Textarea
                    bg="white"
                    isDisabled={field.isDisabled || isLoading}
                    size="sm"
                    w={{ base: "100%", sm: "50%" }}
                    borderColor="var(--chakra-colors-chakra-border-color)"
                    {...register(field.key)}
                />
            ) : (
                <Input
                    type={type}
                    bg="white"
                    isDisabled={field.isDisabled || isLoading}
                    borderColor="var(--chakra-colors-chakra-border-color)"
                    size="sm"
                    w={{ base: "100%", sm: "50%" }}
                    {...register(field.key)}
                />
            )}
        </Flex>
    );
};

export default OrderField;

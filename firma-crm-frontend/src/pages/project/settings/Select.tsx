import {
    Box,
    BoxProps,
    ButtonProps,
    FormLabel,
    TextProps,
} from "@chakra-ui/react";
import React from "react";
import SingleSelectFilter, {
    optionType,
} from "../../../components/filters/SingleSelectFilter";
import InfoText from "./InfoText";

type SelectProps = {
    editMode: boolean;
    setValue: (value: any) => void;
    options: optionType<number>[];
    name: string;
    defaultValue: number;
    text: string;
    props?: BoxProps;
    selectProps?: ButtonProps;
    textProps?: TextProps;
};

const Select: React.FC<SelectProps> = ({
    editMode,
    setValue,
    options,
    name,
    defaultValue,
    text,
    props,
    selectProps,
    textProps,
}) => {
    return (
        <Box w={"100%"} {...props}>
            <FormLabel>{name}:</FormLabel>
            {editMode ? (
                <SingleSelectFilter
                    selectProps={{
                        size: { base: "sm", md: "md" },
                        textAlign: "left",
                        ...selectProps,
                    }}
                    w={"100%"}
                    setValue={setValue}
                    options={options}
                    defaultValue={defaultValue}
                />
            ) : (
                <InfoText {...textProps}>{text}</InfoText>
            )}
        </Box>
    );
};

export default Select;

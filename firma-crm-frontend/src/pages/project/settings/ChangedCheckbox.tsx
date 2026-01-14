import { Checkbox, CheckboxProps, Text } from "@chakra-ui/react";
import React from "react";
import InfoText from "./InfoText";

type ChangedCheckboxProps = {
    isEditable: boolean;
    name: string;
} & CheckboxProps;

const ChangedCheckbox: React.FC<ChangedCheckboxProps> = ({
    isEditable,
    name,
    ...props
}) => {
    return isEditable ? (
        <Checkbox {...props}>{name}</Checkbox>
    ) : (
        <InfoText>
            <Text as="span" fontWeight={500}>
                {name}:{" "}
            </Text>
            {props.isChecked ? "Включено" : "Отключено"}
        </InfoText>
    );
};

export default ChangedCheckbox;

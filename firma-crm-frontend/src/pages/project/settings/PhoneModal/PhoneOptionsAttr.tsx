import { Flex, Switch, Text, TextProps, useBoolean } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DEFAULT_VALUE } from "./PhoneOptions";

type PhoneOptionsAttrProps = {
    editableProp?: keyof TextProps;
    startValue: string;
    name: string;
    input: (options: {
        value: string;
        setValue: (value: string) => void;
        isInherit: boolean;
    }) => JSX.Element;
    onChange: (value: string) => void;
};

const PhoneOptionsAttr: React.FC<PhoneOptionsAttrProps> = ({
    editableProp,
    startValue,
    name,
    input,
    onChange,
}) => {
    const [value, setValue] = useState(startValue);
    const [isInherit, setIsInherit] = useBoolean(valueIsInherit(startValue));

    const props: any = {};
    if (editableProp) props[editableProp] = value;

    useEffect(() => {
        onChange(value);
    }, [value, onChange]);

    useEffect(() => {
        if (isInherit) setValue(DEFAULT_VALUE);
    }, [isInherit]);

    return (
        <>
            <Flex
                justifyContent={"space-between"}
                alignItems="center"
                fontWeight={500}
            >
                <Text as="p">
                    {name}:{" "}
                    <Text as="span" {...props}>
                        {valueIsInherit(value) ? "По умолчанию" : value}
                    </Text>
                </Text>
                <Switch isChecked={!isInherit} onChange={setIsInherit.toggle} />
            </Flex>
            {input({
                value,
                setValue,
                isInherit,
            })}
        </>
    );
};

export default PhoneOptionsAttr;

export const valueIsInherit = (value: string) => value === DEFAULT_VALUE;

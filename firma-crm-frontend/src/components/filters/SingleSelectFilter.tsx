/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    BoxProps,
    Button,
    ButtonProps,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";

export type optionType<T> = {
    name: string;
    value: T;
};

type SingleSelectFilterProps<T> = BoxProps & {
    setValue: (value: T) => void;
    options: optionType<T>[];
    defaultValue?: T;
    bold?: boolean;
    selectProps?: ButtonProps;
    paired?: boolean;
    placeholder?: string;
    disabledWhenEmpty?: boolean;
};

const SingleSelectFilter = <T extends string | number>(
    props: SingleSelectFilterProps<T>
) => {
    const {
        setValue: _setValue,
        options,
        selectProps,
        defaultValue,
        bold,
        paired,
        placeholder = "Выберите...",
        disabledWhenEmpty = true,
        ...rest
    } = props;

    const isEmpty = !options || options.length === 0;

    // ✅ безопасное стартовое значение (undefined если опций нет)
    const initial = useMemo<T | undefined>(() => {
        if (defaultValue !== undefined) return defaultValue;
        return options?.[0]?.value;
    }, [defaultValue, options]);

    const [value, setValue] = useState<T | undefined>(initial);

    // ✅ если options подгрузились позже — выставляем value
    useEffect(() => {
        if (value === undefined && initial !== undefined) {
            setValue(initial);
        }
    }, [initial, value]);

    const set = paired ? _setValue : (setValue as any);
    const val = paired ? defaultValue : value;

    const onClick = (_value: T) => () => {
        set(_value);
    };

    useEffect(() => {
        if (!paired && value !== undefined) {
            _setValue(value);
        }
    }, [value, _setValue, paired]);

    return (
        <Box {...rest}>
            <Menu isLazy>
                <MenuButton
                    w="100%"
                    bg="transparent"
                    fontWeight={bold ? 500 : 400}
                    borderWidth={1}
                    rounded={2}
                    size="sm"
                    as={Button}
                    _active={{ bg: "transparent" }}
                    rightIcon={<FaChevronDown />}
                    isDisabled={disabledWhenEmpty && isEmpty}
                    {...selectProps}
                >
                    {isEmpty
                        ? placeholder
                        : options.find((option) => option.value === val)?.name ?? placeholder}
                </MenuButton>

                {!isEmpty && (
                    <MenuList maxH="60vh" overflowY="auto">
                        {options.map((option, i) => (
                            <MenuItem
                                fontSize={
                                    selectProps?.size
                                        ? selectProps.size === "md"
                                            ? "16px"
                                            : "14px"
                                        : "14px"
                                }
                                color="black"
                                onClick={onClick(option.value)}
                                key={`${option.value}-${i}`}
                                bg={val === option.value ? "gray.200" : "transparent"}
                            >
                                {option.name}
                            </MenuItem>
                        ))}
                    </MenuList>
                )}
            </Menu>
        </Box>
    );
};

export default SingleSelectFilter;

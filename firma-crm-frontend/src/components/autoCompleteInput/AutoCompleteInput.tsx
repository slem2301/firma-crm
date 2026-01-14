/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Input,
    InputProps,
    PopoverBody,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text,
} from "@chakra-ui/react";
import React, { PropsWithChildren, useEffect, useState } from "react";

type AutoCompleteInputProps<T> = {
    allItems: T[];
    attribute: keyof T;
    value: string;
    otherCondition?: (item: T) => boolean;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    props?: InputProps;
};

const AutoCompleteInput = <T,>(
    props: PropsWithChildren<AutoCompleteInputProps<T>>
) => {
    const {
        allItems,
        attribute,
        onChange,
        value,
        otherCondition,
        props: rest,
    } = props;

    const [items, setItems] = useState<T[]>([]);
    const [isOpen, setIsOpen] = useState(true);

    const handleChange = (e: any) => {
        const value = e.target.value as string;
        setIsOpen(true);
        onChange(value);
    };

    const onClick = (value: string) => () => {
        onChange(value);
        setIsOpen(false);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setItems(
                allItems.filter((item) => {
                    return (
                        String(item[attribute]).includes(value) &&
                        (otherCondition ? otherCondition(item) : true)
                    );
                })
            );
        }, 50);

        return () => clearTimeout(timeout);
    }, [value, allItems]);

    return (
        <Box>
            <Input
                {...rest}
                autoComplete="off"
                value={value}
                size="sm"
                autoFocus
                onChange={handleChange}
                onBlur={() => setIsOpen(false)}
                onFocus={() => setIsOpen(true)}
            />
            <Popover isOpen={isOpen} isLazy autoFocus={false}>
                <PopoverTrigger>
                    <Box h={0}></Box>
                </PopoverTrigger>
                <PopoverContent maxH="50vh" overflowY="auto">
                    <PopoverBody px={0}>
                        {items.length ? (
                            items.map((item, i) => (
                                <Box
                                    cursor={"pointer"}
                                    p={2}
                                    px={4}
                                    key={i}
                                    onClick={onClick(String(item[attribute]))}
                                    _hover={{ bg: "gray.200" }}
                                >
                                    <Text>
                                        <>{item[attribute]}</>
                                    </Text>
                                </Box>
                            ))
                        ) : (
                            <Text p={2} px={4}>
                                Не найдено
                            </Text>
                        )}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export default AutoCompleteInput;

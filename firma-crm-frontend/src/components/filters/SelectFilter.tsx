/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    BoxProps,
    Button,
    Checkbox,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    Text,
    TextProps,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export type FilterId = string | number;

export type SelectFilterItem<T extends FilterId = FilterId> = {
    id: T;
    name: string;
    props?: BoxProps;
    textProps?: TextProps;
};

type SelectFilterProps<T extends FilterId = FilterId> = {
    items: SelectFilterItem<T>[];
    setFilter: (value: T[]) => void;
    filterName: string;
    defaultValues?: T[];
    clearTrigger?: boolean;
} & BoxProps;

// служебное значение — строка (не конфликтует с number и почти наверняка не конфликтует с твоими string id)
const ALL_ID = "__ALL__" as const;

const SelectFilter = <T extends FilterId>(props: SelectFilterProps<T>) => {
    const { items, filterName, setFilter, defaultValues, clearTrigger, ...rest } =
        props;

    const allRealIds = useMemo<T[]>(() => items.map((i) => i.id), [items]);

    const computedDefaultIds = useMemo<(T | typeof ALL_ID)[]>(() => {
        const base = defaultValues ?? allRealIds;
        // если выбраны все — добавляем ALL_ID
        return base.length === allRealIds.length ? [ALL_ID, ...base] : base;
    }, [defaultValues, allRealIds]);

    const [defaultIds, setDefaultIds] =
        useState<(T | typeof ALL_ID)[]>(computedDefaultIds);
    const [ids, setIds] = useState<(T | typeof ALL_ID)[]>(computedDefaultIds);

    const onClick = (id: T | typeof ALL_ID) => () => {
        const exists = ids.includes(id);
        const isAll = id === ALL_ID;

        if (exists) {
            if (isAll) return setIds([]);
            // снимаем конкретный + обязательно снимаем ALL_ID
            return setIds((prev) => prev.filter((x) => x !== ALL_ID && x !== id));
        }

        if (isAll) return setIds(defaultIds);

        // добавили конкретный
        const next = [...ids, id];

        const onlyReal = next.filter((x) => x !== ALL_ID) as T[];
        const isNowAll = onlyReal.length >= allRealIds.length;

        if (isNowAll) return setIds([ALL_ID, ...onlyReal]);

        setIds(next);
    };

    useEffect(() => {
        if (clearTrigger) setIds(defaultIds);
    }, [clearTrigger]);

    useEffect(() => {
        // пересчитать дефолты при изменении items
        const newDefaultIds: (T | typeof ALL_ID)[] =
            allRealIds.length ? [ALL_ID, ...allRealIds] : [];
        setDefaultIds(newDefaultIds);

        const base = defaultValues ?? allRealIds;
        const newIds =
            base.length === allRealIds.length ? [ALL_ID, ...base] : (base as any);

        setIds(newIds);
    }, [items]);

    useEffect(() => {
        // наружу отдаём только реальные id
        setFilter(ids.filter((x) => x !== ALL_ID) as T[]);
    }, [ids, setFilter]);

    // если items пустые — можно показывать пустое меню, ок
    return (
        <Box {...rest}>
            <Menu isLazy>
                <MenuButton
                    w="100%"
                    bg={"transparent"}
                    fontWeight={400}
                    borderWidth={1}
                    rounded={2}
                    size="sm"
                    as={Button}
                    _active={{ bg: "transparent" }}
                    rightIcon={<FaChevronDown />}
                >
                    {filterName}
                </MenuButton>

                <MenuList maxH={"50vh"} overflowY="auto">
                    <HStack
                        userSelect={"none"}
                        cursor={"pointer"}
                        px={4}
                        py={2}
                        onClick={onClick(ALL_ID)}
                        _hover={{ bg: "gray.100" }}
                    >
                        <Checkbox isChecked={ids.includes(ALL_ID)} />
                        <Text fontSize={"14px"} color="black">
                            Все
                        </Text>
                    </HStack>

                    {items.map((item) => (
                        <HStack
                            key={`${String(item.id)}-${item.name}`}
                            userSelect={"none"}
                            cursor={"pointer"}
                            px={4}
                            py={2}
                            onClick={onClick(item.id)}
                            _hover={{ bg: "gray.100" }}
                            {...item.props}
                        >
                            <Checkbox isChecked={ids.includes(item.id)} />
                            <Text fontSize={"14px"} color="black" {...item.textProps}>
                                {item.name}
                            </Text>
                        </HStack>
                    ))}
                </MenuList>
            </Menu>
        </Box>
    );
};

export default SelectFilter;

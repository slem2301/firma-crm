import {
    TableContainer,
    Table as ChakraTable,
    Thead,
    Tbody,
    TableContainerProps,
    Flex,
    HStack,
    IconButton,
    TableHeadProps,
    ResponsiveValue,
    Spinner,
    StackProps,
    useConst,
    TableRowProps,
    Text,
} from "@chakra-ui/react";
import React, { forwardRef, useEffect, useState } from "react";
import { GrRefresh } from "react-icons/gr";
import { sortValueType, useSortOptions } from "../../hooks/useSort";
import Row from "./Row";
import Header, { TableHeader } from "./Header";
import { COLOR_PRIMARY } from "../../const/colors";

type TSort<T> = useSortOptions<T> & {
    onSort: (key: string, value: sortValueType) => void;
};

type TableProps<T> = {
    zeroText?: string;
    toolbar?: JSX.Element;
    update?: (args?: any) => void;
    adaptive?: boolean;
    headers: TableHeader<T>[];
    rows: T[];
    props?: TableContainerProps & { ref?: any };
    rowAction?: (item: T) => void;
    isLoading?: boolean;
    tHeadProps?: TableHeadProps;
    maxH?: ResponsiveValue<number | string>;
    refToLast?: any;
    refToLastCol?: any;
    loadElse?: () => void;
    toolbarProps?: StackProps;
    sort?: TSort<T>;
    loadingOverlay?: boolean;
    withoutSpinner?: boolean;
    sortItems?: (value: T[]) => void;
    getRowProps?: (item: T) => TableRowProps;
    expand?: {
        getExpanded: (item: T) => boolean;
        expandedHeaders: TableHeader<T>[];
        getEpandedRows: (item: T) => T[];
        onChange?: (idx: number, value: boolean) => void;
        isExpanded?: (idx: number) => boolean;
        withArrow?: boolean;
    };
};

const Table = <T,>(props: TableProps<T>, ref: any) => {
    const {
        zeroText,
        headers,
        expand,
        rows,
        props: containerProps,
        rowAction,
        adaptive,
        toolbar,
        update,
        isLoading,
        getRowProps,
        refToLastCol,
        maxH,
        tHeadProps,
        refToLast,
        toolbarProps,
        loadElse,
        sort: sortOptions,
        sortItems,
        loadingOverlay,
        withoutSpinner,
    } = props;

    const [items, setItems] = useState<T[]>(Array.isArray(rows) ? rows : []);


    const set = sortItems ? sortItems : setItems;

    const defaultHeaderSorts = useConst(
        headers.reduce((result: any, header) => {
            if (header.key) result[header.key] = "DESC";

            return result;
        }, {})
    );

    const [headerSorts, setHeaderSorts] = useState<{
        [key: string]: sortValueType;
    }>(defaultHeaderSorts);

    const setHeaderSort = (key: string, value: sortValueType) => {
        setHeaderSorts((prev) => ({ ...prev, [key]: value }));
    };

    const sortNumber = (key: keyof T, isAsc: boolean) => {
        set(
            [...items].sort((a, b) => {
                const aValue = Number(a[key]);
                const bValue = Number(b[key]);

                if (isAsc) return aValue - bValue;

                return bValue - aValue;
            })
        );
    };

    const sortString = (key: keyof T, isAsc: boolean) => {
        set(
            [...items].sort((a, b) => {
                const aValue = String(a[key]).toLocaleLowerCase();
                const bValue = String(b[key]).toLocaleLowerCase();

                if (isAsc) {
                    if (aValue > bValue) return -1;
                    if (aValue < bValue) return 1;
                } else {
                    if (aValue > bValue) return 1;
                    if (aValue < bValue) return -1;
                }

                return 0;
            })
        );
    };

    const customSort = (
        key: keyof T,
        isAsc: boolean,
        header?: TableHeader<T>
    ) => {
        if (!header || !header.getSortValue) return;

        set(
            [...items].sort((a, b) => {
                const aValue = header.getSortValue?.(a);
                const bValue = header.getSortValue?.(b);

                if (typeof aValue === "string" && typeof bValue === "string") {
                    if (!isAsc) {
                        if (aValue > bValue) return -1;
                        if (aValue < bValue) return 1;
                    } else {
                        if (aValue > bValue) return 1;
                        if (aValue < bValue) return -1;
                    }
                } else {
                    if (!isAsc) return Number(aValue) - Number(bValue);

                    return Number(bValue) - Number(aValue);
                }

                return 0;
            })
        );
    };

    const sort = (
        key: keyof T,
        method: (key: keyof T, isASC: boolean, header?: TableHeader<T>) => void,
        header?: TableHeader<T>
    ) => {
        const headerKey = key as string;

        const value = headerSorts[headerKey];
        const isASC = value === "ASC";

        setHeaderSort(headerKey, isASC ? "DESC" : "ASC");

        if (sortOptions && sortOptions.signature[key]) {
            sortOptions.onSort(headerKey, value);
        } else method(key, isASC, header);
    };

    useEffect(() => {
        setItems(Array.isArray(rows) ? rows : []);
    }, [rows]);


    const headerClickHandler = (header: TableHeader<T>) => {
        const item = sortOptions ? sortOptions.signature : items[0];
        if (!item) return;

        const key = header.key as keyof T;
        const propType = typeof item[key];

        if (header.getSortValue) return sort(key, customSort, header);

        switch (propType) {
            case "string":
                sort(key, sortString);
                break;
            case "number":
                sort(key, sortNumber);
                break;
            default:
                sort(key, customSort, header);
                break;
        }
    };

    return (
        <TableContainer
            pb={4}
            w={"100%"}
            borderWidth={1}
            borderRadius="lg"
            position={maxH ? "relative" : "static"}
            maxH={maxH}
            minH={maxH}
            overflowY={loadingOverlay ? "hidden" : "auto"}
            overflowX={loadingOverlay ? "hidden" : "auto"}
            className="table-with-beauty-scroll"
            {...containerProps}
            ref={ref}
        >
            {(isLoading || loadingOverlay) && items.length > 1 && (
                <Flex
                    position={"absolute"}
                    bg={"rgba(255, 255, 255, .3)"}
                    h={"100%"}
                    w={"100%"}
                    align="center"
                    justify={"center"}
                >
                    {!withoutSpinner && (
                        <Spinner
                            emptyColor="gray.200"
                            thickness="4px"
                            w={"38px"}
                            h={"38px"}
                            color={COLOR_PRIMARY}
                        />
                    )}
                </Flex>
            )}
            <HStack
                align={"center"}
                px={{ base: 2, sm: 4 }}
                pb={2}
                pt={2}
                justify={"flex-end"}
                {...toolbarProps}
            >
                {toolbar}
                {update && (
                    <IconButton
                        isLoading={isLoading}
                        onClick={update}
                        bg="transparent"
                        rounded={"50%"}
                        aria-label="update statisticks"
                        icon={<GrRefresh />}
                    />
                )}
            </HStack>
            <ChakraTable size={"sm"}>
                <Thead
                    h="40px"
                    position={maxH ? "sticky" : "static"}
                    bg={"white"}
                    top={0}
                    right={0}
                    left={0}
                    {...tHeadProps}
                >
                    <Header<T>
                        adaptive={adaptive}
                        headers={headers}
                        headerSorts={headerSorts}
                        headerClickHandler={headerClickHandler}
                        refToLastCol={refToLastCol}
                    />
                </Thead>
                <Tbody>
                    {items.map((item, i) => (
                        <Row<T>
                            expand={expand}
                            key={i}
                            action={rowAction}
                            headers={headers}
                            item={item}
                            refToLast={refToLast}
                            index={i}
                            zeroText={zeroText}
                            itemsLength={items.length}
                            props={getRowProps && getRowProps(item)}
                        />
                    ))}
                </Tbody>
            </ChakraTable>
            {loadElse && !isLoading && (
                <Text
                    onClick={loadElse}
                    textAlign={"center"}
                    py={1}
                    color="blue.500"
                    cursor={"pointer"}
                    _hover={{ textDecoration: "underline" }}
                >
                    Еще...
                </Text>
            )}
            {isLoading && refToLast && (
                <Flex pt={4} justify={"center"}>
                    <Spinner />
                </Flex>
            )}
        </TableContainer>
    );
};

export default forwardRef(Table) as <T>(
    props: TableProps<T> & { ref?: React.ForwardedRef<HTMLUListElement> }
) => ReturnType<typeof Table>;

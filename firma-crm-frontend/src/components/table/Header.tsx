import {
    Flex,
    TableCellProps,
    TableColumnHeaderProps,
    TextProps,
    Th,
    Tr,
} from "@chakra-ui/react";
import React, { PropsWithChildren, ReactNode } from "react";
import {
    ImSortAlphaAsc,
    ImSortAlphaDesc,
    ImSortNumbericDesc,
    ImSortNumericAsc,
} from "react-icons/im";
import { sortValueType } from "../../hooks/useSort";
import { BalanceLimits } from "../../models/IAd";

export type HeaderProps<T> = {
    headers: TableHeader<T>[];
    adaptive?: boolean;
    refToLastCol?: any;
    headerSorts: { [key: string]: sortValueType };
    headerClickHandler: (header: TableHeader<T>) => void;
};

const Header = <T,>(props: PropsWithChildren<HeaderProps<T>>) => {
    const { headers, adaptive, headerSorts, headerClickHandler, refToLastCol } =
        props;

    return (
        <Tr>
            {headers.map((header, i) => {
                const adds: any = {};
                if (refToLastCol && i === headers.length - 1) {
                    adds.ref = refToLastCol;
                }

                return (
                    <HeaderCol<T>
                        key={i}
                        col={{ ...header, props: { ...header.props, ...adds } }}
                        headerClickHandler={headerClickHandler}
                        adaptive={adaptive}
                        headerSorts={headerSorts}
                    />
                );
            })}
        </Tr>
    );
};

export default Header;

export type TableHeader<T> = {
    name: string | JSX.Element;
    key?: keyof T;
    props?: TableColumnHeaderProps;
    render?: (item: T, index: number) => ReactNode;
    align?: "center" | "right" | "left";
    rowProps?: TableCellProps;
    animated?: boolean;
    helperText?: (item: T) => JSX.Element | ReactNode;
    helperTextProps?: TextProps;
    type?: "string" | "number" | "date";
    sortable?: boolean;
    hideOn?: "sm" | "md" | "lg" | "xl";
    showOn?: "sm" | "md" | "lg" | "xl";
    breakSpaces?: boolean;
    getSortValue?: (item: T) => string | number;
    limits?: BalanceLimits;
    getLimitValue?: (item: T) => [any, string];
    editable?: boolean;
    getValueForEdit?: (item: T) => any;
    onEdit?: (item: T) => (e: any) => void;
};

export type HeaderColProps<T> = {
    col: TableHeader<T>;
    adaptive?: boolean;
    sortable?: boolean;
    headerSorts: { [key: string]: sortValueType };
    headerClickHandler: (header: TableHeader<T>) => void;
};

const HeaderCol = <T,>(_props: PropsWithChildren<HeaderColProps<T>>) => {
    const { col, adaptive, headerClickHandler, headerSorts } = _props;

    const {
        name,
        key,
        type = "number",
        align,
        hideOn,
        showOn,
        props,
        sortable: _sortable = true,
    } = col;

    const sortable = !!key && _sortable;

    return (
        <Th
            fontSize={{
                base: adaptive ? 10 : 12,
                sm: 12,
            }}
            textAlign={align || "left"}
            display={
                hideOn
                    ? {
                          base: "none",
                          [hideOn]: "table-cell",
                      }
                    : showOn
                    ? {
                          [showOn]: "none",
                          base: "table-cell",
                      }
                    : "table-cell"
            }
            {...props}
            onClick={sortable ? () => headerClickHandler(col) : () => {}}
            cursor={sortable ? "pointer" : "default"}
            _hover={{
                textDecoration: sortable ? "underline" : "none",
            }}
        >
            <Flex
                gap={1}
                alignItems={"center"}
                justifyContent={
                    align === "center"
                        ? "center"
                        : align === "right"
                        ? "flex-end"
                        : "flex-start"
                }
            >
                {name}
                {sortable &&
                    (headerSorts[key as string] === "ASC" ? (
                        type === "string" ? (
                            <ImSortAlphaDesc />
                        ) : (
                            <ImSortNumbericDesc />
                        )
                    ) : type === "string" ? (
                        <ImSortAlphaAsc />
                    ) : (
                        <ImSortNumericAsc />
                    ))}
            </Flex>
        </Th>
    );
};

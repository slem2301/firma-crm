import { HStack, Input, TableRowProps, Td, Text, Tr } from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import AnimatedNumber from "../ui/animated-number/AnimatedNumber";
import { TableHeader } from "./Header";
import { getBalanceZone } from "../../pages/statisticks/balanceStatisticks/utils";
import { LIMIT_BG } from "../../const/colors";

type RowProps<T> = {
    refToLast?: any;
    zeroText?: string;
    action?: (item: T) => void;
    expand?: {
        getExpanded: (item: T) => boolean;
        expandedHeaders: TableHeader<T>[];
        getEpandedRows: (item: T) => T[];
        onChange?: (idx: number, value: boolean) => void;
        isExpanded?: (idx: number) => boolean;
        withArrow?: boolean;
    };
    item: T;
    index: number;
    itemsLength: number;
    headers: TableHeader<T>[];
    props?: TableRowProps;
};

const Row = <T,>(props: PropsWithChildren<RowProps<T>>) => {
    const {
        action,
        expand,
        item,
        refToLast,
        index,
        headers,
        itemsLength,
        zeroText = "--/--",
    } = props;

    let withArrow = true;
    if (expand?.withArrow !== undefined) withArrow = !!expand.withArrow;

    const isExpanded = expand && expand.getExpanded(item);

    const [_expanded, _setExpanded] = useState(false);

    const expanded =
        (expand?.isExpanded && expand?.isExpanded(index)) || _expanded;

    const additionalProps: any = {};

    const setExpanded = (value: boolean) => {
        if (expand?.onChange) {
            expand.onChange(index, value);
        }

        _setExpanded(value);
    };

    if (refToLast && index === itemsLength - 1) additionalProps.ref = refToLast;

    return (
        <>
            <Tr
                cursor={isExpanded || action ? "pointer" : "default"}
                onClick={
                    withArrow
                        ? isExpanded
                            ? () => setExpanded(!expanded)
                            : action
                                ? () => action(item)
                                : () => { }
                        : () => { }
                }
                _hover={{
                    bg: "gray.100",
                }}
                {...additionalProps}
                {...props.props}
            >
                {isExpanded
                    ? expand.expandedHeaders.map((header, i) => {
                        let _header = { ...header };
                        if (i === 0) {
                            let render = _header.render;
                            _header.render = (item) => {
                                return (
                                    <HStack
                                        spacing={2}
                                        align="center"
                                        pl={0.5}
                                    >
                                        {withArrow &&
                                            (expanded ? (
                                                <FaChevronUp />
                                            ) : (
                                                <FaChevronDown />
                                            ))}
                                        {render && render(item, index)}
                                    </HStack>
                                );
                            };
                        }

                        return (
                            <Col<T>
                                zeroText={zeroText}
                                index={index}
                                header={_header}
                                item={item}
                                key={i}
                            />
                        );
                    })
                    : headers.map((header, i) => {
                        return (
                            <Col<T>
                                zeroText={zeroText}
                                index={index}
                                header={header}
                                item={item}
                                key={i}
                            />
                        );
                    })}
            </Tr>
            {expanded &&
                expand &&
                expand.getEpandedRows(item).map((item, i, arr) => (
                    <Row
                        key={i}
                        action={action}
                        headers={headers}
                        item={item}
                        refToLast={refToLast}
                        index={i}
                        itemsLength={itemsLength}
                        props={{
                            bg: "rgba(144, 205,244, .2)",
                            borderLeftWidth: withArrow ? 2 : 0,
                            borderLeftColor: "blue.500",
                        }}
                    />
                ))}
        </>
    );
};

export default Row;

type ColProps<T> = {
    header: TableHeader<T>;
    item: T;
    index: number;
    zeroText?: string;
};

const renderCellValue = (value: any, zeroText: string) => {
    if (value === null || value === undefined) return zeroText;

    // важно: 0 должен показываться, а не превращаться в zeroText
    if (typeof value === "number") return value;

    if (typeof value === "boolean") return value ? "Да" : "Нет";

    if (typeof value === "string") return value.length ? value : zeroText;

    if (Array.isArray(value)) {
        // роли и т.п.
        return value
            .map((v) => {
                if (v == null) return "";
                if (typeof v === "string" || typeof v === "number") return String(v);
                if (typeof v === "object" && "name" in v) return String((v as any).name);
                if (typeof v === "object" && "role" in v) return String((v as any).role);
                return "";
            })
            .filter(Boolean)
            .join(", ") || zeroText;
    }

    if (typeof value === "object") {
        // самый частый кейс: {id, name}
        if ("name" in value) return String((value as any).name);
        if ("title" in value) return String((value as any).title);
        if ("label" in value) return String((value as any).label);
        return zeroText;
    }

    return zeroText;
};


const Col = <T,>(props: PropsWithChildren<ColProps<T>>) => {
    const {
        header: {
            breakSpaces,
            align,
            hideOn,
            showOn,
            rowProps,
            animated,
            helperTextProps,
            key: _key,
            render,
            helperText,
            limits,
            getLimitValue,
            editable,
            onEdit,
            getValueForEdit,
        },
        zeroText,
        item,
        index,
    } = props;

    const key = _key;
    let value = null;

    const canEdit = editable && onEdit && getValueForEdit;
    const nullable = canEdit && getValueForEdit(item) !== null;

    let bg = "transparent";

    if (limits && getLimitValue) {
        const [value, currencyKey] = getLimitValue(item);
        const zone = getBalanceZone(value, currencyKey, limits);

        bg = LIMIT_BG[zone];
    }

    if (key) value = item[key];

    return (
        <Td
            py={editable ? 1 : 2}
            px={editable ? 1 : 4}
            textAlign={align ? align : "left"}
            whiteSpace={breakSpaces ? "break-spaces" : "nowrap"}
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
            bg={nullable ? "green.500" : bg}
            {...rowProps}
        >
            {canEdit ? (
                editable && nullable ? (
                    <Input
                        autoComplete={"off"}
                        maxW="90px"
                        size="sm"
                        fontSize="14px"
                        h="24px"
                        bg="green.500"
                        color="white"
                        type="number"
                        onChange={onEdit(item)}
                        value={getValueForEdit(item)}
                        _active={{
                            borderColor: "white",
                        }}
                        _focus={{
                            borderColor: "white",
                        }}
                    />
                ) : render ? (
                    render(item, index)
                ) : animated ? (
                    <AnimatedNumber number={Number(value)} />
                ) : (
                    <>
                        {renderCellValue(value, zeroText ?? "--/--")}

                        {helperText && (
                            <Text
                                lineHeight={1.2}
                                mt={{
                                    base: 0.5,
                                    sm: 1,
                                }}
                                fontSize=".75em"
                                color="blue.500"
                                {...helperTextProps}
                            >
                                {helperText(item)}
                            </Text>
                        )}
                    </>
                )
            ) : render ? (
                render(item, index)
            ) : animated ? (
                <AnimatedNumber number={Number(value)} />
            ) : (
                <>
                    {renderCellValue(value, zeroText ?? "--/--")}
                    {helperText && (
                        <Text
                            lineHeight={1.2}
                            mt={{
                                base: 0.5,
                                sm: 1,
                            }}
                            fontSize=".75em"
                            color="blue.500"
                            {...helperTextProps}
                        >
                            {helperText(item)}
                        </Text>
                    )}
                </>
            )}
        </Td>
    );
};

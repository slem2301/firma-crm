/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useSearchParamsState } from "./useQueryParamsState";

export type useSortOptions<T> = {
    paramName?: string;
    defaultValue?: sortValueType;
    signature: T;
    defaultKey: keyof T;
};

export type sortValueType = "ASC" | "DESC";

export type sortType<T> = {
    key: keyof T;
    value: sortValueType;
};

function parseParamToSort<T>(
    param: string,
    defaultKey: keyof T,
    defaultValue: string,
    signature: T
) {
    const [_key, _value] = param.split("|");

    const key = signature[_key as keyof T] ? _key : defaultKey;

    let value = _value ? _value.toUpperCase() : defaultValue;
    if (value !== "ASC" && value !== "DESC") value = defaultValue;

    return { key: key as keyof T, value: value as sortValueType };
}

export function useSort<T>({
    paramName = "sort",
    defaultValue = "ASC",
    defaultKey,
    signature,
}: useSortOptions<T>) {
    const [sort, setStateSort] = useSearchParamsState<sortType<T>>({
        name: paramName,
        serialize: (sort) => {
            if (sort.key === defaultKey && sort.value === defaultValue)
                return "";

            return `${sort.key.toString()}|${sort.value}`;
        },
        deserialize: (value) =>
            parseParamToSort<T>(
                value || "",
                defaultKey,
                defaultValue,
                signature
            ),
    });

    const setSort = useCallback((key: string, value: sortValueType) => {
        setStateSort({ key: key as keyof T, value });
    }, []);

    return { sort, setSort };
}

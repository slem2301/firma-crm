import { useMemo, useCallback } from "react";
import { useSearchParamsState } from "./useQueryParamsState";
import { deserializeFilter, serializeFilter } from "../utils/filters";

export const useStringFilterSearchParamsState = <Item extends { id: string }>(
    name: string,
    items: Item[]
) => {
    const defaultValues = useMemo(() => items.map((item) => item.id), [items]);

    const serialize = useMemo(() => serializeFilter(items), [items]);
    const deserialize = useMemo(
        () => deserializeFilter(defaultValues),
        [defaultValues]
    );

    const [rawIds, setRawIds] = useSearchParamsState<string[]>({
        name,
        serialize,
        deserialize,
    });

    const ids = useMemo(() => {
        const arr = Array.isArray(rawIds) ? rawIds : [];
        // гарантируем string[]
        return arr.map(String).filter(Boolean);
    }, [rawIds]);

    const setIds = useCallback((next: string[]) => setRawIds(next), [setRawIds]);

    return [ids, setIds] as const;
};

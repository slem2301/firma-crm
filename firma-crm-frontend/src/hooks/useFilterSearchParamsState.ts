import { useMemo, useCallback } from "react";
import { useSearchParamsState } from "./useQueryParamsState";
import { deserializeFilter, serializeFilter } from "../utils/filters";

export const useFilterSearchParamsState = <Item extends { id: number }>(
    name: string,
    items: Item[]
) => {
    const defaultValues = useMemo(() => items.map((item) => item.id), [items]);

    // Важно: мемоизируем serialize/deserialize, чтобы не пересоздавались на каждый рендер
    const serialize = useMemo(() => serializeFilter(items), [items]);
    const deserialize = useMemo(
        () => deserializeFilter(defaultValues),
        [defaultValues]
    );

    const [rawIds, setRawIds] = useSearchParamsState({
        name,
        serialize,
        deserialize,
    });

    // Приводим к number[] гарантированно
    const ids = useMemo(() => {
        const arr = Array.isArray(rawIds) ? rawIds : [];
        return arr
            .map((v) => Number(v))
            .filter((v) => Number.isFinite(v));
    }, [rawIds]);

    // setIds тоже стабилизируем
    const setIds = useCallback(
        (next: number[]) => setRawIds(next),
        [setRawIds]
    );

    return [ids, setIds] as const;
};

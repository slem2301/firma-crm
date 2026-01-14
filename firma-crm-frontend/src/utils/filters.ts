import {
    DeserializeFunction,
    SerializeFunction,
} from "../hooks/useQueryParamsState";

export type FilterId = string | number;

export const getPropForSearchParams = (ids: FilterId[], items: any[]) =>
    ids.length === items.length ? "" : JSON.stringify(ids);

export const deserializeFilter =
    <T extends FilterId>(defaultValues: T[]): DeserializeFunction<T[]> =>
        (value) => {
            if (!value) return defaultValues;

            try {
                const parsed = JSON.parse(value) as T[];
                return Array.isArray(parsed) ? parsed : defaultValues;
            } catch (e) {
                return defaultValues;
            }
        };

export const serializeFilter =
    <T extends FilterId, Item>(items: Item[]): SerializeFunction<T[]> =>
        (value) =>
            getPropForSearchParams(value, items);

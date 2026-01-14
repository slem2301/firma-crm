import { useState, useRef, useEffect } from "react";
import { useEvent } from "./useEvent";
import { isFunction } from "../utils/typeGuards";

function getSearchParam(search: string, param: string) {
    const searchParams = new URLSearchParams(search);
    return searchParams.get(param);
}

function setSearchParam(search: string, param: string, value: string) {
    const searchParams = new URLSearchParams(search);
    if (value) searchParams.set(param, value);
    else searchParams.delete(param);
    return searchParams.toString();
}

export type DeserializeFunction<Value> = (value: string | null) => Value;
export type SerializeFunction<Value> = (value: Value) => string;

const defaultDeserialize = <Value>(v: string | null) => v as unknown as Value;
const defaultSerialize = String;

interface UseSearchParamsStateOptions<Value> {
    name: string;
    serialize?: SerializeFunction<Value>;
    deserialize?: DeserializeFunction<Value>;
    historyMode?: "push" | "replace"; // ✅ добавили
}

export function useSearchParamsState<Value>({
    name,
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    historyMode = "replace", // ✅ по умолчанию replace, чтобы не засирать history
}: UseSearchParamsStateOptions<Value>) {
    const [value, setValue] = useState(() => {
        return deserialize(getSearchParam(window.location.search, name));
    });

    // ✅ чтобы functional update всегда брал актуальное значение
    const valueRef = useRef(value);
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const updateValue = useEvent((newValue: React.SetStateAction<Value>) => {
        const prev = valueRef.current;
        const next = isFunction(newValue) ? newValue(prev) : newValue;

        // ✅ 1) если значение стейта не меняется — вообще ничего не делаем
        if (Object.is(prev, next)) return;

        const currentInUrl = getSearchParam(window.location.search, name) ?? "";
        const nextSerialized = serialize(next) ?? "";

        // ✅ 2) если в URL уже то же самое — обновляем только state (или вообще можно return)
        // Обычно лучше return, чтобы не провоцировать лишние ререндеры/эффекты
        if (currentInUrl === nextSerialized) {
            setValue(next);
            return;
        }

        setValue(next);

        const newSearch = setSearchParam(window.location.search, name, nextSerialized);
        const nextUrl = newSearch ? `?${newSearch}` : window.location.pathname;

        if (historyMode === "push") {
            window.history.pushState(null, "", nextUrl);
        } else {
            window.history.replaceState(null, "", nextUrl);
        }
    });

    return [value, updateValue] as const;
}

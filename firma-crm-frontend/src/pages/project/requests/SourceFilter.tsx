import { useEffect } from "react";
import SingleSelectFilter, {
    optionType,
} from "../../../components/filters/SingleSelectFilter";
import { useSearchParamsState } from "../../../hooks/useQueryParamsState";

interface SourceFilterProps {
    setSource: (value: string) => void;
    source: string;
    syncWithQuery?: boolean;
}

const options: optionType<string>[] = [
    {
        name: "Все",
        value: "all",
    },
    {
        name: "Google",
        value: "google",
    },
    {
        name: "Yandex",
        value: "yandex",
    },
    {
        name: "Facebook",
        value: "facebook",
    },
];

export const SourceFilter = ({
    setSource,
    source,
    syncWithQuery = true,
}: SourceFilterProps) => {
    const [value, setValue] = useSearchParamsState<string>({
        name: "source",
        serialize: (value) => {
            if (!syncWithQuery) return "";

            return value === "all" ? "" : value;
        },
        deserialize: (value) => {
            if (!value) return source;
            if (!syncWithQuery) return source;

            return value;
        },
    });

    useEffect(() => {
        setSource(value);
    }, [value, setSource]);

    return (
        <SingleSelectFilter
            setValue={setValue}
            options={options}
            paired
            defaultValue={value}
        />
    );
};

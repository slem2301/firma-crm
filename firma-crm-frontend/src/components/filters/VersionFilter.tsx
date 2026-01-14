import { ButtonProps, Flex, Spinner } from "@chakra-ui/react";
import { format, isValid } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { useSearchParams } from "../../hooks/useSearchParams";
import SingleSelectFilter from "./SingleSelectFilter";

type PriceVersionFilterProps = {
    setVersion: (value: number) => void;
    version: number;
    props?: ButtonProps;
    withNew?: boolean;
    withoutSearch?: boolean;
};

export const PriceVersionFilter: React.FC<PriceVersionFilterProps> = ({
    setVersion,
    props,
    withNew,
    withoutSearch,
}) => {
    const { versions } = useAppSelector((state) => state.price);
    const { params, setParam } = useSearchParams();


    const items = useMemo(() => {
        const _items = versions.map((version) => {
            const d = new Date(version.date as any);
            const dateLabel = isValid(d) ? format(d, "dd.MM.yyyy") : "—";

            return {
                value: version.version,
                name: `${version.name} от ${dateLabel}`,
            };
        });

        if (withNew || !_items.length) {
            const newVersion = _items.length ? _items[0].value + 1 : 1;
            _items.unshift({
                value: -1,
                name: `v${newVersion} (новый)`,
            });
        }

        return _items;
    }, [versions, withNew]);

    const defaultValue = useMemo(() => {
        const version = Number(params["version"]);

        // если без поиска — просто первый элемент
        if (withoutSearch) return items[0]?.value || 1;

        // если version нет/NaN/0/отрицательный — берем первую доступную версию
        if (!version || Number.isNaN(version) || version <= 0) return items[0]?.value || 1;

        // если version есть, но такой версии нет в items — тоже берем первую
        const exists = items.some((it) => it.value === version);
        return exists ? version : (items[0]?.value || 1);
    }, [items, params, withoutSearch]);


    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setVersion(value);
        if (!withoutSearch) setParam("version", value.toString());
    }, [value, setVersion, setParam, withoutSearch]);


    if (!items.length)


        return (
            <Flex
                borderWidth={1}
                rounded={2}
                w={"100px"}
                h="32px"
                align="center"
                justify={"center"}
            >
                <Spinner h={"15px"} w={"15px"} />
            </Flex>
        );

    return (
        <SingleSelectFilter
            options={items}
            setValue={setValue}
            defaultValue={value}
            paired
            selectProps={props}
        />
    );
};




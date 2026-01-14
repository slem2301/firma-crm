/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "../../hooks/redux";
import SelectFilter from "./SelectFilter";
import { useFilterSearchParamsState } from "../../hooks/useFilterSearchParamsState";

type CountryFilterProps = {
    setCoutryIds: (value: number[]) => void;
    clearTigger?: boolean;
};

const normalizeIds = (value: any): number[] => {
    if (!Array.isArray(value)) return [];
    return value
        .map((v) => Number(v))
        .filter((n) => Number.isFinite(n) && n !== 0);
};

const CountryFilter: React.FC<CountryFilterProps> = ({
    setCoutryIds: setIds,
    clearTigger,
}) => {
    const countries = useAppSelector((state) => state.country.countries);

    const [rawCountryIds, setCountryIds] = useFilterSearchParamsState(
        "countries",
        countries
    );

    const countryIds = useMemo(
        () => normalizeIds(rawCountryIds),
        [rawCountryIds]
    );

    useEffect(() => {
        setIds(countryIds);
    }, [countryIds]);

    return (
        <SelectFilter
            clearTrigger={clearTigger}
            filterName="Регион"
            items={countries}
            setFilter={setCountryIds}
            defaultValues={countryIds}
        />
    );
};

export default CountryFilter;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import SelectFilter from "./SelectFilter";
import { useFilterSearchParamsState } from "../../hooks/useFilterSearchParamsState";

type CurrencyFilterProps = {
    setIds: (values: number[]) => void;
    clearTrigger?: boolean;
};

const CurrencyFilter: React.FC<CurrencyFilterProps> = ({
    setIds,
    clearTrigger,
}) => {
    const currencies = useAppSelector((state) => state.currency.currencies);

    const [ids, setStateIds] = useFilterSearchParamsState(
        "currency",
        currencies
    );

    useEffect(() => {
        setIds(ids);
    }, [ids, setIds]);

    return (
        <SelectFilter
            clearTrigger={clearTrigger}
            filterName="Валюта"
            items={currencies}
            setFilter={setStateIds}
            defaultValues={ids}
        />
    );
};

export default CurrencyFilter;

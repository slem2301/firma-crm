import React, { useCallback, useEffect, useMemo } from "react";
import SingleSelectFilter, {
    optionType,
} from "../../../components/filters/SingleSelectFilter";
import { useAppSelector } from "../../../hooks/redux";
import { useSearchParams } from "../../../hooks/useSearchParams";
import { CostBalanceType } from "../../../models/cost/ICost";

interface CurrencyFilterProps {
    setCurrencyId: (id: number) => void;
    currencyId: number;
    balanceType: CostBalanceType;
}

const CurrencyFilter: React.FC<CurrencyFilterProps> = ({
    setCurrencyId,
    balanceType,
    currencyId,
}) => {
    const { params, setParam } = useSearchParams();
    const currencies = useAppSelector((state) => state.currency.currencies);

    const [options, ids] = useMemo(() => {
        const ids: number[] = [];
        const options: optionType<number>[] = [];

        currencies
            .filter((currency) => {
                if (balanceType === "RU") return currency.key === "RU";

                return true;
            })
            .forEach((currency) => {
                ids.push(currency.id);
                options.push({
                    name: currency.name + " " + currency.symbol,
                    value: currency.id,
                });
            });

        return [options, ids] as const;
    }, [currencies, balanceType]);

    const setValue = useCallback(
        (value: number) => {
            setParam("currencyId", value.toString());
            setCurrencyId(value);
        },
        [setParam, setCurrencyId]
    );

    useEffect(() => {
        const param = Number(params.currencyId);
        if (param) {
            if (ids.includes(param)) return setValue(param);
        }

        setValue(ids[0]);
    }, [ids, setValue, params.currencyId]);

    return (
        <SingleSelectFilter<number>
            options={options}
            setValue={setValue}
            defaultValue={currencyId}
            paired
        />
    );
};

export default CurrencyFilter;

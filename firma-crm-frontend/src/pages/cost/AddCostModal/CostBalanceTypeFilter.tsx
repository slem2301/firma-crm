import { useConst } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SingleSelectFilter from "../../../components/filters/SingleSelectFilter";
import { useSearchParams } from "../../../hooks/useSearchParams";
import { CostBalanceType, COST_BALANCE_TYPE } from "../../../models/cost/ICost";

interface CostBalanceTypeFilterProps {
    setBalanceType: (balanceType: CostBalanceType) => void;
    balanceType: CostBalanceType;
}

const typeAssociations: Record<CostBalanceType, string> = {
    USD: "Основной баланс",
    RU: "Баланс РФ",
};

const CostBalanceTypeFilter: React.FC<CostBalanceTypeFilterProps> = ({
    setBalanceType,
    balanceType,
}) => {
    const { params, setParam } = useSearchParams();

    const defaultValue: CostBalanceType = useConst(() => {
        if (params.balanceType) {
            const param = params.balanceType as CostBalanceType;
            if (Object.values(COST_BALANCE_TYPE).includes(param)) return param;
        }

        return "USD";
    });

    const options = useConst(() =>
        Object.values(COST_BALANCE_TYPE).map((type) => ({
            name: typeAssociations[type],
            value: type,
        }))
    );

    const setValue = (value: CostBalanceType) => {
        setBalanceType(value);
    };

    useEffect(() => {
        setParam("balanceType", balanceType);
    }, [balanceType, setParam]);

    return (
        <SingleSelectFilter<CostBalanceType>
            options={options}
            setValue={setValue}
            defaultValue={defaultValue}
        />
    );
};

export default CostBalanceTypeFilter;

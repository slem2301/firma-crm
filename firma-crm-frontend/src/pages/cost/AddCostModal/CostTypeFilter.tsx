import { useConst } from "@chakra-ui/react";
import React, { useEffect } from "react";
import SingleSelectFilter from "../../../components/filters/SingleSelectFilter";
import { useSearchParams } from "../../../hooks/useSearchParams";
import { CostType, COST_TYPE } from "../../../models/cost/ICost";

interface CostTypeFilterProps {
    setType: (type: CostType) => void;
    type: CostType;
}

const typeAssociations: Record<CostType, string> = {
    PAYMENT: "Платёж",
    REFILL: "Пополнение",
    ACCOUNT: "Счёт",
};

const CostTypeFilter: React.FC<CostTypeFilterProps> = ({ setType, type }) => {
    const { params, setParam } = useSearchParams();

    const defaultValue: CostType = useConst(() => {
        if (params.type) {
            const param = params.type as CostType;
            if (Object.values(COST_TYPE).includes(param)) return param;
        }

        return "PAYMENT";
    });

    const options = useConst(() =>
        Object.values(COST_TYPE)
            .filter((type) => {
                if (type === "ACCOUNT" && params.accountId) return false;

                return true;
            })
            .map((type) => ({
                name: typeAssociations[type],
                value: type,
            }))
    );

    const setValue = (value: CostType) => {
        setType(value);
    };

    useEffect(() => {
        setParam("type", type);
    }, [type, setParam]);

    return (
        <SingleSelectFilter<CostType>
            options={options}
            setValue={setValue}
            defaultValue={defaultValue}
        />
    );
};

export default CostTypeFilter;

import React, { useCallback, useEffect, useMemo } from "react";
import SingleSelectFilter, {
    optionType,
} from "../../../components/filters/SingleSelectFilter";
import { useSearchParams } from "../../../hooks/useSearchParams";
import { ICostCategory } from "../../../models/cost";
import { CostBalanceType } from "../../../models/cost/ICost";

interface CategoryFilterProps {
    categoryId: number;
    setCategoryId: (id: number) => void;
    categories: ICostCategory[];
    balanceType: CostBalanceType;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categoryId,
    setCategoryId,
    categories,
    balanceType,
}) => {
    const { params, setParam } = useSearchParams();

    const [options, ids] = useMemo(() => {
        const ids: number[] = [];
        const options: optionType<number>[] = [];

        categories
            .filter((category) => category.balanceType === balanceType)
            .forEach((category) => {
                ids.push(category.id);
                options.push({ name: category.name, value: category.id });
            });

        return [options, ids] as const;
    }, [categories, balanceType]);

    const setValue = useCallback(
        (value: number) => {
            setParam("categoryId", value.toString());
            setCategoryId(value);
        },
        [setParam, setCategoryId]
    );

    useEffect(() => {
        const param = Number(params.categoryId);
        if (param) {
            if (ids.includes(param)) return setValue(param);
        }

        setValue(ids[0]);
    }, [ids, setValue, params.categoryId]);

    return (
        <SingleSelectFilter<number>
            setValue={setValue}
            paired
            defaultValue={categoryId}
            options={options}
        />
    );
};

export default CategoryFilter;

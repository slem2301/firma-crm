import React, { useEffect } from "react";
import { GREEN_LIMIT, ORANGE_LIMIT, RED_LIMIT } from "../../const/colors";
import SelectFilter, { SelectFilterItem } from "./SelectFilter";
import { useFilterSearchParamsState } from "../../hooks/useFilterSearchParamsState";
import { BalanceLimitZone } from "../../models/IAd";

export const limits: SelectFilterItem<number>[] = [
    {
        name: "Зеленая",
        id: 1,
        props: {
            bg: GREEN_LIMIT,
        },
    },
    {
        name: "Ораньжевая",
        id: 2,
        props: {
            bg: ORANGE_LIMIT,
        },
    },
    {
        name: "Красная",
        id: 3,
        props: {
            bg: RED_LIMIT,
        },
    },
];

const limitZones: Record<number, BalanceLimitZone> = {
    1: "GREEN_ZONE",
    2: "ORANGE_ZONE",
    3: "RED_ZONE",
};

type SetSelectedLimitHandler = (
    value: Record<BalanceLimitZone, boolean>
) => void;

type LimitFilterProps = {
    setSelectedLimits: SetSelectedLimitHandler;
    clearTrigger?: boolean;
};

const LimitFilter: React.FC<LimitFilterProps> = ({
    setSelectedLimits,
    clearTrigger,
}) => {
    const [limitIds, setLimitIds] = useFilterSearchParamsState("limits", limits);

    useEffect(() => {
        const zones: Record<BalanceLimitZone, boolean> = {} as Record<
            BalanceLimitZone,
            boolean
        >;

        limitIds.forEach((id) => {
            zones[limitZones[id] as BalanceLimitZone] = true;
        });

        setSelectedLimits(zones);
    }, [limitIds, setSelectedLimits]);

    return (
        <SelectFilter
            filterName="Зона"
            items={limits}
            clearTrigger={clearTrigger}
            setFilter={setLimitIds}
            defaultValues={limitIds}
        />
    );
};

export default LimitFilter;

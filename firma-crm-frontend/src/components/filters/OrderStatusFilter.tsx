/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import SelectFilter from "./SelectFilter";
import { useFilterSearchParamsState } from "../../hooks/useFilterSearchParamsState";

type OrderStatusFilterProps = {
    setIds: (ids: number[]) => void;
    clearTigger?: boolean;
};

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({
    setIds,
    clearTigger,
}) => {
    const statuses = useAppSelector((state) => state.order.statuses);

    const [ids, setStateIds] = useFilterSearchParamsState(
        "order_status",
        statuses
    );

    useEffect(() => {
        setIds(ids);
    }, [ids]);

    return (
        <SelectFilter
            clearTrigger={clearTigger}
            filterName="Статус"
            items={statuses}
            setFilter={setStateIds}
            defaultValues={ids}
        />
    );
};

export default OrderStatusFilter;

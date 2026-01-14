/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import SelectFilter from "./SelectFilter";
import { useFilterSearchParamsState } from "../../hooks/useFilterSearchParamsState";

type OrderTypeFilterProps = {
    setIds: (ids: number[]) => void;
    clearTigger?: boolean;
};

const OrderTypeFilter: React.FC<OrderTypeFilterProps> = ({
    setIds,
    clearTigger,
}) => {
    const types = useAppSelector((state) => state.order.types);

    const [ids, setStateIds] = useFilterSearchParamsState("order_type", types);

    useEffect(() => {
        setIds(ids);
    }, [ids]);

    return (
        <SelectFilter
            clearTrigger={clearTigger}
            filterName="Тип заказа"
            items={types}
            setFilter={setStateIds}
            defaultValues={ids}
        />
    );
};

export default OrderTypeFilter;

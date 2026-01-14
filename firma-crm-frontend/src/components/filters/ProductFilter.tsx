/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "../../hooks/redux";
import SelectFilter from "./SelectFilter";
import { useFilterSearchParamsState } from "../../hooks/useFilterSearchParamsState";

type ProductFilterProps = {
    setIds: (ids: number[]) => void;
    clearTigger?: boolean;
};

const normalizeIds = (value: any): number[] => {
    if (!Array.isArray(value)) return [];
    return value
        .map((v) => Number(v))
        .filter((n) => Number.isFinite(n) && n !== 0);
};

const ProductFilter: React.FC<ProductFilterProps> = ({
    setIds,
    clearTigger,
}) => {
    const products = useAppSelector((state) => state.product.products);

    const [rawIds, setProductIds] = useFilterSearchParamsState(
        "products",
        products
    );

    const ids = useMemo(() => normalizeIds(rawIds), [rawIds]);

    useEffect(() => {
        setIds(ids);
    }, [ids]);

    return (
        <SelectFilter
            clearTrigger={clearTigger}
            filterName="Продукт"
            items={products}
            setFilter={setProductIds}
            defaultValues={ids}
        />
    );
};

export default ProductFilter;

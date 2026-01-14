import { Checkbox, Flex, useBoolean, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import ProductFilter from "../../../components/filters/ProductFilter";
import UpdateButton from "../../../components/ui/button/UpdateButton";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useClearTrigger } from "../../../hooks/useClearTrigger";
import { setPeriod } from "../../../store/slices/app-slice";
import {
    getCurrentPeriod,
    getMonthPeriod,
} from "../../../utils/getCurrentPeriod";
import AddSale from "./addSale/AddSale";
import SalesTable from "./SalesTable";

const CommonSalesStatisticks = () => {
    const {
        country: { countries },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    const [compare, setCompare] = useBoolean();
    const { clearTrigger: trigger, invokeTrigger } = useClearTrigger();
    const [productIds, setProductIds] = useState<number[]>([]);

    useEffect(() => {
        return () => {
            const [from, to] = getCurrentPeriod();
            dispatch(setPeriod([from, to]));
        };
    }, [dispatch]);

    useEffect(() => {
        const [from, to] = getMonthPeriod(true);
        dispatch(setPeriod([from, to]));
    }, [dispatch]);

    const update = useCallback(() => {
        invokeTrigger();
    }, [invokeTrigger]);

    return (
        <VStack align={"flex-start"}>
            <Flex gap={2} flexWrap="wrap" align="center">
                <AddSale update={update} />
                <ProductFilter setIds={setProductIds} />
                <Checkbox isChecked={compare} onChange={setCompare.toggle}>
                    Сравнить
                </Checkbox>
                <UpdateButton onClick={update} />
            </Flex>
            {countries.map((country) => (
                <SalesTable
                    productIds={productIds}
                    compare={compare}
                    trigger={trigger}
                    key={country.id}
                    region={country}
                />
            ))}
        </VStack>
    );
};

export default CommonSalesStatisticks;

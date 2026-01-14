import { Flex, HStack, VStack } from "@chakra-ui/react";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import CountryFilter from "../../../components/filters/CountryFilter";
import CurrencyFilter from "../../../components/filters/CurrencyFilter";
import LimitFilter from "../../../components/filters/LimitFilter";
import ProductFilter from "../../../components/filters/ProductFilter";
import SingleSelectFilter from "../../../components/filters/SingleSelectFilter";
import { TableHeader } from "../../../components/table/Header";
import Table from "../../../components/table/Table";
import ClearFiltersButton from "../../../components/ui/button/ClearFiltersButton";
import UpdateButton from "../../../components/ui/button/UpdateButton";
import SearchInput from "../../../components/ui/search-input/SearchInput";
import { SUCCESS_POST } from "../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useClearTrigger } from "../../../hooks/useClearTrigger";
import { useSort, useSortOptions } from "../../../hooks/useSort";
import {
    getBalanceStatisticksSignature,
    IBalanceStatisticks,
} from "../../../models/IStatisticks";
import statisticksService from "../../../services/statisticks-service";
import { setPeriod } from "../../../store/slices/app-slice";
import {
    getCurrentPeriod,
    getMonthPeriod,
} from "../../../utils/getCurrentPeriod";
import { MoneyText } from "../../price/Price";
import UpdateBalance from "./UpdateBalance";
import { getBalanceZone } from "./utils";
import { BalanceLimitZone } from "../../../models/IAd";

type adType = "google" | "yandex";

const TYPES: {
    [key: string]: {
        name: string;
        value: adType;
    };
} = {
    google: {
        name: "Google",
        value: "google",
    },
    yandex: {
        name: "Яндекс",
        value: "yandex",
    },
};

const keyIsUnvalid = (key: string) => {
    if (key === "id") return true;
    if (key === "login") return true;
    if (key === "balance") return true;
    if (key === "delay") return true;
    if (key === "balanceUSD") return true;
    if (key === "delayUSD") return true;
    if (key === "total") return true;
    if (key === "currency") return true;

    return false;
};

const BalanceStatisticks = () => {
    const dispatch = useAppDispatch();
    const { period } = useAppSelector((state) => state.app);
    const balanceLimits = useAppSelector((state) => state.ad.balanceLimits);

    const defaultSortOptions: useSortOptions<IBalanceStatisticks> = useMemo(
        () => ({
            defaultKey: "login",
            defaultValue: "ASC",
            signature: getBalanceStatisticksSignature(period.from, period.to),
        }),
        [period]
    );

    const { clearTrigger, invokeTrigger } = useClearTrigger();

    const [type, setType] = useState<adType>(TYPES.yandex.value);
    const [productIds, setProductIds] = useState<number[]>([]);
    const [regionIds, setRegionIds] = useState<number[]>([]);
    const [selectedLimits, setSelectedLimits] = useState<
        Record<BalanceLimitZone, boolean>
    >({} as Record<BalanceLimitZone, boolean>);
    const [currencyIds, setCurrencyIds] = useState<number[]>([]);
    const { sort, setSort } = useSort<IBalanceStatisticks>(defaultSortOptions);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [isTransition, startTransition] = useTransition();

    const [items, setItems] = useState<IBalanceStatisticks[]>([]);
    const [sortedItems, setSortedItems] = useState<IBalanceStatisticks[]>([]);
    const [dateCols, setDateCols] = useState<
        TableHeader<IBalanceStatisticks>[]
    >([]);

    const fetchStatisticks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await statisticksService.getBalance({
                search,
                period,
                filter: {
                    countryIds: regionIds,
                    productIds,
                    currencyIds,
                },
                sort: {
                    key: sort.key as string,
                    value: sort.value,
                },
                type,
            });

            if (response.status === SUCCESS_POST) {
                setItems(response.data);
            }
        } catch (e) {}
    }, [period, search, regionIds, productIds, sort, type, currencyIds]);

    const getNameCol = useCallback((props?: any) => {
        return {
            name: "Логин",
            key: "login",
            ...commonColProps,
            ...props,
        };
    }, []);

    useEffect(() => {
        fetchStatisticks();
    }, [fetchStatisticks]);

    useEffect(() => {
        startTransition(() => {
            setSortedItems(
                items.filter((item) => {
                    const zone = getBalanceZone(
                        item.balance,
                        item.currency.key,
                        balanceLimits
                    );

                    return Object.entries(selectedLimits)
                        .filter((entry) => entry[1])
                        .map((entry) => entry[0])
                        .includes(zone);
                })
            );

            if (items.length > 1) {
                setDateCols(
                    Object.keys(items[1])
                        .filter((key) => !keyIsUnvalid(key))
                        .map((key) => ({
                            name: key,
                            key,
                            ...commonColProps,
                            render: (item: IBalanceStatisticks) => {
                                const value = item[key] as string;

                                return value ? (
                                    <MoneyText value="$">{value}</MoneyText>
                                ) : (
                                    "--"
                                );
                            },
                        }))
                );
            }
        });
    }, [items, selectedLimits, balanceLimits]);

    useEffect(() => {
        setLoading(isTransition);
    }, [isTransition]);

    useEffect(() => {
        return () => {
            const currentPeriod = getCurrentPeriod();
            dispatch(setPeriod([currentPeriod[0], currentPeriod[1]]));
        };
    }, [dispatch]);

    useEffect(() => {
        const [from, to] = getMonthPeriod(true);
        dispatch(setPeriod([from, to]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <VStack align="stretch">
            <Flex gap={2} align="center" flexWrap={"wrap"}>
                <SearchInput
                    placeholder="Поиск: Логин"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <SingleSelectFilter<adType>
                    setValue={setType}
                    options={Object.values(TYPES)}
                    defaultValue={type}
                />
                <LimitFilter
                    clearTrigger={clearTrigger}
                    setSelectedLimits={setSelectedLimits}
                />
                <CurrencyFilter
                    clearTrigger={clearTrigger}
                    setIds={setCurrencyIds}
                />
                <ProductFilter
                    clearTigger={clearTrigger}
                    setIds={setProductIds}
                />
                <CountryFilter
                    clearTigger={clearTrigger}
                    setCoutryIds={setRegionIds}
                />
                <ClearFiltersButton onClick={invokeTrigger} />
                <UpdateButton onClick={fetchStatisticks} isLoading={loading} />
            </Flex>
            <ScrollSync>
                <HStack w={"100%"} spacing={0}>
                    <ScrollSyncPane>
                        <Table<IBalanceStatisticks>
                            withoutSpinner
                            loadingOverlay={loading}
                            sort={{ ...defaultSortOptions, onSort: setSort }}
                            maxH={"74vh"}
                            props={{
                                className: "table-without-scroll",
                                minW: { base: "100%", md: "250px" },
                                w: { base: "100%", md: "250px" },
                                alignSelf: "stretch",
                                display: { base: "none", md: "block" },
                                borderRightRadius: 0,
                                borderRightWidth: 0,
                                style: { scrollbarWidth: "none" },
                            }}
                            headers={[
                                {
                                    name: "",
                                    render: (item) => {
                                        if (!item.id) return null;

                                        return (
                                            <UpdateBalance
                                                update={fetchStatisticks}
                                                ad={item}
                                                type={type}
                                            />
                                        );
                                    },
                                    props: {
                                        w: "40px",
                                        pr: 0,
                                        bg: "white",
                                    },
                                    rowProps: {
                                        pr: 0,
                                        py: 0.5,
                                    },
                                },
                                getNameCol(),
                            ]}
                            rows={sortedItems}
                        />
                    </ScrollSyncPane>
                    <ScrollSyncPane>
                        <Table<IBalanceStatisticks>
                            loadingOverlay={loading}
                            sort={{ ...defaultSortOptions, onSort: setSort }}
                            maxH={"74vh"}
                            props={{
                                className: "table-with-beauty-scroll",
                                borderLeftRadius: { base: 8, md: 0 },
                                borderLeftWidth: { base: 1, md: 0 },
                                w: { base: "100%", md: "calc(100% - 200px)" },
                            }}
                            headers={[
                                getNameCol({
                                    props: {
                                        display: {
                                            base: "table-cell",
                                            md: "none",
                                        },
                                        fontSize: "10px",
                                        px: 2,
                                    },
                                    rowProps: {
                                        display: {
                                            base: "table-cell",
                                            md: "none",
                                        },
                                    },
                                }),
                                {
                                    name: "Баланс",
                                    key: "balanceUSD",
                                    render: (item) => (
                                        <MoneyText value={item.currency.symbol}>
                                            {item.balance}
                                        </MoneyText>
                                    ),
                                    limits: balanceLimits,
                                    getLimitValue: (item) => [
                                        item.balance,
                                        item.currency.key,
                                    ],
                                    ...commonColProps,
                                },
                                {
                                    name: "Отсрочка",
                                    key: "delayUSD",
                                    render: (item) => (
                                        <MoneyText value={item.currency.symbol}>
                                            {item.delay}
                                        </MoneyText>
                                    ),
                                    ...commonColProps,
                                    props: {
                                        fontSize: "10px",
                                        px: 2,
                                        display:
                                            type === "yandex"
                                                ? "table-cell"
                                                : "none",
                                    },
                                },
                                {
                                    name: "Всего",
                                    key: "total",
                                    render: (item) => (
                                        <MoneyText
                                            value={item.total ? "$" : ""}
                                        >
                                            {item.total || "--"}
                                        </MoneyText>
                                    ),
                                },
                                ...dateCols,
                            ]}
                            rows={sortedItems}
                        />
                    </ScrollSyncPane>
                </HStack>
            </ScrollSync>
        </VStack>
    );
};

const commonColProps: any = {
    props: {
        fontSize: "10px",
        px: 2,
    },
    rowProps: {
        h: "35px",
    },
};

export default BalanceStatisticks;

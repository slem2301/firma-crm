/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Flex, HStack, Text, VStack, Link } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { VscClose, VscEdit } from "react-icons/vsc";
import { Link as NavLink } from "react-router-dom";
import CountryFilter from "../../../components/filters/CountryFilter";
import ProductFilter from "../../../components/filters/ProductFilter";
import SingleSelectFilter from "../../../components/filters/SingleSelectFilter";
import { TableHeader } from "../../../components/table/Header";
import Table from "../../../components/table/Table";
import { SUCCESS_POST } from "../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import {
    IExpenseDate,
    IExpenseStatisticks,
} from "../../../models/IStatisticks";
import { ROUTES } from "../../../router/routes";
import statisticksService, {
    getExpensesStatisticksBody,
} from "../../../services/statisticks-service";
import { setPeriod } from "../../../store/slices/app-slice";
import {
    getCurrentPeriod,
    getMonthPeriod,
} from "../../../utils/getCurrentPeriod";
import { getPathWithParam } from "../../../utils/getPathWithParam";
import { MoneyText } from "../../price/Price";
import AddExpense from "./AddExpense";
import UpdateBalance from "./UpdateBalance";
import { setHours } from "date-fns";
import UpdateButton from "../../../components/ui/button/UpdateButton";
import ClearFiltersButton from "../../../components/ui/button/ClearFiltersButton";
import { useClearTrigger } from "../../../hooks/useClearTrigger";
import { useSearchParamsState } from "../../../hooks/useQueryParamsState";

type statType = "yandex" | "total" | "google";

export const EXPENSE_DATE_PATTERN = "dd-MM-yyyy";

const keyIsUnvalid = (key: string) => {
    if (key === "name") return true;
    if (key === "url") return true;
    if (key === "total") return true;
    if (key === "id") return true;
    if (key === "ads") return true;

    return false;
};

const TYPES: {
    [key: string]: {
        value: statType;
        name: string;
    };
} = {
    total: {
        name: "Общая",
        value: "total",
    },
    yandex: {
        name: "Яндекс",
        value: "yandex",
    },
    google: {
        name: "Google",
        value: "google",
    },
};

const DEFAULT_TYPE = TYPES.total;

const ExpenseStatisticks = () => {
    const [isTransition, startTransition] = useTransition();
    const balanceLimits = useAppSelector((state) => state.ad.balanceLimits);

    const { clearTrigger, invokeTrigger } = useClearTrigger();

    const [type, setType] = useSearchParamsState<
        getExpensesStatisticksBody["type"]
    >({
        name: "type",
        serialize: (value) => (value === "total" ? "" : value),
        deserialize: (value) => {
            switch (value) {
                case "google":
                    return "google";
                case "yandex":
                    return "yandex";
                default:
                    return "total";
            }
        },
    });
    const [countryIds, setCountryIds] = useState<number[]>([]);
    const [productIds, setProductIds] = useState<number[]>([]);

    const [items, setItems] = useState<IExpenseStatisticks[]>([]);
    const [editMode, setEditMode] = useSearchParamsState({
        name: "edit_mode",
        serialize: JSON.stringify,
        deserialize: (value) => value === "true",
    });
    const [loading, setLoading] = useState(false);

    const [dateHeaders, setDateHeaders] = useState<
        TableHeader<IExpenseStatisticks>[]
    >([]);

    const {
        app: { period },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    const fetchStatisticks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await statisticksService.getExpenses({
                period: {
                    from: setHours(period.from, 12),
                    to: setHours(period.to, 12),
                },
                type,
                filter: {
                    countryIds: [0, ...countryIds],
                    productIds: [0, ...productIds],
                },
            });
            if (response.status === SUCCESS_POST) {
                setItems(response.data);
            }
        } catch (e) {}
    }, [type, period, countryIds, productIds]);

    useEffect(() => {
        return () => {
            const currentPeriod = getCurrentPeriod();
            dispatch(setPeriod([currentPeriod[0], currentPeriod[1]]));
        };
    }, []);

    useEffect(() => {
        const [from, to] = getMonthPeriod(true);
        dispatch(setPeriod([from, to]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchStatisticks();
    }, [fetchStatisticks]);

    const toggle = () => {
        setEditMode((prev) => !prev);
    };

    useEffect(() => {
        startTransition(() => {
            if (items.length) {
                const dateCols: TableHeader<IExpenseStatisticks>[] = [];
                Object.keys(items[0]).forEach((key) => {
                    if (keyIsUnvalid(key)) return;

                    dateCols.push({
                        name: key,
                        key,
                        ...getCommonColProps(key),
                    });
                });

                setDateHeaders(dateCols);
            }

            setLoading(false);
        });
    }, [items]);

    const update = () => {
        fetchStatisticks();
    };

    const clearFilters = () => {
        setType(DEFAULT_TYPE.value);
        invokeTrigger();
    };

    return (
        <VStack align={"flex-start"}>
            <Flex
                alignItems={"center"}
                gap={2}
                w="100%"
                wrap={{ base: "wrap", md: "nowrap" }}
            >
                <Button
                    minW={"auto"}
                    rounded={2}
                    fontWeight={400}
                    leftIcon={editMode ? <VscClose /> : <VscEdit />}
                    size="sm"
                    colorScheme={editMode ? "green" : "blue"}
                    onClick={toggle}
                >
                    {editMode ? "Отменить" : "Редактирование"}
                </Button>
                <SingleSelectFilter<statType>
                    options={Object.values(TYPES)}
                    setValue={setType}
                    defaultValue={type}
                    paired
                />
                <ProductFilter
                    clearTigger={clearTrigger}
                    setIds={setProductIds}
                />
                <CountryFilter
                    clearTigger={clearTrigger}
                    setCoutryIds={setCountryIds}
                />
                <ClearFiltersButton onClick={clearFilters} />
                <UpdateButton
                    isLoading={loading || isTransition}
                    onClick={fetchStatisticks}
                />
            </Flex>
            <ScrollSync>
                <HStack w={"100%"} spacing={0}>
                    <ScrollSyncPane>
                        <Table<IExpenseStatisticks>
                            withoutSpinner
                            loadingOverlay={loading || isTransition}
                            maxH={"73vh"}
                            sortItems={setItems}
                            props={{
                                className: "table-without-scroll",
                                minW: { base: "100%", md: "350px" },
                                w: { base: "100%", md: "350px" },
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
                                        if (item.id === undefined) return null;

                                        return (
                                            <HStack spacing={1}>
                                                <AddExpense
                                                    update={update}
                                                    item={item}
                                                />
                                                <UpdateBalance
                                                    update={update}
                                                    item={item}
                                                />
                                            </HStack>
                                        );
                                    },
                                    props: {
                                        w: "40px",
                                        pr: 0,
                                        display: editMode
                                            ? "table-cell"
                                            : "none",
                                    },
                                    rowProps: {
                                        pr: 0,
                                        py: 0.5,
                                        display: editMode
                                            ? "table-cell"
                                            : "none",
                                    },
                                },
                                {
                                    name: "Название",
                                    key: "name",
                                    props: {
                                        fontSize: "10px",
                                    },
                                    rowProps: {
                                        h: "35px",
                                    },
                                    render: (item) =>
                                        item.id ? (
                                            <Link
                                                as={NavLink}
                                                target="_blank"
                                                display="inline-block"
                                                to={getPathWithParam(
                                                    ROUTES.projectSettings.path,
                                                    item.id
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <Text display="inline-block">
                                                {item.name}
                                            </Text>
                                        ),
                                },
                            ]}
                            rows={items}
                        />
                    </ScrollSyncPane>
                    <ScrollSyncPane>
                        <Table<IExpenseStatisticks>
                            loadingOverlay={loading || isTransition}
                            maxH={"73vh"}
                            sortItems={setItems}
                            props={{
                                borderLeftRadius: { base: 6, md: 0 },
                                borderLeftWidth: { base: 1, md: 0 },
                                w: { base: "100%", md: "calc(100% - 200px)" },
                            }}
                            headers={[
                                {
                                    name: "Название",
                                    key: "name",
                                    props: {
                                        display: {
                                            base: "table-cell",
                                            md: "none",
                                        },
                                        fontSize: "10px",
                                    },
                                    rowProps: {
                                        display: {
                                            base: "table-cell",
                                            md: "none",
                                        },
                                        h: "35px",
                                    },
                                    render: (item) =>
                                        item.id ? (
                                            <Link
                                                as={NavLink}
                                                target="_blank"
                                                display="inline-block"
                                                to={getPathWithParam(
                                                    ROUTES.projectSettings.path,
                                                    item.id
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <Text display="inline-block">
                                                {item.name}
                                            </Text>
                                        ),
                                },
                                {
                                    name: "Я. Акк. Логин",
                                    ...getCommonColProps("ads", (item) => {
                                        const login = item?.ads?.find(
                                            (ad) => ad.type === "yandex"
                                        )?.login;

                                        return login ? login : "--";
                                    }),
                                },
                                {
                                    name: "G. Баланс",
                                    limits: balanceLimits,
                                    getLimitValue: (item) => [
                                        item.ads.find(
                                            (ad) => ad.type === "google"
                                        )?.balance,
                                        "USD",
                                    ],
                                    ...getCommonColProps(
                                        "ads",
                                        (item) => {
                                            const googleAd = item.ads.find(
                                                (ad) => ad.type === "google"
                                            );

                                            return googleAd
                                                ? googleAd.balance
                                                : "--";
                                        },
                                        (item) => {
                                            const googleAd = item.ads.find(
                                                (ad) => ad.type === "google"
                                            );

                                            return googleAd ? "$" : "";
                                        }
                                    ),
                                },
                                {
                                    name: "Я. Баланс",
                                    limits: balanceLimits,
                                    getLimitValue: (item) => [
                                        item.ads.find(
                                            (ad) => ad.type === "yandex"
                                        )?.balance,
                                        item.ads.find(
                                            (ad) => ad.type === "yandex"
                                        )?.currency.key || "",
                                    ],
                                    ...getCommonColProps(
                                        "ads",
                                        (item) => {
                                            const ad = item.ads.find(
                                                (ad) => ad.type === "yandex"
                                            );

                                            return ad ? ad.balance : "--";
                                        },
                                        (item) => {
                                            const ad = item.ads.find(
                                                (ad) => ad.type === "yandex"
                                            );

                                            return ad ? ad.currency.symbol : "";
                                        }
                                    ),
                                },
                                {
                                    name: "Я. Отсрочка",
                                    sortable: false,
                                    ...getCommonColProps(
                                        "ads",
                                        (item) => {
                                            const ad = item.ads.find(
                                                (ad) => ad.type === "yandex"
                                            );

                                            return ad ? ad.delay : "--";
                                        },
                                        (item) => {
                                            const ad = item.ads.find(
                                                (ad) => ad.type === "yandex"
                                            );

                                            return ad ? ad.currency.symbol : "";
                                        }
                                    ),
                                },
                                {
                                    name: "Всего",
                                    key: "total",
                                    ...getCommonColProps("total"),
                                },
                                ...dateHeaders,
                            ]}
                            rows={items}
                        />
                    </ScrollSyncPane>
                </HStack>
            </ScrollSync>
        </VStack>
    );
};

const getCommonColProps = (
    key: string,
    getValue?: (item: IExpenseStatisticks) => number | string,
    getSymbol?: (item: IExpenseStatisticks) => string
) => ({
    props: {
        fontSize: "10px",
        px: 2,
    },
    rowProps: {
        h: "35px",
    },
    getSortValue: (item: IExpenseStatisticks) => {
        const record = item[key] as IExpenseDate;

        if (!record) return 0;

        let value: any = record?.value;
        value = value === "--" ? 0 : value;

        if (getValue) value = getValue(item);

        return value;
    },
    render: (item: IExpenseStatisticks) => {
        const record = item[key] as IExpenseDate;

        if (!record) return null;

        let value: any = record?.value;
        let symbol = value === "--" ? "" : record?.symbol;

        if (getValue) {
            value = getValue(item);
        }
        if (getSymbol) {
            symbol = getSymbol(item);
        }

        return <MoneyText value={symbol}>{value || 0}</MoneyText>;
    },
});

export default ExpenseStatisticks;

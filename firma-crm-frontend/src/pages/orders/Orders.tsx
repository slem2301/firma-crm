import {
    Box,
    Checkbox,
    Flex,
    HStack,
    Link,
    Text,
    useBoolean,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CountryFilter from "../../components/filters/CountryFilter";
import OrderTypeFilter from "../../components/filters/OrderTypeFilter";
import DealerFilter from "../../components/filters/DealerFilter";
import Page from "../../components/ui/page/Page";
import SearchInput from "../../components/ui/search-input/SearchInput";
import { SUCCESS_POST } from "../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useSort, useSortOptions } from "../../hooks/useSort";
import useTitle from "../../hooks/useTitle";
import { IOrder, orderSignature } from "../../models/IOrder";
import orderService from "../../services/order-service";
import { setPeriod } from "../../store/slices/app-slice";
import Table from "../../components/table/Table";
import { MoneyText } from "../price/Price";
import { format } from "date-fns";
import ShowProduct from "./ShowProduct";
import { useInfinityScroll } from "../../hooks/useInfinityScroll";
import Private from "../../components/private/Private";
import { ROLES, useRoles } from "../../hooks/useRoles";
import Parse from "./Parse";
import { getCurrentPeriod, getMonthPeriod } from "../../utils/getCurrentPeriod";
import OrderStatusFilter from "../../components/filters/OrderStatusFilter";
import UpdateButton from "../../components/ui/button/UpdateButton";
import ClearFiltersButton from "../../components/ui/button/ClearFiltersButton";
import { useClearTrigger } from "../../hooks/useClearTrigger";
import ProductFilter from "../../components/filters/ProductFilter";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { getPathWithParam } from "../../utils/getPathWithParam";
import EditOrder from "./EditOrder/EditOrder";
import { DownloadExcelReport } from "./DownloadExcelReport/DownloadExcelReport";
import { ComparePhones } from "./ComparePhones/ComparePhones";

const defaultSortOptions: useSortOptions<IOrder> = {
    defaultKey: "date",
    defaultValue: "DESC",
    signature: orderSignature,
};

const itemsPerPage = 25;

const Orders = () => {
    useTitle("Заказы");

    const dispatch = useAppDispatch();
    const { hasRoles } = useRoles();

    const {
        app: { period },
        order: { types },
    } = useAppSelector((state) => state);

    const colorAssociation = useMemo(() => {
        return {
            [types.find((type) => type.identity === "з.")?.id || ""]:
                "green.100",
            [types.find((type) => type.identity === "п.")?.id || ""]:
                "orange.100",
        };
    }, [types]);

    const [isShowProducts, showProducts] = useBoolean();
    const [withRouteDate, routeDate] = useBoolean();

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);

    const { clearTrigger, invokeTrigger } = useClearTrigger();

    const [total, setTotal] = useState(0);
    const [totalOtkat, setTotalOtkat] = useState(0);
    const [totalDealerOtkat, setTotalDealerOtkat] = useState(0);

    const [search, setSearch] = useState("");

    // ✅ если хочешь везде строки — меняй на string[]
    // но пока оставляю как у тебя, кроме dealerIds (у тебя он string[])
    const [productTypeIds, setProductTypeIds] = useState<number[]>([]);
    const [countryIds, setCountryIds] = useState<number[]>([]);
    const [statusIds, setStatusesIds] = useState<number[]>([]);
    const [typeIds, setTypeIds] = useState<number[]>([]);
    const [dealerIds, setDealerIds] = useState<string[]>([]);

    const { sort, setSort } = useSort<IOrder>(defaultSortOptions);

    const [orders, setOrders] = useState<IOrder[]>([]);

    const refToLast = useInfinityScroll({
        loading,
        hasMore,
        setPage,
        page,
    });

    // ------------------------------------------------------
    // ✅ СТАБИЛЬНЫЙ ключ фильтров — убирает бесконечные эффекты
    // ------------------------------------------------------
    const filterKey = useMemo(() => {
        const normNum = (a: number[]) => [...(a || [])].slice().sort((x, y) => x - y);
        const normStr = (a: string[]) => [...(a || [])].slice().sort();

        return JSON.stringify({
            search: search?.trim() || "",
            withRouteDate: !!withRouteDate,

            periodFrom: period?.from ? new Date(period.from).toISOString() : null,
            periodTo: period?.to ? new Date(period.to).toISOString() : null,

            sortKey: sort?.key || "",
            sortValue: sort?.value || "",

            productTypeIds: normNum(productTypeIds),
            countryIds: normNum(countryIds),
            statusIds: normNum(statusIds),
            typeIds: normNum(typeIds),
            dealerIds: normStr(dealerIds),
        });
    }, [
        search,
        withRouteDate,
        period?.from,
        period?.to,
        sort?.key,
        sort?.value,
        productTypeIds,
        countryIds,
        statusIds,
        typeIds,
        dealerIds,
    ]);

    // ------------------------------------------------------
    // ✅ RESET при изменении фильтров
    // ------------------------------------------------------
    useEffect(() => {
        setOrders([]);
        setPage(1);
        setHasMore(false);
    }, [filterKey]);

    // ------------------------------------------------------
    // ✅ FETCH только по page + filterKey (без fetchOrders deps)
    // ------------------------------------------------------
    const inflightRef = useRef(false);
    const lastReqRef = useRef<string>("");

    useEffect(() => {
        const reqKey = `${filterKey}::page=${page}`;

        // защита от дубля в dev/StrictMode
        if (lastReqRef.current === reqKey) return;
        lastReqRef.current = reqKey;

        let cancelled = false;

        const run = async () => {
            if (inflightRef.current) return;
            inflightRef.current = true;

            setLoading(true);
            try {
                const response = await orderService.getAll({
                    search: search.trim(),
                    pagination: {
                        page,
                        itemsPerPage,
                    },
                    period,
                    filters: {
                        productTypeIds,
                        countryIds,
                        typeIds,
                        dealerIds,
                        statusIds,
                    },
                    sort: {
                        key: sort.key,
                        value: sort.value,
                    },
                    withRouteDate,
                });

                if (cancelled) return;

                if (response.status === SUCCESS_POST) {
                    const {
                        orders: nextOrders,
                        total,
                        hasMore,
                        totalOtkat,
                        totalDealerOtkat,
                    } = response.data;

                    setOrders((prev) => (page === 1 ? nextOrders : [...prev, ...nextOrders]));
                    setHasMore(!!hasMore);
                    setTotal(total);
                    setTotalOtkat(totalOtkat);
                    setTotalDealerOtkat(totalDealerOtkat);
                }
            } catch (e) {
                // если падает — лучше остановить подгрузку
                if (!cancelled) setHasMore(false);
            } finally {
                if (!cancelled) setLoading(false);
                inflightRef.current = false;
            }
        };

        run();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, filterKey]); // ✅ только так

    useEffect(() => {
        return () => {
            const currentPeriod = getCurrentPeriod();
            dispatch(setPeriod([currentPeriod[0], currentPeriod[1]]));
        };
    }, [dispatch]);

    useEffect(() => {
        const [from, to] = getMonthPeriod();
        dispatch(setPeriod([from, to]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const update = () => {
        // ✅ просто сбросить — fetch сам отработает
        setOrders([]);
        setPage(1);
        setHasMore(false);

        // чтобы точно перезапросить даже если page/filterKey не поменялись —
        // можно принудительно обновить lastReqRef:
        lastReqRef.current = "";
    };

    const clearFilters = () => {
        routeDate.off();
        showProducts.off();
        invokeTrigger();
        const [from, to] = getMonthPeriod();
        dispatch(setPeriod([from, to]));
        // остальное сбросится эффектом по filterKey
    };

    const getRowBg = (typeId: number) => {
        return colorAssociation[typeId] || "transparent";
    };

    return (
        <Page maxW={"100%"}>
            <VStack align="stretch">
                <Flex
                    align="center"
                    justifyContent="space-between"
                    gap={2}
                    flexWrap="wrap"
                >
                    <Private roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                        <Parse />
                    </Private>
                    <Private roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                        <EditOrder />
                    </Private>
                </Flex>

                <Flex align="center" gap={2} flexWrap="wrap">
                    <SearchInput
                        clearTrigger={clearTrigger}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Checkbox
                        isChecked={withRouteDate}
                        onChange={routeDate.toggle}
                    >
                        Дата маршрута
                    </Checkbox>
                    <Checkbox
                        isChecked={isShowProducts}
                        onChange={showProducts.toggle}
                    >
                        Товары
                    </Checkbox>
                    <UpdateButton onClick={update} isLoading={loading} />
                </Flex>

                <Flex align="center" gap={2} flexWrap="wrap">
                    <CountryFilter
                        clearTigger={clearTrigger}
                        setCoutryIds={setCountryIds}
                    />
                    <ProductFilter
                        clearTigger={clearTrigger}
                        setIds={setProductTypeIds}
                    />
                    <OrderTypeFilter
                        clearTigger={clearTrigger}
                        setIds={setTypeIds}
                    />
                    <OrderStatusFilter
                        clearTigger={clearTrigger}
                        setIds={setStatusesIds}
                    />
                    <DealerFilter
                        clearTigger={clearTrigger}
                        setIds={setDealerIds}
                    />
                    <ClearFiltersButton onClick={clearFilters} />

                    {hasRoles([ROLES.ADMIN]) && (
                        <Box
                            ml="auto"
                            display={"flex"}
                            alignItems={"center"}
                            gap={2}
                        >
                            <DownloadExcelReport
                                productTypeIds={productTypeIds}
                                period={period}
                                regionIds={countryIds}
                                statusIds={statusIds}
                                orderTypeIds={typeIds}
                                routeDate={withRouteDate}
                            />
                            <ComparePhones />
                        </Box>
                    )}
                </Flex>

                <Flex gap={2} flexWrap="wrap" p={2} borderWidth={1} rounded={2}>
                    <Text>
                        <b style={{ fontWeight: 500 }}>{total}</b> записей за{" "}
                        <Text
                            as="span"
                            fontWeight={500}
                            display={{ base: "block", sm: "inline" }}
                        >
                            {period.from.getDate() === period.to.getDate()
                                ? format(period.from, "dd.MM.yyyy")
                                : `${format(
                                    period.from,
                                    "dd.MM.yyyy"
                                )} - ${format(period.to, "dd.MM.yyyy")}`}
                        </Text>
                    </Text>

                    <Private roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                        <Flex gap={1}>
                            <Text>Общий откат:</Text>
                            <MoneyText fontWeight={500} value="$">
                                {totalOtkat?.toFixed(0)}
                            </MoneyText>
                        </Flex>
                    </Private>

                    <Flex gap={1}>
                        <Text>Откат диллеру:</Text>
                        <MoneyText fontWeight={500} value="$">
                            {totalDealerOtkat?.toFixed(0)}
                        </MoneyText>
                    </Flex>
                </Flex>

                <Table<IOrder>
                    loadingOverlay={loading}
                    getRowProps={(item) => ({
                        bg: getRowBg(item.typeId),
                        _hover: {},
                    })}
                    toolbarProps={{
                        justify: "flex-start",
                        direction: "column",
                    }}
                    refToLast={refToLast}
                    maxH={"72vh"}
                    sort={{
                        ...defaultSortOptions,
                        onSort: setSort,
                    }}
                    headers={[
                        {
                            name: "№",
                            render: (item, i) => <>#{i + 1}</>,
                        },
                        {
                            name: "Проект",
                            render: (item) => {
                                if (!item.request) return <>--</>;
                                if (!item.request.project) return <>--</>;

                                return (
                                    <Link
                                        to={`${getPathWithParam(
                                            ROUTES.projectRequests.path,
                                            item.request.project.id
                                        )}?search=${item.requestId}`}
                                        as={NavLink}
                                    >
                                        {item.request.project.name}
                                    </Link>
                                );
                            },
                        },
                        {
                            name: "Номер заказа",
                            key: "order_id",
                        },
                        {
                            name: "Товары",
                            props: {
                                minW: "400px",
                                maxW: "400px",
                                display: isShowProducts ? "table-cell" : "none",
                            },
                            rowProps: {
                                minW: "400px",
                                maxW: "400px",
                                whiteSpace: "break-spaces",
                                display: isShowProducts ? "table-cell" : "none",
                            },
                            render: (item) => (
                                <VStack align="stretch" spacing={1}>
                                    {item.products.map((product) => (
                                        <HStack
                                            spacing={1}
                                            align="center"
                                            key={product.id}
                                        >
                                            <ShowProduct
                                                version={product.version}
                                                id={product.product_id}
                                            />
                                            <Text>
                                                {product.name}
                                                {product.OrderPrice.count > 1 && (
                                                    <strong
                                                        style={{
                                                            fontSize: ".9em",
                                                        }}
                                                    >
                                                        {" ("}
                                                        {product.OrderPrice.count}
                                                        шт.{")"}
                                                    </strong>
                                                )}
                                            </Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            ),
                        },
                        {
                            name: "Телефоны",
                            key: "phones",
                            render: (item) => (
                                <>
                                    {item.phones
                                        .split(",")
                                        .map((phone) => phone.trim())
                                        .map((phone, i) => (
                                            <Link
                                                display={"block"}
                                                key={i}
                                                href={`tel:${phone
                                                    .split("")
                                                    .filter(
                                                        (symbol) =>
                                                            !Number.isNaN(
                                                                Number(symbol)
                                                            ) && symbol !== " "
                                                    )
                                                    .join("")}`}
                                            >
                                                {phone}
                                            </Link>
                                        ))}
                                </>
                            ),
                        },
                        {
                            name: "Сумма заказа",
                            key: "price",
                            render: (item) => (
                                <MoneyText value={item.currency.symbol}>
                                    {item.price}
                                </MoneyText>
                            ),
                        },
                        {
                            name: "Откат",
                            key: "otkat",
                            props: {
                                display: hasRoles([ROLES.ADMIN, ROLES.MANAGER])
                                    ? "table-cell"
                                    : "none",
                            },
                            rowProps: {
                                display: hasRoles([ROLES.ADMIN, ROLES.MANAGER])
                                    ? "table-cell"
                                    : "none",
                            },
                            render: (item) => (
                                <MoneyText fontWeight={500} value={"$"}>
                                    {item.otkat}
                                </MoneyText>
                            ),
                        },
                        {
                            name: "Откат диллеру",
                            key: "dealerOtkat",
                            render: (item) => (
                                <MoneyText fontWeight={500} value={"$"}>
                                    {item.dealerOtkat}
                                </MoneyText>
                            ),
                        },
                        {
                            name: "Дата оформления",
                            key: "date",
                            render: (item) => (
                                <>
                                    {format(
                                        new Date(item.date),
                                        "dd.MM.yyyy HH:mm"
                                    )}
                                </>
                            ),
                        },
                        {
                            name: "Дата маршрута",
                            key: "date_route",
                            render: (item) => (
                                <>
                                    {item.date_route
                                        ? format(
                                            new Date(item.date_route),
                                            "dd.MM.yyyy"
                                        )
                                        : "--/--"}
                                </>
                            ),
                        },
                        {
                            name: "Склад",
                            key: "stock",
                        },
                        {
                            name: "Пометка",
                            key: "info",
                            props: {
                                maxW: "400px",
                            },
                            rowProps: {
                                maxW: "400px",
                                whiteSpace: "break-spaces",
                            },
                        },
                        {
                            name: "Статус",
                            key: "status",
                        },
                    ]}
                    rows={orders}
                />
            </VStack>
        </Page>
    );
};

export default Orders;

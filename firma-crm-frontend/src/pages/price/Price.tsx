import React, { useCallback, useEffect, useState } from "react";
import Table from "../../components/table/Table";
import Page from "../../components/ui/page/Page";
import { SUCCESS_POST } from "../../const/http-codes";
import priceService from "../../services/price-service";
import { useSort, useSortOptions } from "../../hooks/useSort";
import useTitle from "../../hooks/useTitle";
import { IPrice, priceSignature } from "../../models/IPrice";
import SearchInput from "../../components/ui/search-input/SearchInput";
import {
    Box,
    Flex,
    Progress,
    Spinner,
    Text,
    TextProps,
    VStack,
} from "@chakra-ui/react";
import { useInfinityScroll } from "../../hooks/useInfinityScroll";
import UploadPrice from "./UploadPrice";
import UpdatePrice from "./UpdatePrice";
import Private from "../../components/private/Private";
import { ROLES, useRoles } from "../../hooks/useRoles";
import ProductFilter from "../../components/filters/ProductFilter";
import UpdateButton from "../../components/ui/button/UpdateButton";
import ClearFiltersButton from "../../components/ui/button/ClearFiltersButton";
import { useClearTrigger } from "../../hooks/useClearTrigger";
import { PriceVersionFilter } from "../../components/filters/VersionFilter";

const itemsPerPage = 20;

export const MoneyText: React.FC<{ value: string } & TextProps> = ({
    value,
    ...props
}) => {
    const small = value !== "$" && value !== "₽";

    return (
        <Text {...props}>
            {props.children || (props.children === 0 ? 0 : "--/--")}{" "}
            <Text
                fontSize={small ? ".75em" : "1em"}
                as="span"
                fontWeight={small ? 500 : 400}
                {...props}
            >
                {props.children !== undefined ? value : ""}
            </Text>
        </Text>
    );
};

const defaultSortOptions: useSortOptions<IPrice> = {
    defaultKey: "product_id",
    defaultValue: "ASC",
    signature: priceSignature,
};

const Price = () => {
    useTitle("Прайс");

    const { hasRoles } = useRoles();

    const { clearTrigger, invokeTrigger } = useClearTrigger();

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [version, setVersion] = useState(0);
    const [search, setSearch] = useState("");
    const [productTypeIds, setProductTypeIds] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const [uploadProgress, setUploadProgress] = useState({
        loading: false,
        total: 0,
        current: 0,
    });
    const { sort, setSort } = useSort<IPrice>(defaultSortOptions);
    const lastElementRef = useInfinityScroll({
        loading,
        hasMore,
        setPage,
        page,
    });

    const [items, setItems] = useState<IPrice[]>([]);

    const fetchPrice = useCallback(async () => {
        setLoading(true);
        try {
            const response = await priceService.getAll({
                search,
                sort,
                pagination: {
                    itemsPerPage,
                    page,
                },
                filters: {
                    productTypeIds,
                },
                version,
            });
            if (response.status === SUCCESS_POST) {
                const { hasMore, prices, total } = response.data;
                setItems((prev) => [...prev, ...prices]);
                setHasMore(hasMore);
                setTotal(total);
            }
        } catch (e) { }
        setLoading(false);
    }, [search, sort, page, productTypeIds, version]);

    useEffect(() => {
        fetchPrice();
    }, [fetchPrice]);

    useEffect(() => {
        setItems([]);
        setPage(1);
    }, [search, sort, productTypeIds, version]);

    const update = useCallback(() => {
        setItems([]);
        setPage(1);
        fetchPrice();
    }, [fetchPrice]);

    return (
        <Page maxW="100%">
            <Flex gap={2} flexWrap="wrap" align={"center"}>
                <Text>Записей: {total}</Text>
                <Box ms={"auto"}>
                    <PriceVersionFilter
                        setVersion={setVersion}
                        version={version}
                    />
                </Box>
            </Flex>
            <Flex my={2} gap={2} flexWrap="wrap" alignItems={"center"}>
                <Private roles={[ROLES.ADMIN]}>
                    <UploadPrice
                        setUploadProgress={setUploadProgress}
                        update={update}
                    />
                </Private>
                <SearchInput
                    placeholder="Поиск: Название, ID, ID-ID"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                <ProductFilter
                    clearTigger={clearTrigger}
                    setIds={setProductTypeIds}
                />
                <ClearFiltersButton onClick={invokeTrigger} />
                <UpdateButton onClick={update} isLoading={loading} />
            </Flex>
            <Table<IPrice>
                isLoading={loading}
                sort={{
                    onSort: setSort,
                    ...defaultSortOptions,
                }}
                refToLast={lastElementRef}
                toolbarProps={{ justify: "flex-start" }}
                maxH={"80vh"}
                headers={[
                    {
                        name: "",
                        render: (item) => (
                            <Private roles={[ROLES.ADMIN]}>
                                <UpdatePrice update={update} record={item} />
                            </Private>
                        ),
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
                    {
                        key: "product_id",
                        name: nameAssociations["product_id"],
                    },
                    {
                        key: "name",
                        name: nameAssociations["name"],
                        type: "string",
                    },
                    {
                        key: "rb_buy",
                        name: nameAssociations["rb_buy"],
                        render: (item) => (
                            <MoneyText value={"$"}>{item.rb_buy}</MoneyText>
                        ),
                    },
                    {
                        key: "price_rb",
                        name: nameAssociations["price_rb"],
                        render: (item) => (
                            <MoneyText value={"BYN"}>{item.price_rb}</MoneyText>
                        ),
                    },

                    {
                        key: "otkat_rb",
                        name: nameAssociations["otkat_rb"],
                        render: (item) => (
                            <MoneyText value={"$"}>{item.otkat_rb}</MoneyText>
                        ),
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
                    },
                    {
                        key: "otkat_rb_d",
                        name: nameAssociations["otkat_rb_d"],
                        render: (item) => (
                            <MoneyText value={"$"}>{item.otkat_rb_d}</MoneyText>
                        ),
                    },
                    {
                        key: "delivery_c_br",
                        name: nameAssociations["delivery_c_br"],
                        render: (item) => (
                            <MoneyText value={"BYN"}>
                                {item.delivery_c_br}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "delivery_c_usd",
                        name: nameAssociations["delivery_c_usd"],
                        render: (item) => (
                            <MoneyText value={"$"}>
                                {item.delivery_c_usd}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "delivery_r_br",
                        name: nameAssociations["delivery_r_br"],
                        render: (item) => (
                            <MoneyText value={"BYN"}>
                                {item.delivery_r_br}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "delivery_r_usd",
                        name: nameAssociations["delivery_r_usd"],
                        render: (item) => (
                            <MoneyText value={"$"}>
                                {item.delivery_r_usd}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "price_delivery_br",
                        name: nameAssociations["price_delivery_br"],
                        render: (item) => (
                            <MoneyText value={"BYN"}>
                                {item.price_delivery_br}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "ru_buy",
                        name: nameAssociations["ru_buy"],
                        render: (item) => (
                            <MoneyText value={"$"}>{item.ru_buy}</MoneyText>
                        ),
                    },
                    {
                        key: "price_ru",
                        name: nameAssociations["price_ru"],
                        render: (item) => (
                            <MoneyText value={"RU"}>{item.price_ru}</MoneyText>
                        ),
                    },
                    {
                        key: "otkat_ru",
                        name: nameAssociations["otkat_ru"],
                        render: (item) => (
                            <MoneyText value={"$"}>{item.otkat_ru}</MoneyText>
                        ),
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
                    },
                    {
                        key: "otkat_ru_d",
                        name: nameAssociations["otkat_ru_d"],
                        render: (item) => (
                            <MoneyText value={"$"}>{item.otkat_ru_d}</MoneyText>
                        ),
                    },
                    {
                        key: "delivery_ru_ru",
                        name: nameAssociations["delivery_ru_ru"],
                        render: (item) => (
                            <MoneyText value={"RU"}>
                                {item.delivery_ru_ru}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "delivery_ru_usd",
                        name: nameAssociations["delivery_ru_usd"],
                        render: (item) => (
                            <MoneyText value={"$"}>
                                {item.delivery_ru_usd}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "price_delivery_ru",
                        name: nameAssociations["price_delivery_ru"],
                        render: (item) => (
                            <MoneyText value={"RU"}>
                                {item.price_delivery_ru}
                            </MoneyText>
                        ),
                    },
                    {
                        key: "koef",
                        name: nameAssociations["koef"],
                    },
                ]}
                rows={items}
            />
            {uploadProgress.loading && (
                <VStack
                    position={"absolute"}
                    top={0}
                    right={0}
                    left={0}
                    bottom={0}
                    zIndex={2000}
                    justifyContent={"center"}
                    bg="rgba(0,0,0,.6)"
                    spacing={4}
                >
                    <Spinner size="xl" thickness={"6px"} color="white" />
                    {uploadProgress.total ? (
                        <>
                            <Progress
                                w="200px"
                                size="sm"
                                value={uploadProgress.current}
                                colorScheme="blue"
                            />
                            <Text color="white" fontSize={"14px"}>
                                Загрузка... {uploadProgress.current.toFixed(0)}%
                                / {uploadProgress.total}%
                            </Text>
                        </>
                    ) : (
                        <Text color="white" fontSize={"14px"}>
                            Обработка...
                        </Text>
                    )}
                </VStack>
            )}
        </Page>
    );
};

export default Price;

export const nameAssociations: any = {
    product_id: "ID",
    name: "Название",
    rb_buy: "Закуп",
    price_rb: "Цена",
    delivery_c_br: "Д. Минск BYN",
    delivery_c_usd: "Д. Минск $",
    delivery_r_br: "Д. Регион BYN",
    delivery_r_usd: "Д. Регион $",
    price_delivery_br: "С Д. Регион",
    ru_buy: "Закуп РФ",
    price_ru: "Цена РФ",
    delivery_ru_ru: "Д. РФ RU",
    delivery_ru_usd: "Д. РФ $",
    price_delivery_ru: "С Д. РФ",
    koef: "Koef",
    exchange_br: "Курс РБ",
    exchange_ru: "Курс РФ",
    otkat_ru: "Откат РФ",
    otkat_rb: "Откат РБ",
    otkat_ru_d: "Откат РФ Д.",
    otkat_rb_d: "Откат РБ Д.",
};

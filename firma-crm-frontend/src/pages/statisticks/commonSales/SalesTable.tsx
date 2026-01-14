import { HStack, Text, VStack } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { TableHeader } from "../../../components/table/Header";
import Table from "../../../components/table/Table";
import { SUCCESS_POST } from "../../../const/http-codes";
import { useAppSelector } from "../../../hooks/redux";
import { ICountry } from "../../../models/ICountry";
import { ISaleStatistick } from "../../../models/ISaleStatistick";
import saleService from "../../../services/sale-service";

type SalesTableProps = {
    region: ICountry;
    trigger: boolean;
    compare: boolean;
    productIds: number[];
};

const SalesTable: React.FC<SalesTableProps> = ({
    region,
    trigger,
    compare,
    productIds,
}) => {
    const {
        app: { period },
    } = useAppSelector((state) => state);

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<ISaleStatistick[]>([]);
    const [dateCols, setDateCols] = useState<TableHeader<ISaleStatistick>[]>(
        []
    );

    const height = 81 + items.length * (compare ? 53 : 32);

    const fetchStatisticks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await saleService.getSalesStatisticks({
                period,
                regionId: region.id,
                compare,
                productIds,
            });

            if (response.status === SUCCESS_POST) {
                setItems(response.data.products);
            }
        } catch (e) {}
        setLoading(false);
    }, [period, region, compare, productIds]);

    useEffect(() => {
        fetchStatisticks();
    }, [fetchStatisticks, trigger]);

    useEffect(() => {
        if (items[0]) {
            setDateCols(
                Object.keys(items[0])
                    .filter(
                        (key) =>
                            key !== "name" && key !== "id" && key !== "total"
                    )
                    .map((key) => ({
                        name: key,
                        align: "center",
                        key,
                        rowProps: {
                            h: compare ? "53px" : "auto",
                        },
                        render: (item: ISaleStatistick) =>
                            renderComparable(item, key),
                    }))
            );
        }
    }, [items, compare]);

    return (
        <VStack align="flex-start">
            <Text fontWeight={500}>{region.name}</Text>
            <HStack spacing={0}>
                <Table<ISaleStatistick>
                    loadingOverlay={loading}
                    withoutSpinner
                    maxH={`${height}px`}
                    props={{
                        h: "100%",
                        w: "200px",
                        borderRightRadius: 0,
                        borderRightWidth: 0,
                        display: { base: "none", sm: "block" },
                    }}
                    headers={[
                        {
                            name: "Продукт",
                            key: "name",
                            rowProps: {
                                h: compare ? "53px" : "auto",
                            },
                        },
                    ]}
                    rows={items}
                />
                <Table<ISaleStatistick>
                    loadingOverlay={loading}
                    maxH={`${height}px`}
                    props={{
                        borderLeftRadius: 0,
                        borderLeftWidth: 0,
                        w: {
                            base: "calc(100vw - 26px)",
                            sm: "calc(100vw - 270px)",
                        },
                    }}
                    headers={[
                        {
                            name: "Продукт",
                            key: "name",
                            props: {
                                display: {
                                    base: "table-cell",
                                    sm: "none",
                                },
                            },
                            rowProps: {
                                display: {
                                    base: "table-cell",
                                    sm: "none",
                                },
                            },
                        },
                        {
                            name: "Всего",
                            key: "total",
                            align: "center",
                            render: (item) => renderComparable(item, "total"),
                        },
                        ...dateCols,
                    ]}
                    rows={items}
                />
            </HStack>
        </VStack>
    );
};

const renderComparable = (
    item: ISaleStatistick,
    key: keyof ISaleStatistick
) => {
    const value = item[key];
    if (typeof value === "object") {
        let percent: any = (Number(value.main) * 100) / Number(value.firma);
        if (Number.isNaN(percent) || !Number.isFinite(percent)) percent = "?";

        return (
            <VStack align="center" spacing={1}>
                <Text>
                    {value.main}/{value.firma}
                </Text>
                <Text
                    color={
                        percent > 70
                            ? "green.500"
                            : percent > 25
                            ? "orange.400"
                            : "red.500"
                    }
                    fontSize=".8em"
                >
                    {typeof percent === "number" ? percent.toFixed(0) : percent}
                    %
                </Text>
            </VStack>
        );
    }

    return <>{value}</>;
};

export default SalesTable;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IProjectStatisticksItem } from "../../../models/IStatisticks";
import Table from "../../../components/table/Table";
import { Link, Text, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getPathWithParam } from "../../../utils/getPathWithParam";
import { ROUTES } from "../../../router/routes";
import { useAppSelector } from "../../../hooks/redux";
import statisticksService from "../../../services/statisticks-service";
import { SUCCESS_POST } from "../../../const/http-codes";
import { optionType } from "../../../components/filters/SingleSelectFilter";
import { MoneyText } from "../../price/Price";
import ProjectsChartToolbar from "./ProjectsChartToolbar";

type ProjectsChartProps = {
    countryIds: number[];
    productIds: number[];
};

const ProjectsChart: React.FC<ProjectsChartProps> = ({
    countryIds,
    productIds,
}) => {
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);

    const options: optionType<number>[] = useMemo(
        () => [
            {
                name: "Активные",
                value: 1,
            },
            {
                name: `Все${totalRows ? ` (${totalRows})` : ""}`,
                value: 0,
            },
        ],
        [totalRows]
    );

    const [isActive, setIsActive] = useState(options[0].value);

    const period = useAppSelector((state) => state.app.period);

    const [search, setSearch] = useState("");

    const [items, setItems] = useState<IProjectStatisticksItem[]>([]);

    const clearState = () => {
        setItems([]);
    };

    const fetchProjectsStatisticks = useCallback(async () => {
        setLoading(true);

        try {
            const response = await statisticksService.getProjects({
                search,
                period,
                isActive: !!isActive,
                filter: {
                    countryIds: [0, ...countryIds],
                    productIds: [0, ...productIds],
                },
            });

            // response = уже data
            setItems(response.projects ?? []);
            setTotalRows(response.total ?? 0);
            setLoading(false);

        } catch (e) { }
        finally {
            setLoading(false);
        }
    }, [period, search, countryIds, productIds, isActive]);



    useEffect(() => {
        fetchProjectsStatisticks();
    }, [fetchProjectsStatisticks]);

    useEffect(() => {
        clearState();
    }, [period, search, countryIds, productIds]);

    const searchHandler = (e: any) => {
        setSearch(e.target.value);
    };

    const update = () => {
        clearState();
        fetchProjectsStatisticks();
    };

    return (
        <Table<IProjectStatisticksItem>
            zeroText="0"
            expand={{
                getExpanded: (item) => !!item.projects,
                getEpandedRows: (item) => item.projects || [],
                expandedHeaders: [
                    {
                        name: "",
                        key: "name",
                        render: (item) => (
                            <Text fontWeight={500}>{item.name}</Text>
                        ),
                    },
                    {
                        name: "",
                        key: "total",
                        align: "center",
                    },
                    {
                        name: "",
                        sortable: false,
                        key: "total",
                        align: "center",
                        render: (item) => <SourceCol {...item} />,
                    },
                    {
                        name: "",
                        key: "zakaz",
                        align: "center",
                    },
                    {
                        name: "",
                        key: "pred",
                        align: "center",
                    },
                    {
                        name: "",
                        align: "center",
                        key: "earn",
                        render: (item) => (
                            <MoneyText value="$">{item.earn}</MoneyText>
                        ),
                    },
                    {
                        name: "",
                        align: "center",
                        key: "expenses",
                        render: (item) => (
                            <MoneyText value="$">{item.expenses}</MoneyText>
                        ),
                    },
                    {
                        name: "",
                        align: "center",
                        key: "buyPercent",
                        render: (item) => <>{item.buyPercent} %</>,
                    },
                ],
            }}
            maxH="80vh"
            toolbar={
                <ProjectsChartToolbar
                    isLoading={loading}
                    update={update}
                    search={{
                        search,
                        searchHandler,
                    }}
                    setIsActive={setIsActive}
                    options={options}
                />
            }
            isLoading={loading}
            props={{
                mt: { base: 2, sm: 4 },
            }}
            headers={[
                {
                    name: "Название",
                    key: "name",
                    type: "string",
                    props: {
                        minW: { md: "375px", sm: "240px", base: "230px" },
                    },
                    render: (item) => (
                        <>
                            <Link
                                as={RouterLink}
                                to={getPathWithParam(
                                    ROUTES.projectRequests.path,
                                    item.id
                                )}
                            >
                                {item.name}
                            </Link>
                        </>
                    ),
                    rowProps: { fontWeight: 500 },
                },
                {
                    name: "Заявок",
                    key: "total",
                    align: "center",
                },
                {
                    name: (
                        <SourceCol
                            isHeader
                            yandex="Я"
                            google="G"
                            other="Д"
                            calls="З"
                        />
                    ),
                    sortable: false,
                    key: "total",
                    align: "center",
                    render: (item) => <SourceCol {...item} />,
                },
                {
                    name: "Заказы",
                    align: "center",
                    key: "zakaz",
                },
                {
                    name: "Предзаказы",
                    align: "center",
                    key: "pred",
                },
                {
                    name: "Рассрочки",
                    align: "center",
                    key: "leasing",
                },
                {
                    name: "Чист. Доход",
                    align: "center",
                    key: "earn",
                    render: (item) => (
                        <MoneyText value="$">{item.earn}</MoneyText>
                    ),
                },
                {
                    name: "Расход",
                    align: "center",
                    key: "expenses",
                    render: (item) => (
                        <MoneyText value="$">{item.expenses}</MoneyText>
                    ),
                },
                {
                    name: "% Окупаемости",
                    align: "center",
                    key: "buyPercent",
                    render: (item) => <>{item.buyPercent} %</>,
                },
            ]}
            rows={items}
        />
    );
};

type SourceColProps = {
    google: number | string;
    yandex: number | string;
    other: number | string;
    calls: number | string;
    isHeader?: boolean;
};
const SourceCol: React.FC<SourceColProps> = (props) => {
    const { google, yandex, other, calls, isHeader } = props;

    const getLabel = useCallback(
        (name: string, value: number | string) => {
            return isHeader ? name : `${name} - ${value}`;
        },
        [isHeader]
    );

    return (
        <div>
            {isHeader && (
                <>
                    Источник
                    <br />
                </>
            )}
            <Tooltip label={getLabel("Звонки", calls)}>
                <Text as="span" color="green.500">
                    {calls}
                </Text>
            </Tooltip>
            {" | "}
            <Tooltip label={getLabel("Google", google)}>
                <Text as="span" color="yellow.500">
                    {google}
                </Text>
            </Tooltip>
            {" | "}
            <Tooltip label={getLabel("Яндекс", yandex)}>
                <Text as="span" color="red.500">
                    {yandex}
                </Text>
            </Tooltip>
            {" | "}
            <Tooltip label={getLabel("Другие", other)}>
                <span>{other}</span>
            </Tooltip>
        </div>
    );
};

export default ProjectsChart;

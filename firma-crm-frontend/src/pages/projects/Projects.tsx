/* eslint-disable react-hooks/exhaustive-deps */
import {
    VStack,
    Link as ChakraLink,
    Text,
    Badge,
    Tooltip,
    HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { Link as NavLink } from "react-router-dom";
import Table from "../../components/table/Table";
import Page from "../../components/ui/page/Page";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useSort, useSortOptions } from "../../hooks/useSort";
import useTitle from "../../hooks/useTitle";
import { IProject, projectSignature } from "../../models/IProject";
import { ROUTES } from "../../router/routes";
import { getAllProjects, setPage } from "../../store/slices/project-slice";
import { getPathWithParam } from "../../utils/getPathWithParam";
import Toolbar from "./Toolbar";

type ProjectsProps = {
    mode?: "create";
};

const badgeColors: { [key: number]: string } = {
    1: "green",
    2: "orange",
    3: "blue",
    4: "red",
    5: "purple",
    6: "teal",
};

const defaultSortOptions: useSortOptions<IProject> = {
    defaultKey: "name",
    defaultValue: "ASC",
    signature: projectSignature,
};

export const itemsPerPage = 200;

const Projects: React.FC<ProjectsProps> = ({ mode }) => {
    useTitle("Проекты");
    const {
        projects,
        pagination: { page, total },
        loading,
    } = useAppSelector((state) => state.project);
    const dispatch = useAppDispatch();

    const { sort, setSort } = useSort<IProject>(defaultSortOptions);

    const { period } = useAppSelector((state) => state.app);
    const [search, setSearch] = useState("");
    const [countryIds, setCountryIds] = useState<number[]>([]);
    const [productIds, setProductIds] = useState<number[]>([]);

    const [isTesting, setTesting] = useState(false);
    const [autoPhoneMode, setAPM] = useState(false);

    const [redirectRange, setRedirectRange] = useState<number>(0);

    const fetchProjects = useCallback(async () => {
        await dispatch(
            getAllProjects({
                search,
                pagination: {
                    page,
                    itemsPerPage,
                },
                period,
                sort,
                filter: {
                    countryIds,
                    productIds,
                    isTesting,
                    redirectRange,
                    autoPhoneMode,
                },
            })
        );
    }, [
        dispatch,
        page,
        period,
        sort,
        search,
        countryIds,
        productIds,
        isTesting,
        redirectRange,
        autoPhoneMode,
    ]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (page !== 1) dispatch(setPage(1));
    }, [period, sort, search, countryIds, productIds]);

    const update = () => {
        dispatch(setPage(1));
        setSort(
            defaultSortOptions.defaultKey,
            defaultSortOptions.defaultValue || "ASC"
        );
    };

    return (
        <Page
            toolbar={
                <Toolbar
                    search={{
                        setValue: setSearch,
                        value: search,
                    }}
                    APM={autoPhoneMode}
                    setAPM={setAPM}
                    productFilter={{ setIds: setProductIds }}
                    countryFilter={{ setIds: setCountryIds }}
                    mode={mode}
                    isTesting={isTesting}
                    setTesting={setTesting}
                    redirectRange={redirectRange}
                    setRedirectRange={setRedirectRange}
                />
            }
        >
            <VStack spacing={3} align="center">
                <Table<IProject>
                    toolbar={<Text flexGrow={1}>Проектов: {total}</Text>}
                    expand={{
                        getExpanded: (project) => !!project.projects,
                        getEpandedRows: (item) => item.projects || [],
                        expandedHeaders: [
                            {
                                name: "Домен",
                                key: "domain",
                                render: (item) => (
                                    <Text fontWeight={500}>
                                        {item.domain}{" "}
                                        {item.projects?.find(
                                            (project) => project.autoPhoneMode
                                        ) && (
                                            <Text color="purple" as="span">
                                                [А]
                                            </Text>
                                        )}
                                    </Text>
                                ),
                            },
                            {
                                name: "",
                                hideOn: "sm",
                                render: (item) => (
                                    <ChakraLink
                                        href={`https://${item.domain}`}
                                        isExternal
                                        color="blue.500"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        https://{item.domain}
                                    </ChakraLink>
                                ),
                            },
                            {
                                name: "",
                                key: "requestsCount",
                                render: (item) => (
                                    <Text textAlign="center">
                                        {item.requestsCount}
                                    </Text>
                                ),
                            },
                            {
                                name: "",
                                render: () => null,
                            },
                        ],
                    }}
                    update={update}
                    isLoading={loading}
                    sort={{
                        ...defaultSortOptions,
                        onSort: setSort,
                    }}
                    maxH="84vh"
                    rows={projects}
                    headers={[
                        {
                            name: "Название",
                            key: "name",
                            type: "string",
                            rowProps: { fontWeight: 500 },
                            render: (item) => (
                                <HStack>
                                    {item.product && (
                                        <Tooltip
                                            fontSize={"12px"}
                                            openDelay={400}
                                            label={item.product.name}
                                        >
                                            <Badge
                                                colorScheme={
                                                    badgeColors[item.product.id]
                                                }
                                            >
                                                {item.product.name[0]}
                                            </Badge>
                                        </Tooltip>
                                    )}
                                    <ChakraLink
                                        as={NavLink}
                                        display="inline-block"
                                        to={getPathWithParam(
                                            ROUTES.projectRequests.path,
                                            item.id
                                        )}
                                    >
                                        {item.name}
                                    </ChakraLink>
                                    <Text color="green.500">
                                        {item.randomRedirect}%
                                    </Text>
                                    {item.isTesting && (
                                        <Text color="blue.500">[T]</Text>
                                    )}
                                    {item.autoPhoneMode && (
                                        <Text color="purple">[А]</Text>
                                    )}
                                </HStack>
                            ),
                            helperText: (item) => item.url,
                            helperTextProps: {
                                display: { base: "block", sm: "none" },
                                fontSize: ".7em",
                            },
                        },
                        {
                            name: "Ссылка",
                            key: "url",
                            sortable: false,
                            hideOn: "sm",
                            render: (item) => (
                                <ChakraLink
                                    href={item.url}
                                    isExternal
                                    color="blue.500"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.url}
                                </ChakraLink>
                            ),
                        },
                        {
                            name: "Заявок",
                            key: "requestsCount",
                            align: "center",
                            render: (item) => (
                                <Text textAlign="center">
                                    {item.requestsCount}
                                </Text>
                            ),
                        },
                        {
                            name: "Добавлен",
                            key: "createdAt",
                            hideOn: "lg",
                            render: (item) => (
                                <>
                                    {format(
                                        new Date(item.createdAt),
                                        "dd.MM.yyyy"
                                    )}
                                </>
                            ),
                        },
                    ]}
                />
            </VStack>
        </Page>
    );
};

export default Projects;

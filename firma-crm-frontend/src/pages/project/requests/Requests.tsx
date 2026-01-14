import { Link, Text, Tooltip, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link as NavLink } from "react-router-dom";
import Table from "../../../components/table/Table";
import SearchInput from "../../../components/ui/search-input/SearchInput";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useInfinityScroll } from "../../../hooks/useInfinityScroll";
import { useSort, useSortOptions } from "../../../hooks/useSort";
import { IProject } from "../../../models/IProject";
import { IRequest, requestSignature } from "../../../models/IRequest";
import { ROUTES } from "../../../router/routes";
import {
    getRequestsByProjectId,
    setRequests,
} from "../../../store/slices/request-slice";
import { ProjectProps } from "../Project";
import Statisticks from "./Statisticks";
import { SourceFilter } from "./SourceFilter";

type RequestsProps = {
    project: IProject;
    mode: ProjectProps["mode"];
};

const itemsPerPage = 15;

const defaultSortOptions: useSortOptions<IRequest> = {
    defaultKey: "createdAt",
    defaultValue: "DESC",
    signature: requestSignature,
};

const Requests: React.FC<RequestsProps> = ({ project, mode }) => {
    const {
        request: {
            requests,
            loading,
            pagination: { hasMore },
        },
        app: { period },
    } = useAppSelector((state) => state);
    const { id } = useParams();

    const { sort, setSort } = useSort<IRequest>(defaultSortOptions);

    const dispatch = useAppDispatch();
    const [items, setItems] = useState<IRequest[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [source, setSource] = useState("all");

    const lastElementRef = useInfinityScroll({
        loading,
        page,
        setPage,
        hasMore,
    });

    const fetchRequests = useCallback(async () => {
        if (project?.id?.toString() !== id) return;
        await dispatch(
            getRequestsByProjectId({
                projectId: project.id,
                filters: {
                    source,
                    period,
                    pagination: {
                        itemsPerPage,
                        page,
                    },
                    search,
                    sort,
                },
            })
        );
    }, [page, period, search, dispatch, id, project.id, sort, source]);

    useEffect(() => {
        setPage(1);
        setItems([]);
    }, [period, search, id, sort, mode, source]);

    useEffect(() => {
        fetchRequests();
        return () => {
            dispatch(setRequests([]));
        };
    }, [fetchRequests, dispatch]);

    useEffect(() => {
        setItems((prev) => [...prev, ...requests]);
    }, [requests]);

    const update = () => {
        setItems([]);
        setPage(1);
        fetchRequests();
    };

    return (
        <VStack>
            <Statisticks id={project.id} />
            <Table<IRequest>
                sort={{
                    onSort: setSort,
                    ...defaultSortOptions,
                }}
                refToLast={lastElementRef}
                toolbar={
                    <>
                        <SourceFilter
                            syncWithQuery={false}
                            source={source}
                            setSource={setSource}
                        />
                        <SearchInput
                            placeholder="Поиск: Имя, ID, Номер"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </>
                }
                isLoading={loading}
                update={update}
                maxH="58vh"
                adaptive={true}
                headers={[
                    {
                        name: "Номер заявки",
                        key: "id",
                        render: (item) => <>#{item.id}</>,
                    },
                    {
                        name: "Номер",
                        key: "phone",
                        render: (item) => (
                            <Link href={`tel:${item.phone}`} color="blue.500">
                                {item.phone}
                            </Link>
                        ),
                    },
                    {
                        name: "Имя",
                        key: "name",
                        type: "string",
                    },
                    {
                        name: "Данные",
                        sortable: false,
                        render: (item) => (
                            <>
                                {item.data
                                    ? item.data
                                        .split("\n")
                                        .map((text, i) => (
                                            <Text key={i}>{text}</Text>
                                        ))
                                    : "--/--"}
                            </>
                        ),
                    },
                    {
                        name: "Источник",
                        key: "source",
                        type: "string",
                    },
                    {
                        name: "UTM",
                        key: "utm",
                        type: "string",
                    },
                    {
                        name: "Время",
                        key: "createdAt",
                        render: (item) => (
                            <>{format(new Date(item.createdAt), "hh : mm")}</>
                        ),
                    },
                    {
                        name: "Дата",
                        key: "createdAt",
                        render: (item) => (
                            <>
                                {format(new Date(item.createdAt), "dd.MM.yyyy")}
                            </>
                        ),
                    },
                    {
                        name: "Заказ",
                        render: (item) => {
                            if (!item.order) return <>--</>;

                            return (
                                <>
                                    {item.order.type?.name}
                                    {": "}
                                    <Link
                                        as={NavLink}
                                        to={`${ROUTES.orders.path}?search=${item.order.order_id}`}
                                        color="blue.500"
                                    >
                                        #{item.order.order_id}
                                    </Link>
                                </>
                            );
                        },
                    },
                    {
                        name: "Товарная позиция",
                        render: (item) => {
                            if (!item.product) return <>--</>;

                            let name = item.product.name;
                            const isLong = name.length > 30;
                            if (isLong) {
                                name = name.slice(0, 30).concat("...");
                            }

                            return (
                                <>
                                    {isLong ? (
                                        <Tooltip label={item.product.name}>
                                            {name}
                                        </Tooltip>
                                    ) : (
                                        name
                                    )}
                                </>
                            );
                        },
                    },
                ]}
                rows={items}
            />
        </VStack>
    );
};

export default Requests;

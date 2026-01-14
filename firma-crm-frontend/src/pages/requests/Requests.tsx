import React, { useCallback, useEffect, useState } from "react";
import Page from "../../components/ui/page/Page";
import useTitle from "../../hooks/useTitle";
import socketIO from "socket.io-client";
import { API_URL } from "../../axios";
import { IRequest } from "../../models/IRequest";
import Loader from "../../components/ui/loader/Loader";
import requestService from "../../services/request-service";
import { SUCCESS_POST } from "../../const/http-codes";
import {
    Checkbox,
    Flex,
    Progress,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import useAppToast from "../../hooks/useAppToast";
import RequestItem from "./RequestItem/RequestItem";
import CountryFilter from "../../components/filters/CountryFilter";
import ProductFilter from "../../components/filters/ProductFilter";
import CheckPhone from "./CheckPhone/CheckPhones";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setChecked } from "../../store/slices/request-slice";
import CheckAll from "./CheckAll/CheckAll";

const ITEMS_PER_PAGE = 30;

export type RequestItemType = IRequest & { isNew: boolean };

const Requests = () => {
    useTitle("Заявки");

    const { checked } = useAppSelector((state) => state.request);
    const dispatch = useAppDispatch();

    const { period } = useAppSelector((state) => state.app);

    const [isConnected, setConnected] = useState(false);
    const [fetchLoading, setLoading] = useState(true);
    const [firstLoading, setFirstLoading] = useState(true);

    const [regionIds, setRegionsIds] = useState<number[]>([]);
    const [productIds, setProductIds] = useState<number[]>([]);

    const toast = useAppToast();

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [requests, setRequests] = useState<RequestItemType[]>([]);

    const loading = !isConnected || firstLoading;



    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await requestService.getAll({
                pagination: {
                    page,
                    itemsPerPage: ITEMS_PER_PAGE,
                },
                filters: {
                    regionIds,
                    productIds,
                },
                period,
            });

            if (response.status === SUCCESS_POST) {
                setHasMore(response.data.hasMore);
                setRequests((prev) => [...prev, ...response.data.requests]);
                setFirstLoading(false);
            }
        } catch (e) { }
        setLoading(false);
    }, [page, regionIds, productIds, period]);

    useEffect(() => {
        return () => {
            dispatch(setChecked([]));
        };
    }, [dispatch]);

    useEffect(() => {
        const socket = socketIO(API_URL as any);

        socket.on("request-connected", () => {
            setConnected(true);
        });

        socket.on("request-created", (request: RequestItemType) => {
            if (request.source !== "call")
                toast({ text: "Поступила новая заявка #" + request.id });

            if (new Date(request.createdAt).getDate() === period.to.getDate())
                setRequests((prev) => [request, ...prev]);
        });

        return () => {
            socket.close();
        };
    }, [toast, period]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        setPage(1);
        setRequests([]);
        dispatch(setChecked([]));
    }, [regionIds, productIds, period, dispatch]);

    const allCheckHandler = (e: any) => {
        if (e.target.checked) {
            return dispatch(setChecked(requests.map((req) => req.id)));
        }

        dispatch(setChecked([]));
    };

    if (loading) return <Loader />;

    return (
        <Page>
            <VStack align="stretch" spacing={2}>
                <Flex gap={2} alignItems="center" flexWrap={"wrap"}>
                    <CheckPhone />
                    {!!checked.length && <CheckAll requests={requests} />}
                    <CountryFilter setCoutryIds={setRegionsIds} />
                    <ProductFilter setIds={setProductIds} />
                </Flex>
                {!!requests.length && (
                    <Checkbox
                        isChecked={checked.length === requests.length}
                        onChange={allCheckHandler}
                    >
                        Выбрать все
                    </Checkbox>
                )}
                {fetchLoading && <Progress size="sm" isIndeterminate />}
                {requests.map((request, i) => (
                    <RequestItem request={request} key={i} />
                ))}
                {hasMore &&
                    (fetchLoading ? (
                        <Spinner
                            alignSelf={"center"}
                            color="blue.500"
                            thickness="3px"
                        />
                    ) : (
                        <Text
                            onClick={() => setPage((prev) => prev + 1)}
                            textAlign={"center"}
                            py={1}
                            color="blue.500"
                            cursor={"pointer"}
                            _hover={{ textDecoration: "underline" }}
                        >
                            Еще...
                        </Text>
                    ))}
            </VStack>
        </Page>
    );
};

export default Requests;

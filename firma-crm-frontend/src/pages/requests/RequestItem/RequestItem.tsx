import {
    Checkbox,
    Flex,
    IconButton,
    Link,
    Text,
    Tooltip,
    useMediaQuery,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { FaExclamation, FaEye } from "react-icons/fa";
import { Link as NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { IRequest } from "../../../models/IRequest";
import { ROUTES } from "../../../router/routes";
import { setCheckedPhone } from "../../../store/slices/phone-slice";
import {
    addToChecked,
    removeFromChecked,
} from "../../../store/slices/request-slice";
import { getPathWithParam } from "../../../utils/getPathWithParam";
import RequestPhone from "./RequestPhone";
import RequestSource from "./RequestSource";

type RequestItemProps = {
    request: IRequest;
};

const RequestItem: React.FC<RequestItemProps> = ({ request }) => {
    const { checked } = useAppSelector((state) => state.request);
    const [isSm] = useMediaQuery("(max-width: 480px)");

    const isChecked = useMemo(() => {
        return !!checked.find((id) => id === request.id);
    }, [checked, request]);

    const dispatch = useAppDispatch();
    const borderColor = useMemo(() => {
        const identity = request?.order?.type?.identity;
        if (identity) {
            if (identity === "з.") return "green.400";
            if (identity === "п.") return "orange.300";
        }

        return "dark";
    }, [request?.order?.type?.identity]);

    const checkPhoneHandler = () => {
        const phoneToCheck = request.phone
            .split("")
            .reverse()
            .slice(0, 9)
            .reverse()
            .join("");

        dispatch(setCheckedPhone(phoneToCheck));
    };

    const checkedHandler = (e: any) => {
        if (e.target.checked) return dispatch(addToChecked(request.id));

        return dispatch(removeFromChecked(request.id));
    };

    return (
        <Flex alignItems={"flex-start"} gap={2}>
            <Checkbox isChecked={isChecked} onChange={checkedHandler} />
            <Flex
                flexGrow={1}
                shadow={"base"}
                borderWidth={1}
                borderLeftWidth={5}
                borderLeftColor={borderColor}
                flexDirection="column"
                gap={3}
                pt={2}
                pb={1}
                px={3}
                fontSize={{ base: "3vw", sm: 14 }}
            >
                <Flex
                    gap={{ base: 1, sm: 2 }}
                    alignItems={{ base: "flex-start", sm: "center" }}
                    flexWrap={"wrap"}
                    flexDirection={{ base: "column", sm: "row" }}
                >
                    <Flex
                        gap={2}
                        alignItems="center"
                        w={{ base: "100%", sm: "auto" }}
                    >
                        {request.comment && (
                            <Tooltip label={request.comment} isDisabled={isSm}>
                                <Flex
                                    alignItems={"center"}
                                    gap={1}
                                    flexGrow={{ base: 1, sm: 0 }}
                                    order={{ base: 2, sm: 0 }}
                                    justifyContent="flex-end"
                                >
                                    {isSm && <Text>{request.comment}</Text>}
                                    <FaExclamation color={"red"} />
                                </Flex>
                            </Tooltip>
                        )}
                        <RequestSource source={request.source} />
                        <Link
                            fontWeight={500}
                            target={"_blank"}
                            as={NavLink}
                            to={`${getPathWithParam(
                                ROUTES.projectRequests.path,
                                request.projectId
                            )}?search=${request.id}`}
                        >
                            #{request.id}
                        </Link>
                    </Flex>
                    <Link
                        order={{ lg: 0, sm: 4, base: 0 }}
                        w={{ lg: "auto", base: "100%" }}
                        target={"_blank"}
                        as={NavLink}
                        to={getPathWithParam(
                            ROUTES.projectRequests.path,
                            request.projectId
                        )}
                    >
                        {request.project?.name}
                    </Link>
                    <Flex
                        flexGrow={1}
                        gap={1}
                        justifyContent="flex-end"
                        alignItems={"center"}
                    >
                        {request.name && (
                            <Text textTransform={"capitalize"} as="span">
                                {request.name},
                            </Text>
                        )}
                        <RequestPhone
                            phone={request.phone}
                            regionName={request.project?.country.name}
                        />
                        <IconButton
                            position="static"
                            onClick={checkPhoneHandler}
                            color="blue.500"
                            aria-label="show in price"
                            bg={"transparent"}
                            rounded={20}
                            icon={<FaEye />}
                            size="xs"
                        />
                    </Flex>
                </Flex>
                <Flex gap={2}>
                    {request.order && (
                        <>
                            <Text>
                                Заказ:{" "}
                                <Link
                                    target={"_blank"}
                                    as={NavLink}
                                    to={`${ROUTES.orders.path}?search=${request.order.order_id}`}
                                >
                                    #{request.order.order_id}
                                </Link>
                            </Text>
                            <Text>Статус: {request.order.status}</Text>
                        </>
                    )}
                    <Text flexGrow={1} textAlign="right">
                        {format(
                            new Date(request.createdAt),
                            "HH:mm dd.MM.yyyy"
                        )}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default RequestItem;

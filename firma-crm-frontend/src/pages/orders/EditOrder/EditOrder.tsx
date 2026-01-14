import {
    Button,
    Flex,
    Heading,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { SUCCESS_GET } from "../../../const/http-codes";
import useAppToast from "../../../hooks/useAppToast";
import { IOrder } from "../../../models/IOrder";
import orderService from "../../../services/order-service";
import EditContent from "./EditContent";

type EditOrderModalProps = {
    onClose: () => void;
};

const EditOrderModal: React.FC<EditOrderModalProps> = ({ onClose }) => {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [activeId, setActive] = useState(-1);

    const toast = useAppToast();

    const onKeyDown = (e: any) => {
        if (e.key === "Enter") addOrder();
    };

    const updateOrder = useCallback(
        (order: IOrder) =>
            setOrders((prev) =>
                prev.map((_order) => {
                    if (order.id === _order.id) return order;

                    return _order;
                })
            ),
        []
    );

    const addOrder = async () => {
        if (!search)
            toast({
                status: "error",
                text: "Заполните номер заказа",
            });

        const ids = search
            .split(",")
            .map((id) => Number(id.trim()))
            .filter((id) => !!id)
            .filter((id) => !Number.isNaN(id));

        const newOrders: IOrder[] = [];

        for (let id of ids) {
            try {
                if (orders.find((order) => order.order_id === id))
                    throw new Error(`Заказ с номером ${id} уже добавлен.`);

                setLoading(true);

                const response = await orderService.getById(id);

                if (response.status === SUCCESS_GET) {
                    if (!response.data)
                        throw new Error(`Заказ ${id} не найден.`);
                    if (response.data) {
                        newOrders.push(response.data);
                        setSearch("");
                    }
                }
            } catch (e: any) {
                toast({
                    status: "error",
                    text: e.message,
                });
            }
        }

        setOrders((prev) => [...prev, ...newOrders]);
        if (newOrders.length && activeId === -1) setActive(newOrders[0].id);
        setLoading(false);
    };

    const isActive = (id: number) => id === activeId;
    const removeOrder = (id: number) => (e: any) => {
        e.stopPropagation();
        if (isActive(id)) setActive(-1);

        setOrders(orders.filter((order) => order.id !== id));
    };

    return (
        <Modal
            scrollBehavior="inside"
            size="xl"
            isCentered
            isOpen
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent minH="80vh" maxW="1000px">
                <ModalHeader>Редактор заказов</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4} display="flex" flexDirection="column">
                    <Flex mb={2} gap={2} flexWrap={"wrap"}>
                        <Input
                            isDisabled={loading}
                            autoFocus
                            size="sm"
                            w="100%"
                            maxW={{ base: "100%", sm: "250px" }}
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder="274180, 274192..."
                            onKeyDown={onKeyDown}
                        />
                        <Button
                            w={{ base: "100%", sm: "auto" }}
                            size="sm"
                            colorScheme="green"
                            isLoading={loading}
                            loadingText="Загрузка..."
                            onClick={addOrder}
                        >
                            Добавить
                        </Button>
                    </Flex>
                    <Flex
                        h="100%"
                        flexGrow={1}
                        gap={2}
                        flexDirection={{ base: "column", md: "row" }}
                    >
                        <Flex
                            p={2}
                            gap={1}
                            w={{ base: "100%", md: "200px", lg: "250px" }}
                            borderWidth={1}
                            flexWrap="wrap"
                            as="aside"
                            flexDirection={{ base: "row", md: "column" }}
                        >
                            <Heading
                                w="100%"
                                borderBottomWidth={1}
                                pb={2}
                                size="sm"
                            >
                                Заказы
                            </Heading>
                            {orders.map((order) => (
                                <HStack
                                    onClick={() => setActive(order.id)}
                                    fontSize={14}
                                    fontWeight={500}
                                    key={order.id}
                                    borderLeftWidth={3}
                                    borderColor={
                                        isActive(order.id)
                                            ? "green.600"
                                            : "transparent"
                                    }
                                    bg={
                                        isActive(order.id)
                                            ? "green.500"
                                            : "tranparent"
                                    }
                                    color={
                                        isActive(order.id) ? "white" : "dark"
                                    }
                                    cursor="pointer"
                                    _hover={{
                                        bg: isActive(order.id)
                                            ? "green.500"
                                            : "green.100",
                                    }}
                                    p={2}
                                    py={1}
                                    justifyContent={"space-between"}
                                >
                                    <Text>#{order.order_id}</Text>
                                    <FaMinus onClick={removeOrder(order.id)} />
                                </HStack>
                            ))}
                        </Flex>
                        <EditContent
                            updateOrder={updateOrder}
                            orders={orders}
                            activeId={activeId}
                        />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const EditOrder = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                onClick={onOpen}
                w="100%"
                maxW="300px"
                size="sm"
                colorScheme="blue"
                variant={"outline"}
            >
                Править заказы
            </Button>
            {isOpen && <EditOrderModal onClose={onClose} />}
        </>
    );
};

export default EditOrder;

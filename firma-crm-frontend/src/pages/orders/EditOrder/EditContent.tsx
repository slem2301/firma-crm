import {
    Button,
    Flex,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmDialog from "../../../components/confirmDialog/ConfirmDialog";
import { SUCCESS_DELETE, SUCCESS_PUT } from "../../../const/http-codes";
import useAppToast from "../../../hooks/useAppToast";
import { IOrder } from "../../../models/IOrder";
import orderService from "../../../services/order-service";
import OrderField, { Field } from "./OrderField";

type EditContentProps = {
    orders: IOrder[];
    activeId: number;
    updateOrder: (order: IOrder) => void;
};

const EditContent: React.FC<EditContentProps> = ({
    orders,
    activeId,
    updateOrder,
}) => {
    const active = useMemo(() => {
        return orders.find((order) => order.id === activeId);
    }, [activeId, orders]);

    return (
        <VStack spacing={1} align="stretch" borderWidth={1} p={2} flexGrow={1}>
            <Heading size="sm" pb={2} borderBottomWidth={1}>
                Редактирование{active && `, #${active.order_id}`}
            </Heading>
            {orders.map((order) => (
                <OrderFields
                    updateOrder={updateOrder}
                    key={order.id}
                    order={order}
                    isActive={order.id === activeId}
                />
            ))}
        </VStack>
    );
};

type OrderFieldsProps = {
    order: IOrder;
    isActive: boolean;
    updateOrder: (order: IOrder) => void;
};

const OrderFields: React.FC<OrderFieldsProps> = ({
    order,
    isActive,
    updateOrder,
}) => {
    const toast = useAppToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const blocks = useMemo(() => {
        if (!order.block) return [];

        return order.block.fields.split(";");
    }, [order]);

    const { register, handleSubmit, watch, setValue } = useForm({
        mode: "onBlur",
    });

    const [loading, setLoading] = useState(false);
    const [clearLoading, setClearLoading] = useState(false);

    const otkat = watch("otkat");
    const [dealerOtkatPercent, setDealerOtkatPercent] = useState(
        getDealerOtkatFromOrder(order)
    );

    const DealerOtkatName = (
        <Flex gap={2} alignItems="center">
            <Text as="span">Откат диллеру</Text>
            <NumberInput
                w="63px"
                size="sm"
                precision={1}
                min={1}
                max={100}
                step={0.1}
                value={dealerOtkatPercent}
                onChange={(value) => {
                    if (!Number.isNaN(Number(value)))
                        setDealerOtkatPercent(value);
                }}
            >
                <NumberInputField bg="white" ps={0.5} />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            %
        </Flex>
    );

    const fields: Field[] = useMemo(
        () => [
            {
                name: "Номер заказа",
                isDisabled: true,
                key: "order_id",
            },
            {
                name: "Дата оформления",
                isDisabled: true,
                key: "date",
                formatValue: (date) =>
                    format(new Date(date), "dd.MM.yyyy HH:mm"),
            },
            {
                name: "Склад",
                key: "stock",
                isDisabled: true,
            },
            {
                name: "Статус",
                key: "status",
                isDisabled: true,
            },
            {
                name: "Откат",
                isDisabled: false,
                key: "otkat",
                type: "number",
            },
            {
                name: "replace",
                isDisabled: true,
                key: "dealerOtkat",
            },
            {
                name: (
                    <Text as="span">
                        Пометка{" "}
                        <Text as="span" fontSize={".7em"}>
                            (метка_диллера&nbsp;&nbsp;тип_заказа&nbsp;&nbsp;информация)
                        </Text>
                    </Text>
                ),
                isDisabled: false,
                key: "info",
                isTextArea: true,
            },
        ],
        []
    );

    const setValuesFromOrder = useCallback(() => {
        fields.forEach((field) => {
            const value = order[field.key] as string;

            if (field.key === "dealerOtkat") return;
            setValue(
                field.key,
                field.formatValue ? field.formatValue(value) : value
            );
        });
    }, [order, fields, setValue]);

    useEffect(() => {
        setValue(
            "dealerOtkat",
            (otkat * (Number(dealerOtkatPercent) / 100)).toFixed(2)
        );
    }, [otkat, dealerOtkatPercent, setValue]);

    useEffect(() => {
        setDealerOtkatPercent(getDealerOtkatFromOrder(order));
    }, [order]);

    useEffect(() => {
        setValuesFromOrder();
    }, [setValuesFromOrder]);

    const saveHandler = async (data: any) => {
        const convertedData = Object.keys(data).reduce((result: any, key) => {
            if (typeof order[key as keyof IOrder] === "number")
                result[key] = Number(data[key]);
            else result[key] = data[key];

            return result;
        }, {});

        const edited: any = Object.keys(convertedData).reduce(
            (result: any, key) => {
                const field = fields.find((field) => field.key === key);
                if (field?.formatValue) return result;

                if (order[key as keyof IOrder] !== convertedData[key])
                    result[key] = convertedData[key];

                return result;
            },
            {}
        );

        const editedKeys = Object.keys(edited);

        if (!editedKeys.length)
            return toast({
                status: "info",
                text: "Изменения в заказе не обнаружены",
            });

        setLoading(true);

        try {
            const response = await orderService.update({
                order: {
                    ...order,
                    ...edited,
                },
                fields: Array.from(new Set([...editedKeys, ...blocks])).join(
                    ";"
                ),
            });

            if (response.status === SUCCESS_PUT) {
                updateOrder(response.data);
                toast({ text: `Заказ ${order.order_id} успешно обновлен` });
            }
        } catch (e) {}

        setLoading(false);
    };

    const clearBlocksHandler = async () => {
        setClearLoading(true);
        try {
            const response = await orderService.clearBlocks(order.order_id);

            if (response.status === SUCCESS_DELETE) {
                toast({
                    text: `Заказ ${order.order_id} успешно очищен от запретов на парсинг`,
                });
                updateOrder(response.data);
            }
        } catch (e) {}
        setClearLoading(false);

        onClose();
    };

    return isActive ? (
        <>
            <VStack spacing={1} align="stretch">
                {fields.map((field) => {
                    const _field: Field = { ...field };

                    if (_field.name === "replace")
                        _field.name = DealerOtkatName;

                    return (
                        <OrderField
                            isLoading={loading || clearLoading}
                            blocks={blocks}
                            register={register}
                            field={_field}
                            key={field.key}
                        />
                    );
                })}
            </VStack>
            <HStack
                pt={2}
                borderTopWidth={1}
                flexGrow={1}
                justifyContent="space-between"
                align="flex-end"
            >
                <Button
                    size="sm"
                    isLoading={clearLoading}
                    loadingText={"Отмена..."}
                    colorScheme="blue"
                    isDisabled={loading}
                    onClick={onOpen}
                >
                    Отменить изменения
                </Button>
                <Button
                    onClick={handleSubmit(saveHandler)}
                    size="sm"
                    colorScheme="green"
                    isLoading={loading}
                    isDisabled={clearLoading}
                    loadingText={"Сохранение..."}
                >
                    Сохранить
                </Button>
            </HStack>
            <ConfirmDialog
                onAccept={clearBlocksHandler}
                onCancel={onClose}
                isOpen={isOpen}
                title="Отмена изменений"
                text="При подтверждении отмены изменений, снимутся все запреты на парсинг полей (при парсинге все изменения затрутся на новые)"
            />
        </>
    ) : null;
};

export default EditContent;

const getDealerOtkatFromOrder = (order: IOrder) =>
    ((order.dealerOtkat / order.otkat) * 100).toFixed(1);

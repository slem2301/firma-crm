import {
    Box,
    Checkbox,
    Flex,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Button from "../../../components/ui/button/Button";
import ModalLoader from "../../../components/ui/modal-loading/ModalLoader";
import { SUCCESS_POST } from "../../../const/http-codes";
import { useAppSelector } from "../../../hooks/redux";
import useAppToast from "../../../hooks/useAppToast";
import { IOrder } from "../../../models/IOrder";
import excelService from "../../../services/excel-service";
import SelectedItems from "./SelectedItems";
import {
    getSelectedOrderStatuses,
    getSelectedOrderTypes,
    getSelectedProductTypes,
    getSelectedRegions,
} from "./selectors";

interface DownloadExcelReportModalProps {
    regionIds: number[];
    period: { from: Date; to: Date };
    productTypeIds: number[];
    orderTypeIds: number[];
    statusIds: number[];
    routeDate: boolean;
    onClose: () => void;
    isOpen: boolean;
}

const fields: Array<{
    key: keyof IOrder;
    name: string;
    isDisabled?: boolean;
}> = [
    {
        name: "ID",
        key: "order_id",
        isDisabled: true,
    },
    {
        name: "Дата оформления",
        key: "date",
    },
    {
        name: "Дата маршрута",
        key: "date_route",
    },
    {
        name: "Номера",
        key: "phones",
    },
    {
        name: "Цена",
        key: "price",
    },
    {
        name: "Откат",
        key: "otkat",
    },
    {
        name: "Откат диллера",
        key: "dealerOtkat",
    },
    {
        name: "Только с предыдущими заказами",
        key: "hasPrevOrders",
    },
];

const fieldsObj = fields.reduce(
    (
        result: Record<
            string,
            {
                key: keyof IOrder;
                name: string;
                isDisabled?: boolean;
            }
        >,
        field
    ) => {
        result[field.key] = field;
        return result;
    },
    {}
);

export const DownloadExcelReportModal: React.FC<
    DownloadExcelReportModalProps
> = (props) => {
    const {
        regionIds,
        productTypeIds,
        period,
        orderTypeIds,
        statusIds,
        routeDate,
        onClose,
        isOpen,
    } = props;
    const regions = useAppSelector(getSelectedRegions(regionIds));
    const productTypes = useAppSelector(
        getSelectedProductTypes(productTypeIds)
    );
    const orderTypes = useAppSelector(getSelectedOrderTypes(orderTypeIds));
    const statuses = useAppSelector(getSelectedOrderStatuses(statusIds));
    const toast = useAppToast();

    const [selectedFields, setSelectedFields] = useState<
        Record<string, boolean>
    >({
        order_id: true,
        date: true,
        date_route: false,
        otkat: false,
        dealerOtkat: false,
        hasPrevOrders: true,
    });

    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);

        const fields = Object.keys(selectedFields)
            .filter((key) => selectedFields[key])
            .map((key) => fieldsObj[key]);

        try {
            const response = await excelService.downloadOrdersReport({
                regionIds,
                productTypeIds,
                period,
                orderTypeIds,
                statusIds,
                routeDate,
                fields,
            });

            if (response.status === SUCCESS_POST) {
                const fileName = response.headers["filename"];
                const reader = new FileReader();
                const blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                reader.readAsDataURL(blob);
                reader.onload = function () {
                    const URL = reader.result as string;
                    var anchorElem = document.createElement("a");
                    anchorElem.style.display = "none";
                    anchorElem.href = URL;
                    anchorElem.download = fileName;
                    document.body.appendChild(anchorElem);
                    anchorElem.click();
                    document.body.removeChild(anchorElem);
                    onClose();
                    setTimeout(function () {
                        window.URL.revokeObjectURL(URL);
                    }, 1000);
                };
            }
        } catch (e) {
            console.log(e);
            toast({
                status: "error",
                text: "Произошло ошибка, попробуйте снова",
            });
        }
        setLoading(false);
    };

    const handleSetSelected =
        (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedFields((prev) => ({ ...prev, [key]: e.target.checked }));

    return (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            {loading ? (
                <ModalLoader />
            ) : (
                <ModalContent>
                    <ModalHeader>
                        <ModalCloseButton />
                        <Heading size="md">Выгружаемые данные:</Heading>
                    </ModalHeader>
                    <ModalBody>
                        <VStack align="flex-start">
                            <Flex gap={2} flexWrap="wrap">
                                <b>Поля:</b>
                                {fields.map((field) => (
                                    <Box p={2} bg="gray.100" key={field.key}>
                                        <Checkbox
                                            isChecked={
                                                !!selectedFields[field.key]
                                            }
                                            isDisabled={!!field.isDisabled}
                                            onChange={handleSetSelected(
                                                field.key
                                            )}
                                        >
                                            {field.name}
                                        </Checkbox>
                                    </Box>
                                ))}
                            </Flex>
                            <SelectedItems items={regions} title="Регион" />
                            <SelectedItems
                                items={productTypes}
                                title="Продуктовая позиция"
                                anyText="Любая"
                            />
                            <SelectedItems
                                items={orderTypes}
                                title="Тип заказа"
                            />
                            <SelectedItems
                                items={statuses}
                                title="Статус заказа"
                            />
                            <HStack>
                                <b>Период:</b>{" "}
                                <span>
                                    {period.from.toLocaleDateString("ru")}
                                </span>
                                <span>-</span>
                                <span>
                                    {period.to.toLocaleDateString("ru")}
                                </span>
                            </HStack>
                            <div>
                                <b>Дата маршрута:</b> {routeDate ? "Да" : "Нет"}
                            </div>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={2} colorScheme="gray" onClick={onClose}>
                            Отмена
                        </Button>
                        <Button onClick={handleDownload} colorScheme="green">
                            Выгрузить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            )}
        </Modal>
    );
};

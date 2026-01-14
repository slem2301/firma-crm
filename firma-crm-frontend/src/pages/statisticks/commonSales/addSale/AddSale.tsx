import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    HStack,
    VStack,
    Input,
    useConst,
    Flex,
    Box,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { FaPlus } from "react-icons/fa";
import { SUCCESS_POST } from "../../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import useAppToast from "../../../../hooks/useAppToast";
import { ISale } from "../../../../models/ISale";
import saleService from "../../../../services/sale-service";
import {
    clearAddSaleData,
    setBulcSaleData,
} from "../../../../store/slices/sale-slice";
import RegionColumn from "./RegionColumn";

type AddSaleProps = {
    update: () => void;
};

const AddSale: React.FC<AddSaleProps> = ({ update }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                leftIcon={<FaPlus />}
                onClick={onOpen}
                size="sm"
                colorScheme="green"
            >
                Добавить запись
            </Button>
            {isOpen && <AddSaleModal update={update} onClose={onClose} />}
        </>
    );
};

type AddSaleModalProps = {
    onClose: () => void;
    update: () => void;
};

const AddSaleModal: React.FC<AddSaleModalProps> = ({ onClose, update }) => {
    const {
        country: { countries },
        product: { products: _products },
        sale: { addSaleData },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    const products = useMemo(
        () => _products.filter((product) => product.name !== "Прочее"),
        [_products]
    );

    const [loading, setLoading] = useState(true);
    const toast = useAppToast();

    const currentDate = useConst(() => {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        return date;
    });
    const [date, setDate] = useState(currentDate);

    const fetchData = useCallback(async () => {
        setLoading(true);
        dispatch(clearAddSaleData());
        try {
            const response = await saleService.getSalesByDate(date);

            if (response.status === SUCCESS_POST) {
                const data: any = {};
                countries.forEach((country) => {
                    products.forEach((product) => {
                        data[`${country.id}-${product.id}`] = "";
                    });
                });

                dispatch(
                    setBulcSaleData({
                        ...data,
                        ...response.data.reduce((result: any, sale: ISale) => {
                            result[`${sale.countryId}-${sale.productId}`] =
                                sale.count ? sale.count.toString() : "";

                            return result;
                        }, {}),
                    })
                );
            }
        } catch (e) {}
        setLoading(false);
    }, [date, dispatch, countries, products]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        return () => {
            dispatch(clearAddSaleData());
        };
    }, [dispatch]);

    const saveSales = async () => {
        const sales: ISale[] = [];
        Object.keys(addSaleData).forEach((key) => {
            const splitted = key.split("-");
            const countryId = Number(splitted[0]);
            const productId = Number(splitted[1]);
            const obj: any = {};
            sales.push({
                ...obj,
                countryId,
                productId,
                count: Number(addSaleData[key] || 0),
                date: date.toString(),
            });
        });

        setLoading(true);
        try {
            const response = await saleService.addSales(sales);

            if (response.status === SUCCESS_POST) {
                toast({ text: "Запись добавлена успешно" });
                onClose();
                update();
            }
        } catch (e) {}
        setLoading(false);
    };

    const loadSales = async () => {
        setLoading(true);
        try {
            const response = await saleService.loadSales(date);

            if (response.status === SUCCESS_POST) {
                toast({ text: response.data.message });
                onClose();
                update();
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response?.data.message)
                toast({ text: error.response.data.message, status: "error" });
        }
        setLoading(false);
    };

    return (
        <Modal isOpen onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="1000px">
                <ModalHeader>Добавление записи продаж</ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    px={{ base: 4, sm: 6 }}
                    h="100%"
                    overflow="auto"
                    maxH="65vh"
                >
                    <VStack align="stretch">
                        <HStack>
                            <Box maxW="300px">
                                <ReactDatePicker
                                    locale={"ru"}
                                    onChange={(date) =>
                                        setDate(date || currentDate)
                                    }
                                    selected={date}
                                    dateFormat="dd.MM.yyyy"
                                    customInput={
                                        <Input
                                            size="sm"
                                            placeholder="Выберите дату"
                                        />
                                    }
                                />
                            </Box>

                            <Button
                                size="sm"
                                colorScheme="green"
                                isLoading={loading}
                                loadingText="Загрузка..."
                                onClick={loadSales}
                            >
                                Загрузить
                            </Button>
                        </HStack>
                        <Flex h="100%" w="auto" gap={2} flexWrap="wrap">
                            {countries.map((region, i) => (
                                <RegionColumn
                                    loading={loading}
                                    regionIndex={i}
                                    key={region.id}
                                    region={region}
                                />
                            ))}
                        </Flex>
                    </VStack>
                </ModalBody>
                <ModalFooter as={HStack}>
                    <Button size="sm" colorScheme="gray" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button size="sm" colorScheme="green" onClick={saveSales}>
                        Сохранить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddSale;

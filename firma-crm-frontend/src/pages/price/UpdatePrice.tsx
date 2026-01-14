import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tooltip,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { VscEdit } from "react-icons/vsc";
import SingleSelectFilter from "../../components/filters/SingleSelectFilter";
import { SUCCESS_PUT } from "../../const/http-codes";
import useAppToast from "../../hooks/useAppToast";
import { IPrice, priceSignature } from "../../models/IPrice";
import priceService from "../../services/price-service";
import { nameAssociations } from "./Price";

type UpdatePriceProps = {
    record: IPrice;
    update: () => void;
};

const filterKeys = (keys: string[]) =>
    keys.filter((key) => {
        if (key === "product_id") return false;
        if (key === "price_delivery_br") return false;
        if (key === "price_delivery_ru") return false;
        if (key === "exchange_br") return false;
        if (key === "exchange_ru") return false;

        return true;
    });

const UpdatePrice: React.FC<UpdatePriceProps> = ({ record, update }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [editableKey, setEditableKey] = useState("price_rb");
    const toast = useAppToast();

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(record[editableKey as keyof IPrice]?.toString() || "");
    }, [editableKey, record]);

    const onSubmit = useCallback(async () => {
        if (!value)
            return toast({
                text: "Введите значение.",
                status: "error",
            });

        const type = typeof priceSignature[editableKey as keyof IPrice];
        const typedValue = type === "number" ? Number(value) : value;

        setLoading(true);
        try {
            const response = await priceService.update({
                ...record,
                [editableKey as keyof IPrice]: typedValue,
            });

            if (response.status === SUCCESS_PUT) {
                toast({
                    text: "Запись обновлена успешно",
                    status: "success",
                });
                await update();
                onClose();
            }
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }, [toast, value, record, editableKey, update, onClose]);

    return (
        <>
            <Tooltip
                size="xs"
                label="Изменить запись"
                openDelay={1000}
                fontSize={"12px"}
            >
                <IconButton
                    position="static"
                    rounded={2}
                    onClick={onOpen}
                    aria-label="add"
                    fontSize={"10px"}
                    w={"20px"}
                    minW={"20px"}
                    h={"20px"}
                    icon={<VscEdit />}
                    size="xs"
                    colorScheme={"blue"}
                />
            </Tooltip>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader pr={9} fontSize={"16px"}>
                            {record.name}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack align={"stretch"}>
                                <FormLabel mb={0}>Поле</FormLabel>
                                <SingleSelectFilter<string>
                                    options={filterKeys(
                                        Object.keys(nameAssociations)
                                    ).map((key) => ({
                                        name: nameAssociations[key],
                                        value: key,
                                    }))}
                                    setValue={setEditableKey}
                                    defaultValue={editableKey}
                                />
                                <FormControl>
                                    <FormLabel>Значение</FormLabel>
                                    <Input
                                        size="sm"
                                        placeholder="Введите значние"
                                        value={value}
                                        onChange={(e) =>
                                            setValue(e.target.value)
                                        }
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                disabled={loading}
                                size="sm"
                                colorScheme="blue"
                                mr={3}
                                onClick={onClose}
                                rounded={2}
                            >
                                Отмена
                            </Button>
                            <Button
                                isLoading={loading}
                                onClick={onSubmit}
                                size="sm"
                                rounded={2}
                                colorScheme="green"
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default UpdatePrice;

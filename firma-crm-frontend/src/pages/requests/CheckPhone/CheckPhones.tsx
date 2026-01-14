import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useBoolean,
    useDisclosure,
    useMediaQuery,
    VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import { SUCCESS_GET } from "../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useAppToast from "../../../hooks/useAppToast";
import phoneService from "../../../services/phone-service";
import { setCheckedPhone } from "../../../store/slices/phone-slice";
import MobileViewItem from "./MobileViewItem";

export type InfoType = {
    id: number;
    phones: string[];
    products: string[];
    date: string;
    dealer: string;
    price: number;
    status: string;
};

type CheckPhoneModalProps = {
    onClose: () => void;
    isOpen: boolean;
};

const CheckPhoneModal: React.FC<CheckPhoneModalProps> = ({
    onClose,
    isOpen,
}) => {
    const [isSm] = useMediaQuery("(max-width: 575px)");

    const { checkedPhone } = useAppSelector((state) => state.phone);
    const dispatch = useAppDispatch();

    const [phoneToCheck, setPhoneToCheck] = useState(checkedPhone || "");
    const toast = useAppToast();
    const [loading, setLoading] = useBoolean(false);
    const [info, setInfo] = useState<null | InfoType[]>(null);
    const [requestedPhone, setRequestedPhone] = useState("");

    const checkPhone = useCallback(
        async (phone: string) => {
            setLoading.on();
            setInfo(null);
            setRequestedPhone("");

            dispatch(setCheckedPhone(""));

            try {
                const response = await phoneService.checkPhone(phone);

                if (response.status === SUCCESS_GET) {
                    setInfo(response.data);
                    setRequestedPhone(phone);
                    setPhoneToCheck("");
                }
            } catch (e) {
                const error = e as AxiosError<{ message: string }>;
                if (error?.response?.data)
                    toast({
                        status: "error",
                        text: error.response.data.message,
                    });
            }
            setLoading.off();
        },
        [toast, setLoading, dispatch]
    );

    const onSubmit = async (e: any) => {
        e.preventDefault();
        checkPhone(phoneToCheck);
    };

    useEffect(() => {
        if (checkedPhone) {
            setPhoneToCheck(checkedPhone);
            checkPhone(checkedPhone);
        }
    }, [checkedPhone, checkPhone]);

    return (
        <Modal
            scrollBehavior="inside"
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
        >
            <ModalOverlay />
            <ModalContent
                mx="16px"
                maxW={info && info.length ? "1000px" : "500px"}
            >
                <ModalHeader>Проверка номера</ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    pb={6}
                    px={{ base: 3, sm: 6 }}
                    as="form"
                    onSubmit={onSubmit}
                >
                    <Input
                        autoFocus
                        isDisabled={loading}
                        value={phoneToCheck}
                        onChange={(e) => setPhoneToCheck(e.target.value)}
                        isRequired
                        placeholder="Введите номер"
                        type="tel"
                        w="100%"
                        textAlign={"center"}
                    />
                    <Button
                        variant={"outline"}
                        isLoading={loading}
                        loadingText={"Проверка..."}
                        type="submit"
                        mt={3}
                        w="100%"
                        colorScheme="blue"
                    >
                        Проверить
                    </Button>
                    {info && (
                        <VStack mt={3} align="stretch">
                            <Text>
                                Информация по номеру: <b>{requestedPhone}</b>
                            </Text>
                            {info.length ? (
                                isSm ? (
                                    info.map((item, i) => (
                                        <MobileViewItem item={item} key={i} />
                                    ))
                                ) : (
                                    <Table<InfoType>
                                        rows={info}
                                        headers={[
                                            {
                                                key: "id",
                                                name: "Номер заказа",
                                                sortable: false,
                                                ...commonProps,
                                            },
                                            {
                                                key: "price",
                                                sortable: false,
                                                name: "Сумма заказа",
                                                render: (item) => (
                                                    <Text>
                                                        {item.price} руб.
                                                    </Text>
                                                ),
                                                ...commonProps,
                                            },
                                            {
                                                key: "phones",
                                                name: "Телефоны",
                                                sortable: false,
                                                render: (item) => (
                                                    <>
                                                        {item.phones.map(
                                                            (phone, i) => (
                                                                <Text
                                                                    key={i}
                                                                    as="p"
                                                                >
                                                                    {phone}
                                                                </Text>
                                                            )
                                                        )}
                                                    </>
                                                ),
                                                ...commonProps,
                                            },
                                            {
                                                key: "products",
                                                name: "Товары",
                                                sortable: false,
                                                ...commonProps,
                                                render: (item) => (
                                                    <VStack
                                                        align="stretch"
                                                        spacing={1}
                                                    >
                                                        {item.products.map(
                                                            (product, i) => (
                                                                <Text
                                                                    key={i}
                                                                    whiteSpace={
                                                                        "break-spaces"
                                                                    }
                                                                    maxW={
                                                                        "300px"
                                                                    }
                                                                    lineHeight={
                                                                        1
                                                                    }
                                                                    as="p"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: product,
                                                                    }}
                                                                ></Text>
                                                            )
                                                        )}
                                                    </VStack>
                                                ),
                                            },
                                            {
                                                key: "date",
                                                sortable: false,
                                                name: "Дата",
                                                ...commonProps,
                                            },
                                            {
                                                key: "dealer",
                                                sortable: false,
                                                name: "Диллер",
                                                ...commonProps,
                                            },
                                            {
                                                key: "status",
                                                sortable: false,
                                                name: "Статус",
                                                ...commonProps,
                                            },
                                        ]}
                                    />
                                )
                            ) : (
                                <Text>
                                    Заказов на этот номер не обнаружено.
                                </Text>
                            )}
                        </VStack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const CheckPhone: React.FC = () => {
    const { checkedPhone } = useAppSelector((state) => state.phone);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (checkedPhone) {
            onOpen();
        }
    }, [onOpen, checkedPhone]);

    return (
        <>
            <Button
                w={{ base: "100%", xs: "auto" }}
                colorScheme="blue"
                size="sm"
                onClick={onOpen}
            >
                Проверить номер
            </Button>
            <CheckPhoneModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default CheckPhone;

const commonProps: any = {
    props: {
        fontSize: {
            base: "10px",
            sm: "12px",
        },
    },
    rowProps: {
        fontSize: {
            base: "12px",
            sm: "14px",
        },
    },
};

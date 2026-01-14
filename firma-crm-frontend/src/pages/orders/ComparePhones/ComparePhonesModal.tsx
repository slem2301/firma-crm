import {
    Box,
    Flex,
    HStack,
    Heading,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import Button from "../../../components/ui/button/Button";
import ModalLoader from "../../../components/ui/modal-loading/ModalLoader";
import orderService from "../../../services/order-service";
import { SUCCESS_POST } from "../../../const/http-codes";
import { ComparePhonesResult } from "./types";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../../../router/routes";

interface ComparePhonesModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export const ComparePhonesModal: React.FC<ComparePhonesModalProps> = (
    props
) => {
    const { onClose, isOpen } = props;
    const [value, setValue] = useState("");
    const [result, setResult] = useState<ComparePhonesResult[] | null>(null);

    const phones = useMemo(() => {
        return value.split("\n").filter(Boolean);
    }, [value]);

    const [loading, setLoading] = useState(false);

    const handleCompare = () => {
        setLoading(true);
        orderService
            .comparePhones(phones)
            .then((r) => {
                setResult(r.status === SUCCESS_POST ? r.data : null);
                setValue("");
            })
            .finally(() => setLoading(false));
    };

    const handleReset = () => {
        setValue("");
        setResult(null);
    };

    return (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            {loading ? (
                <ModalLoader />
            ) : (
                <ModalContent>
                    <ModalHeader>
                        <ModalCloseButton />
                        <Heading size="md">Сопоставление номеров</Heading>
                    </ModalHeader>
                    <ModalBody>
                        {result ? (
                            <>
                                <Text>Результаты: {result.length}</Text>
                                <Box maxH={"60vh"} overflowY={"auto"}>
                                    {result.map((data, idx) => {
                                        return (
                                            <HStack
                                                key={idx}
                                                alignItems={"flex-start"}
                                                spacing={2}
                                                mt={2}
                                                borderBottomWidth={1}
                                                pb={1}
                                            >
                                                <Text w={"40%"}>
                                                    {data.phone.initial}
                                                </Text>
                                                <Flex
                                                    w={"60%"}
                                                    flexDir={"column"}
                                                >
                                                    {data.orders.map(
                                                        (order, idx) => {
                                                            return (
                                                                <Link
                                                                    as={
                                                                        RouterLink
                                                                    }
                                                                    to={`${ROUTES.orders.path}?search=${order.order_id}`}
                                                                    target="_blank"
                                                                >
                                                                    <strong>
                                                                        {
                                                                            order
                                                                                .type
                                                                                ?.name
                                                                        }
                                                                    </strong>{" "}
                                                                    - #
                                                                    {
                                                                        order.order_id
                                                                    }
                                                                </Link>
                                                            );
                                                        }
                                                    )}
                                                </Flex>
                                            </HStack>
                                        );
                                    })}
                                </Box>
                            </>
                        ) : (
                            <>
                                {phones.length > 0 && (
                                    <Text>Номеров: {phones.length}</Text>
                                )}
                                <Textarea
                                    minH={"50vh"}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Номера"
                                />
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={2} colorScheme="gray" onClick={onClose}>
                            Отмена
                        </Button>
                        {result && (
                            <Button
                                mr={2}
                                colorScheme="blue"
                                onClick={handleReset}
                            >
                                Сбросить
                            </Button>
                        )}
                        <Button
                            colorScheme="green"
                            isDisabled={!phones.length}
                            onClick={handleCompare}
                            isLoading={loading}
                            loadingText={"Сопоставление..."}
                        >
                            Сопоставить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            )}
        </Modal>
    );
};

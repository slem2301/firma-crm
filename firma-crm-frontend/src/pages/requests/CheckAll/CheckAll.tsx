import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import ModalLoader from "../../../components/ui/modal-loading/ModalLoader";
import { SUCCESS_GET } from "../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useAppToast from "../../../hooks/useAppToast";
import { IRequest } from "../../../models/IRequest";
import phoneService from "../../../services/phone-service";
import { setChecked } from "../../../store/slices/request-slice";
import { InfoType } from "../CheckPhone/CheckPhones";
import CheckAllItem from "./CheckAllItem";

type CheckAllProps = {
    requests: IRequest[];
};

type ItemToCheck = {
    id: number;
    phone: string;
};

export type ResultItem = {
    info: InfoType[];
    phone: string;
    id: number;
};

const CheckAll: React.FC<CheckAllProps> = ({ requests }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { checked } = useAppSelector((state) => state.request);
    const dispatch = useAppDispatch();

    const toast = useAppToast();

    const [loaded, setLoaded] = useState(0);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState<ResultItem[] | null>(null);

    const aborted = useRef<boolean>(false);

    const closeHandler = () => {
        onClose();
        setResult(null);
        setLoaded(0);
        dispatch(setChecked([]));
    };

    const fetchResults = async (items: ItemToCheck[]) => {
        setLoading(true);
        const result: ResultItem[] = [];

        for (const item of items) {
            if (aborted.current) return;

            try {
                const response = await phoneService.checkPhone(item.phone);

                if (response.status === SUCCESS_GET) {
                    result.push({
                        id: item.id,
                        phone: item.phone,
                        info: response.data,
                    });
                    setLoaded((prev) => prev + 1);
                }
            } catch (e) {
                toast({
                    status: "error",
                    text: "Ошибка проверки номеров. Попробуйте позже.",
                });
                cancelLoading();
            }
        }

        setResult(result);
        setLoading(false);
    };

    const cancelLoading = () => {
        closeHandler();
        aborted.current = true;
    };

    const checkHandler = () => {
        aborted.current = false;
        const items: ItemToCheck[] = requests
            .filter((req) => !!checked.find((id) => id === req.id))
            .map((req) => ({
                id: req.id,
                phone: req.phone
                    .split("")
                    .reverse()
                    .slice(0, 9)
                    .reverse()
                    .join(""),
            }));

        fetchResults(items);
        onOpen();
    };

    return (
        <>
            <Button
                w={{ base: "100%", xs: "auto" }}
                onClick={checkHandler}
                colorScheme="blue"
                size="sm"
            >
                Проверить выбранные ({checked.length})
            </Button>
            <Modal
                scrollBehavior="inside"
                isOpen={isOpen}
                onClose={closeHandler}
            >
                <ModalOverlay />
                {loading ? (
                    <ModalLoader
                        onCancel={cancelLoading}
                        text={`Загружено ${loaded}/${checked.length}`}
                    />
                ) : (
                    <ModalContent maxW="1000px">
                        <ModalCloseButton />
                        <ModalHeader>Отчёт:</ModalHeader>
                        <ModalBody pb={5}>
                            <VStack align="stretch">
                                {result &&
                                    result.map((item) => (
                                        <CheckAllItem
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                )}
            </Modal>
        </>
    );
};

export default CheckAll;

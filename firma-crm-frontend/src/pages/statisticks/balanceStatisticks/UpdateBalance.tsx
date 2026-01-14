import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
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
import React, { useEffect, useState } from "react";
import { VscEdit } from "react-icons/vsc";
import { SUCCESS_PUT } from "../../../const/http-codes";
import useAppToast from "../../../hooks/useAppToast";
import { IBalanceStatisticks } from "../../../models/IStatisticks";
import statisticksService from "../../../services/statisticks-service";
import { AdType } from "../../../models/IAd";

type UpdateBalanceProps = {
    ad: IBalanceStatisticks;
    update: () => void;
    type: AdType;
};

const UpdateBalance: React.FC<UpdateBalanceProps> = ({ ad, update, type }) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const toast = useAppToast();

    const [loading, setLoading] = useState(false);

    const [balance, setBalance] = useState(ad.balance.toString());
    const [delay, setDelay] = useState(ad.delay.toString());

    const onSubmit = async () => {
        const prev: any = {};
        setLoading(true);
        try {
            const response = await statisticksService.updateBalances({
                ...prev,
                id: ad.id,
                balance: balance || 0,
                delay: delay || 0,
            });
            if (response.status === SUCCESS_PUT) {
                closeHandler();
                toast({
                    text: "Баланс обновлён успешно",
                    status: "success",
                    title: ad.login,
                });
                await update();
            }
        } catch (e) {}
        setLoading(false);
    };

    const closeHandler = () => {
        onClose();
    };

    useEffect(() => {
        setBalance(ad.balance.toString());
        setDelay(ad.delay.toString());
    }, [ad]);

    return (
        <>
            <Tooltip
                size="xs"
                label="Изменить баланс"
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
                <Modal isOpen={isOpen} onClose={closeHandler}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{ad.login}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack align={"stretch"}>
                                <FormControl>
                                    <FormLabel>Баланс</FormLabel>
                                    <InputGroup size="sm">
                                        <Input
                                            type="number"
                                            placeholder={`0 ${ad.currency.symbol}`}
                                            value={balance}
                                            onChange={(e) =>
                                                setBalance(e.target.value)
                                            }
                                        />
                                        <InputRightAddon
                                            children={ad.currency.symbol}
                                        />
                                    </InputGroup>
                                </FormControl>
                                {type === "yandex" && (
                                    <FormControl>
                                        <FormLabel>Отсрочка</FormLabel>
                                        <InputGroup size="sm">
                                            <Input
                                                type="number"
                                                placeholder={`0 ${ad.currency.symbol}`}
                                                value={delay}
                                                onChange={(e) =>
                                                    setDelay(e.target.value)
                                                }
                                            />
                                            <InputRightAddon
                                                children={ad.currency.symbol}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                )}
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                disabled={loading}
                                size="sm"
                                colorScheme="blue"
                                mr={3}
                                onClick={closeHandler}
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

export default UpdateBalance;

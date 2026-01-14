import {
    Button,
    IconButton,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Tooltip,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { Link as NavLink } from "react-router-dom";
import React, { useState } from "react";
import { VscEdit } from "react-icons/vsc";
import { SUCCESS_PUT } from "../../../const/http-codes";
import useAppToast from "../../../hooks/useAppToast";
import { IExpenseStatisticks } from "../../../models/IStatisticks";
import statisticksService from "../../../services/statisticks-service";
import UpdateItem from "./UpdateItem";
import { getPathWithParam } from "../../../utils/getPathWithParam";
import { ROUTES } from "../../../router/routes";
import { IAd } from "../../../models/IAd";

type UpdateBalanceProps = {
    item: IExpenseStatisticks;
    update: () => void;
};

const UpdateBalance: React.FC<UpdateBalanceProps> = ({ item, update }) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const toast = useAppToast();

    const [ads, setAds] = useState<IAd[]>(item.ads);

    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        setLoading(true);
        try {
            let status = 0;
            for (let i = 0; i < ads.length; i++) {
                const response = await statisticksService.updateBalances(
                    ads[i]
                );

                status = response.status;
            }
            if (status === SUCCESS_PUT) {
                closeHandler();
                toast({
                    text: "Баланс обновлен успешно",
                    status: "success",
                    title: item.name,
                });
                await update();
            }
        } catch (e) {}
        setLoading(false);
    };

    const closeHandler = () => {
        onClose();
    };

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
                        <ModalHeader>{item.name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack align={"stretch"}>
                                {ads.length ? (
                                    item.ads.map((ad, i) => (
                                        <UpdateItem
                                            setAds={setAds}
                                            index={i}
                                            ad={ad}
                                            key={i}
                                        />
                                    ))
                                ) : (
                                    <Text
                                        p={2}
                                        borderWidth={1}
                                        textAlign="center"
                                    >
                                        Аккаунт не создан
                                        <Link
                                            mt={1}
                                            display={"block"}
                                            fontSize=".9em"
                                            color="blue.500"
                                            as={NavLink}
                                            to={getPathWithParam(
                                                ROUTES.projectSettings.path,
                                                item.id
                                            )}
                                        >
                                            Добавить аккаунт
                                        </Link>
                                    </Text>
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

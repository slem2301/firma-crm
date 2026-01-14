import {
    Button,
    FormControl,
    FormHelperText,
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
import { AxiosError } from "axios";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { SUCCESS_PUT } from "../../const/http-codes";
import { useAppSelector } from "../../hooks/redux";
import useAppToast from "../../hooks/useAppToast";
import { IUser } from "../../models/IUser";
import userService from "../../services/user-service";

type ChangePasswordProps = {
    user: IUser;
    update: () => void;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ user, update }) => {
    const { isOpen, onOpen, onClose: closeHandler } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const { user: currentUser } = useAppSelector((state) => state.user);
    const toast = useAppToast();

    const accepted = login === user.login;

    const onClose = () => {
        setPassword("");
        setLogin("");
        closeHandler();
    };

    const onSubmit = async () => {
        if (password.length < 4)
            return toast({
                title: login,
                text: "Длина пароля должна быть от 4 символов",
                status: "error",
            });

        setLoading(true);
        try {
            const response = await userService().changePassword(
                user.id,
                password
            );

            if (response.status === SUCCESS_PUT) {
                toast({
                    title: login,
                    text: `Пароль успешно изменён на - ${password}`,
                });
                onClose();
                update();
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response)
                toast({
                    title: login,
                    text: error.response.data.message,
                    status: "error",
                });
        }
        console.log('user', user)
        setLoading(false);
    };

    if (user.login === currentUser?.login) return null;


    return (
        <>
            <Tooltip fontSize="10px" label="Сменить пароль" openDelay={500}>
                <IconButton
                    position="static"
                    rounded={2}
                    onClick={onOpen}
                    aria-label="change password"
                    fontSize={"10px"}
                    w={"20px"}
                    minW={"20px"}
                    h={"20px"}
                    icon={<FaLock />}
                    size="xs"
                    colorScheme={"blue"}
                />
            </Tooltip>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Смена пароля</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <FormControl>
                                <FormLabel>Логин</FormLabel>
                                <Input
                                    autoFocus
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    placeholder="Логин"
                                />
                                <FormHelperText>
                                    Чтобы сменить пароль, введите логин аккаунта{" "}
                                    <b>{user.login}</b>
                                </FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Новый пароль</FormLabel>
                                <Input
                                    isDisabled={!accepted}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Новый пароль"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isDisabled={loading}
                            size="sm"
                            colorScheme="blue"
                            mr={3}
                            onClick={onClose}
                        >
                            Отмена
                        </Button>
                        <Button
                            isLoading={loading}
                            isDisabled={!accepted}
                            size="sm"
                            colorScheme="green"
                            onClick={onSubmit}
                        >
                            Обновить пароль
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ChangePassword;

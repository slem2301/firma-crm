import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import authService from "../../services/auth-service";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SingleSelectFilter from "../../components/filters/SingleSelectFilter";
import useAppToast from "../../hooks/useAppToast";
import { ROLES } from "../../hooks/useRoles";
import { IUser } from "../../models/IUser";
import { SUCCESS_POST } from "../../const/http-codes";

type AddUserProps = {
    update: () => void;
    users: IUser[];
};

const roles = Object.values(ROLES).map((role) => ({
    value: role,
    name: role,
}));

const AddUser: React.FC<AddUserProps> = ({ update, users }) => {
    const { isOpen, onOpen, onClose: closeHandler } = useDisclosure();
    const [role, setRole] = useState<string>("DEALER");

    const [loading, setLoading] = useState(false);

    const toast = useAppToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onClose = () => {
        reset();
        setRole(ROLES.DEALER);
        closeHandler();
    };

    const onSubmit = async (data: any) => {
        const tag = role === ROLES.DEALER ? data.tag : data.login;

        let candidate = users.find((user) => user.login === data.login);
        if (candidate)
            return toast({
                text: "Пользователь с таким логином уже существует",
                status: "error",
            });

        candidate = users.find((user) => user.tag === tag);
        if (candidate)
            return toast({
                text: "Пользователь с такой меткой уже существует",
                status: "error",
            });

        setLoading(true);
        try {
            const response = await authService().registration({
                ...data,
                tag,
                roles: [role],
            });

            if (response.status === SUCCESS_POST) {
                toast({
                    text: `Пользователь ${response.data.login} успешно создан`,
                });
                await update();
                onClose();
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error?.response?.data)
                toast({
                    text: error.response.data.message,
                    status: "error",
                });
        }
        setLoading(false);
    };

    return (
        <>
            <Button size="sm" colorScheme="green" onClick={onOpen}>
                Добавить пользователя
            </Button>
            {isOpen && (
                <Modal isOpen onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Добавление пользователя</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack align="stretch">
                                <FormControl>
                                    <FormLabel>Права</FormLabel>
                                    <SingleSelectFilter
                                        options={roles}
                                        setValue={setRole}
                                        defaultValue={role}
                                        paired
                                    />
                                </FormControl>
                                <FormControl isInvalid={!!errors.login}>
                                    <FormLabel>Логин</FormLabel>
                                    <Input
                                        {...register("login", {
                                            required: {
                                                message: "Введите логин",
                                                value: true,
                                            },
                                        })}
                                        size="sm"
                                        placeholder="Логин"
                                        autoFocus
                                    />
                                    <FormErrorMessage>
                                        <>{errors?.login?.message}</>
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel>Пароль</FormLabel>
                                    <Input
                                        {...register("password", {
                                            required: {
                                                message: "Введите пароль",
                                                value: true,
                                            },
                                        })}
                                        size="sm"
                                        placeholder="Пароль"
                                    />
                                    <FormErrorMessage>
                                        <>{errors?.tag?.password}</>
                                    </FormErrorMessage>
                                </FormControl>
                                {role === ROLES.DEALER && (
                                    <FormControl isInvalid={!!errors.tag}>
                                        <FormLabel>Метка</FormLabel>
                                        <Input
                                            {...register("tag", {
                                                required: {
                                                    message: "Введите метку",
                                                    value: true,
                                                },
                                            })}
                                            size="sm"
                                            placeholder="Метка"
                                        />
                                        <FormErrorMessage>
                                            <>{errors?.tag?.message}</>
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
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
                                size="sm"
                                colorScheme="green"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Создать
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default AddUser;

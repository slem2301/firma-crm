import {
    Button,
    FormControl,
    FormErrorMessage,
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
import { useForm } from "react-hook-form";
import { VscEdit } from "react-icons/vsc";
import SingleSelectFilter from "../../components/filters/SingleSelectFilter";
import { SUCCESS_PUT } from "../../const/http-codes";
import { useAppSelector } from "../../hooks/redux";
import useAppToast from "../../hooks/useAppToast";
import { ROLES } from "../../hooks/useRoles";
import { IUser } from "../../models/IUser";
import userService from "../../services/user-service";

type EditUserProps = {
    user: IUser;
    users: IUser[];
    update: () => void;
};

const roles = Object.values(ROLES).map((role) => ({
    value: role,
    name: role,
}));

const EditUser: React.FC<EditUserProps> = ({ user, users, update }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user: currentUser } = useAppSelector((state) => state.user);

    const [loading, setLoading] = useState(false);

    const toast = useAppToast();

    const [role, setRole] = useState<string>(
        user.roles?.find((r) => !!(ROLES as any)[r]) || ROLES.DEALER
    );

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({
        defaultValues: {
            login: user.login,
            tag: user.tag,
        },
    });

    const closeHandler = () => {
        onClose();
    };

    const onSubmit = async (data: any) => {
        const tag = role === ROLES.DEALER ? data.tag : data.login;

        let candidate = users.find(
            (_user) => _user.login === data.login && _user.login !== user.login
        );
        if (candidate)
            return toast({
                text: "Пользователь с таким логином уже существует",
                status: "error",
            });

        candidate = users.find(
            (_user) => _user.tag === tag && _user.tag !== user.tag
        );
        if (candidate)
            return toast({
                text: "Пользователь с такой меткой уже существует",
                status: "error",
            });

        setLoading(true);
        try {
            const response = await userService().updateByLogin({
                ...user,
                ...data,
                tag,
                roles: [role],
            });

            if (response.status === SUCCESS_PUT) {
                toast({
                    text: `Пользователь ${response.data.login} успешно изменён`,
                });
                await update();
                onClose();
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error?.response?.data)
                toast({ text: error.response.data.message, status: "error" });
        }
        setLoading(false);
    };

    if (user.login === currentUser?.login) return null;

    return (
        <>
            <Tooltip
                fontSize="10px"
                label="Редактировать пользователя"
                openDelay={500}
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
                    colorScheme={"green"}
                />
            </Tooltip>
            <Modal onClose={closeHandler} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Изменение аккаунта {user.login}</ModalHeader>
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
                            Изменить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditUser;

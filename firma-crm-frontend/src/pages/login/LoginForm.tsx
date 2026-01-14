import {
    Box,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    ScaleFade,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/button/Button";
import { COLOR_PRIMARY_DARK } from "../../const/colors";
import { useAppSelector } from "../../hooks/redux";

type LoginFormProps = {
    onSubmit: (data: any) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onSubmit" });

    const { loading, responseError } = useAppSelector((state) => state.auth);

    return (
        <ScaleFade
            initialScale={0.9}
            in={true}
            style={{ width: "100%", maxWidth: "400px" }}
        >
            <Box overflow={"hidden"} rounded={4} boxShadow={"md"} bg="white">
                <Box
                    as="h1"
                    fontWeight={700}
                    fontSize={24}
                    bg={COLOR_PRIMARY_DARK}
                    color="white"
                    textAlign={"center"}
                    py={2}
                >
                    Авторизация
                </Box>
                <Divider />
                <Box as="form" p={4} onSubmit={handleSubmit(onSubmit)}>
                    {responseError && (
                        <Text mb={1} color={"red"} fontWeight={500}>
                            {responseError}
                        </Text>
                    )}
                    <FormControl isInvalid={!!errors.login}>
                        <FormLabel>Логин</FormLabel>
                        <Input
                            autoFocus
                            disabled={loading}
                            type="text"
                            placeholder="Логин"
                            {...register("login", {
                                required: {
                                    message: "Введите логин",
                                    value: true,
                                },
                            })}
                        />
                        <FormErrorMessage>
                            <>{errors.login && errors.login.message}</>
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl mt={3} isInvalid={!!errors.password}>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            type="password"
                            placeholder="Пароль"
                            disabled={loading}
                            {...register("password", {
                                required: {
                                    message: "Введите пароль",
                                    value: true,
                                },
                                minLength: {
                                    message: "Длина должна больше 4 символов",
                                    value: 4,
                                },
                            })}
                        />
                        <FormErrorMessage>
                            <>{errors.password && errors.password.message}</>
                        </FormErrorMessage>
                    </FormControl>
                    <Button
                        size="sm"
                        type="submit"
                        mt={4}
                        isLoading={loading}
                        loadingText="Авторизация..."
                    >
                        Авторизоваться
                    </Button>
                </Box>
            </Box>
        </ScaleFade>
    );
};

export default LoginForm;

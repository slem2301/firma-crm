import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { COLOR_PRIMARY } from "../../const/colors";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useLoginData } from "../../hooks/useLoginData";
import { DEFAULT_ROUTE } from "../../router/routes";
import { login } from "../../store/slices/auth-slice";
import { getUserByToken } from "../../store/slices/user-slice";
import LoginForm from "./LoginForm";

type LocationState = {
    from?: string;
    search?: string;
};

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state) => state.auth);
    const loadAppData = useLoginData();

    useEffect(() => {
        const expected = location.state as LocationState;
        if (auth)
            navigate(
                `${expected?.from || DEFAULT_ROUTE.path}${
                    expected?.search ? `${expected?.search}` : ""
                }`,
                { replace: true }
            );
    }, [auth, navigate, location.state]);

    const onSubmit = async (data: any) => {
        const response = await dispatch(
            login({ login: data.login, password: data.password })
        );
        if (response.meta.requestStatus === "fulfilled") {
            await dispatch(getUserByToken());
            await loadAppData();
        }
    };

    return (
        <Flex
            bg={COLOR_PRIMARY}
            h={"calc(100vh - 44px)"}
            align="center"
            justify={"center"}
            p={2}
        >
            <LoginForm onSubmit={onSubmit} />
        </Flex>
    );
};

export default Login;

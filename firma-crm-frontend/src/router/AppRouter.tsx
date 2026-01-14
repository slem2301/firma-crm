import { Flex, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ResponseError } from "../axios";
import Logo from "../components/ui/header/Logo";
import Layout from "../components/ui/layout/Layout";
import RequireAuth from "../hocs/RequireAuth";
import { useAppDispatch } from "../hooks/redux";
import useAppToast from "../hooks/useAppToast";
import { useLoginData } from "../hooks/useLoginData";
import { ROLES, useRoles } from "../hooks/useRoles";
import { auth } from "../store/slices/auth-slice";
import { getUserByToken } from "../store/slices/user-slice";
import { getPathWithParam } from "../utils/getPathWithParam";
import { DEFAULT_ROUTE, ROUTES, ROUTES_ARR, setDefaultRoute } from "./routes";

const AppRouter: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const loadAppData = useLoginData();
    const toast = useAppToast();
    const { hasRoles } = useRoles();

    const fetchUser = useCallback(async () => {
        const response = await dispatch(getUserByToken());

        if (response.meta.requestStatus === "fulfilled") {
            await dispatch(auth());
            await loadAppData();
            return setLoading(false);
        }
        if (response.payload && (response.payload as ResponseError).status)
            return setLoading(false);

        if (response?.payload === "ABORT") return;

        toast({
            text: "Сервер не доступен, переподключение...",
            status: "info",
        });

        setTimeout(() => {
            fetchUser();
        }, 4000);
    }, [dispatch, loadAppData, toast]);

    useEffect(() => {
        if (hasRoles([ROLES.ADMIN, ROLES.MANAGER])) {
            setDefaultRoute({
                ...ROUTES.statisticks,
                path: getPathWithParam(ROUTES.statisticks.path, "requests"),
            });
        }
    }, [hasRoles]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);




    return loading ? (
        <Flex
            as={motion.div}
            align={"center"}
            direction="column"
            justify="center"
            h="100vh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Logo mb={6} />
            <Spinner
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                fontSize={{ base: "12px", sm: "16px" }}
                thickness=".35em"
                h="3.5em"
                w="3.5em"
            />
        </Flex>
    ) : (
        <Routes>
            <Route path="/" element={<Layout />}>
                {ROUTES_ARR.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            !route.public ? (
                                <RequireAuth roles={route.roles}>
                                    {route.component}
                                </RequireAuth>
                            ) : (
                                route.component
                            )
                        }
                    />
                ))}
                <Route
                    path={"/"}
                    element={
                        <Navigate to={DEFAULT_ROUTE.path} replace={true} />
                    }
                />
                <Route
                    path={"*"}
                    element={
                        <Navigate to={DEFAULT_ROUTE.path} replace={true} />
                    }
                />
            </Route>
        </Routes>
    );
};

export default AppRouter;

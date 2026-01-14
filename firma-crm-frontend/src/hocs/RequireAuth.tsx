// import useRole from 'hook/useRole'
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { useRoles } from "../hooks/useRoles";
import { DEFAULT_ROUTE, ROUTES } from "../router/routes";

type RequireAuthProps = {
    children: JSX.Element;
    roles?: string[];
};

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
    const location = useLocation();
    const { auth } = useAppSelector((state) => state.auth);

    const { hasRoles } = useRoles();


    // const user = useAppSelector((state) => state.user.user);
    // const userLoading = useAppSelector((state) => state.user.loading);

    // console.log("REQUIRE AUTH CHECK", {
    //     auth,
    //     user,
    //     userRoles: user?.roles,
    //     requiredRoles: roles,
    //     hasRoles: roles ? hasRoles(roles) : "no roles required",
    //     userLoading,
    // });


    if (!auth)
        return (
            <Navigate
                to={ROUTES.login.path}
                state={{ from: location.pathname, search: location.search }}
                replace={true}
            />
        );

    if (roles && !hasRoles(roles))
        return <Navigate to={DEFAULT_ROUTE.path} replace={true} />;

    return children;
};

export default RequireAuth;

import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { lazy } from "react";
import { ROLES } from "../hooks/useRoles";
import Ad from "../pages/ad/Ad";
import AdGetToken from "../pages/ad/AdGetToken";
import Ads from "../pages/ads/Ads";
import Login from "../pages/login/Login";
import Project from "../pages/project/Project";
import { Phone } from "../pages/phones/phone";

const Blacklist = lazy(() => import("../pages/blacklist/Blacklist"));
const Price = lazy(() => import("../pages/price/Price"));
const Projects = lazy(() => import("../pages/projects/Projects"));
const Statisticks = lazy(() => import("../pages/statisticks/Statisticks"));
const Orders = lazy(() => import("../pages/orders/Orders"));
const Users = lazy(() => import("../pages/users/Users"));
const Phones = lazy(() => import("../pages/phones/Phones"));
const Requests = lazy(() => import("../pages/requests/Requests"));

export type RouteType = {
    path: string;
    component: EmotionJSX.Element;
    public?: boolean;
    roles?: string[];
};

export type RoutesType = {
    [key: string]: RouteType;
};

export const ROUTES: RoutesType = {
    projects: {
        path: "/projects",
        component: <Projects />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    createProject: {
        path: "/projects/create",
        component: <Projects mode={"create"} />,
        roles: [ROLES.ADMIN],
    },
    projectSettings: {
        path: "/project/:id/settings",
        component: <Project mode="settings" />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    projectScripts: {
        path: "/project/:id/scripts",
        component: <Project mode="scripts" />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    projectRequests: {
        path: "/project/:id/requests",
        component: <Project mode="requests" />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    projectChat: {
        path: "/project/:id/chat",
        component: <Project mode="chat" />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    projectQuiz: {
        path: "/project/:id/quiz",
        component: <Project mode="quiz" />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    projectExpense: {
        path: "/project/:id/expense",
        component: <Project mode="expense" />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    projectConnection: {
        path: "/project/:id/connection",
        component: <Project mode="connection" />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    login: {
        path: "/login",
        component: <Login />,
        public: true,
    },
    blacklist: {
        path: "/blacklist",
        component: <Blacklist />,
    },
    statisticks: {
        path: "/statisticks/:tab",
        component: <Statisticks />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    price: {
        path: "/price",
        component: <Price />,
    },
    orders: {
        path: "/orders",
        component: <Orders />,
    },
    users: {
        path: "/users",
        component: <Users />,
        roles: [ROLES.ADMIN],
    },
    phones: {
        path: "/phones",
        component: <Phones />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    phone: {
        path: "/phones/:id",
        component: <Phone />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    requests: {
        path: "/requests",
        component: <Requests />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    ads: {
        path: "/ads",
        component: <Ads />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    ad: {
        path: "/ad/:login",
        component: <Ad />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    adGetToken: {
        path: "/ad-get-token",
        component: <AdGetToken />,
        roles: [ROLES.ADMIN, ROLES.MANAGER],
    },
    // cost: {
    //     path: "/cost/:id",
    //     component: <Cost />,
    //     roles: [ROLES.ADMIN],
    // },
    // costs: {
    //     path: "/costs",
    //     component: <Costs />,
    //     roles: [ROLES.ADMIN],
    // },
    // addCost: {
    //     path: "/cost/:id/add",
    //     component: <Cost mode="add" />,
    //     roles: [ROLES.ADMIN],
    // },
};


export const ROUTES_ARR: RouteType[] = Object.values(ROUTES);

export let DEFAULT_ROUTE = ROUTES.orders;

export const setDefaultRoute = (route: RouteType) => (DEFAULT_ROUTE = route);

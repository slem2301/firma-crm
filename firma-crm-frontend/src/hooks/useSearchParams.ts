import { useCallback, useMemo } from "react";
import {
    useNavigate,
    useSearchParams as routeSearchParams,
} from "react-router-dom";

type ParamsType = {
    [key: string]: string;
};

type ParamsTypeAsFunction = (prev: ParamsType) => ParamsType;

export const useSearchParams = () => {
    const [params] = routeSearchParams();
    const navigate = useNavigate();

    const objectParams = useMemo(
        () => Object.fromEntries(params.entries()),
        [params]
    );

    const setParams = useCallback(
        (newParams: ParamsType | ParamsTypeAsFunction) => {
            let _params = newParams as ParamsType;
            if (typeof newParams === "function")
                _params = newParams(objectParams);

            const url = `${window.location.pathname}${Object.keys(
                _params
            ).reduce((result, key, i, arr) => {
                if (!arr.length) return "";

                result += `${key}=${_params[key]}${
                    i !== arr.length - 1 ? "&" : ""
                }`;

                return result;
            }, "?")}`;

            navigate(url, { replace: true });
        },
        [navigate, objectParams]
    );

    const setParam = useCallback(
        (name: string, value: string) => {
            const param = objectParams[name];
            if (!value && param === undefined) return;
            if (
                value ===
                (typeof param === "string" ? param : JSON.stringify(param))
            )
                return;

            setParams((prev: any) => {
                if (!value) {
                    const newParams = { ...prev };
                    delete newParams[name];
                    return newParams;
                }

                return { ...prev, [name]: value };
            });
        },
        [setParams, objectParams]
    );

    return { params: objectParams, setParams, setParam };
};

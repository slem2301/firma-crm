import { URL_PARAMS_PATTERN } from "../const/patterns";

export const getPathWithParam = (
    path: string,
    param: string | number,
    search?: string
) =>
    path
        .replace(URL_PARAMS_PATTERN, param.toString())
        .concat(search ? search : "");

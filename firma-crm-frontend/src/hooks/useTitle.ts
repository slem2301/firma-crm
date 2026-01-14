import { useEffect } from "react";
import { setTitle } from "../store/slices/app-slice";
import { useAppDispatch } from "./redux";

const useTitle = (title: string, show: boolean = true) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!show) return;
        dispatch(setTitle(title));
        document.title = `FCRM - ${title}`;

        return () => {
            document.title = `Firma - CRM`;
            dispatch(setTitle(""));
        };
    }, [show, dispatch, title]);
};

export default useTitle;

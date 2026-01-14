import { useEffect } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { getErrorMessage, getInfoMessage } from "../model/selectors";
import useAppToast from "../../../../hooks/useAppToast";

export const useChatAlert = () => {
    const toast = useAppToast();

    const errorMessage = useAppSelector(getErrorMessage);
    const infoMessage = useAppSelector(getInfoMessage);

    useEffect(() => {
        if (errorMessage) {
            toast({
                text: errorMessage,
                status: "error",
            });
        }
    }, [errorMessage, toast]);

    useEffect(() => {
        if (infoMessage) {
            toast({
                text: infoMessage,
                status: "info",
            });
        }
    }, [infoMessage, toast]);
};

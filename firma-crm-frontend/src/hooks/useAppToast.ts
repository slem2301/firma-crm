import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useCallback } from "react";

type ToastOptions = {
    title?: string;
    text?: string;
    status?: "success" | "error" | "info" | "loading" | "warning";
    duration?: number | null;
    isClosable?: boolean;
    position?: UseToastOptions["position"];
};

const useAppToast = () => {
    const toast = useToast();

    const showToast = useCallback(
        (options: ToastOptions) =>
            toast({
                duration: 3000,
                ...options,
                isClosable: options.isClosable ?? true,
                description: options.text,
                status: options.status || "success",
            }),
        [toast]
    );

    return showToast;
};

export default useAppToast;

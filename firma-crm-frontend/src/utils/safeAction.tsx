import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    useToast,
} from "@chakra-ui/react";

interface SafeActionProps {
    title?: string;
    onAccept: () => void;
}

export const useSafeAction = () => {
    const toast = useToast();

    const safeAction = (props: SafeActionProps) => {
        toast({
            duration: null,
            isClosable: false,
            position: "top",
            status: "info",
            title: props.title,
            onCloseComplete: () => toast.closeAll(),
            render: (renderProps) => (
                <Alert status="warning">
                    <AlertIcon />
                    <AlertTitle>{props.title}</AlertTitle>
                    <AlertDescription gap={1} display="flex">
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={renderProps.onClose}
                        >
                            Нет
                        </Button>
                        <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() => {
                                renderProps.onClose();
                                props.onAccept();
                            }}
                        >
                            Да
                        </Button>
                    </AlertDescription>
                </Alert>
            ),
        });
    };

    return { safeAction };
};

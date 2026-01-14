import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";
import React from "react";

type ConfirmDialogProps = {
    OKButtonText?: string;
    CANCELButtonText?: string;
    onAccept: () => void;
    onCancel: () => void;
    isOpen: boolean;
    title: string;
    text: string;
    isLoading?: boolean;
    isCentered?: boolean;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
    const {
        isOpen,
        title,
        text,
        onCancel,
        onAccept,
        OKButtonText,
        CANCELButtonText,
        isLoading,
        isCentered,
    } = props;
    const cancelRef = React.useRef(null);

    return (
        <AlertDialog
            isCentered={isCentered}
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCancel}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody
                        display={"flex"}
                        flexDirection="column"
                        gap={2}
                    >
                        {text.split("\n").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            isDisabled={isLoading}
                            onClick={onCancel}
                        >
                            {CANCELButtonText ? CANCELButtonText : "Отмена"}
                        </Button>
                        <Button
                            loadingText={"Загрузка..."}
                            isLoading={isLoading}
                            colorScheme="red"
                            onClick={onAccept}
                            ml={3}
                        >
                            {OKButtonText ? OKButtonText : "Да"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default ConfirmDialog;

import { useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import { ManageGoogleTableOptionsModal } from "./ManageGoogleTableOptionsModal";

interface AddGoogleTableOptionsProps {
    projectId: number;
    acceptedFields: string[];
    refetch: () => void;
}

export const AddGoogleTableOptions = (props: AddGoogleTableOptionsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };
    const handleClick = () => {
        setIsOpen(true);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                size="sm"
                colorScheme="green"
                w="100%"
            >
                Добавить отправку в таблицы
            </Button>
            <ManageGoogleTableOptionsModal
                {...props}
                item={null}
                isOpen={isOpen}
                onClose={handleClose}
            />
        </>
    );
};

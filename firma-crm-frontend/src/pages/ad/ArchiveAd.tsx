import { Button, useDisclosure } from "@chakra-ui/react";
import { IAd } from "../../models/IAd";
import { useCallback, useState } from "react";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import useAppToast from "../../hooks/useAppToast";
import adService from "../../services/ad-service";
import { SUCCESS_POST } from "../../const/http-codes";

interface ArchiveAdProps {
    id: number;
    archived: boolean;
    updateAd: (ad: IAd) => void;
}

export const ArchiveAd = (props: ArchiveAdProps) => {
    const { id, archived, updateAd } = props;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setLoading] = useState(false);
    const toast = useAppToast();

    const handleToggleArchived = useCallback(async () => {
        onClose();
        setLoading(true);
        try {
            const response = await adService.toggleArchived(id);

            if (response.status === SUCCESS_POST) {
                updateAd(response.data);
            }
        } catch (e) {
            if (e instanceof Error)
                toast({ text: "Ошибка: " + e.message, status: "error" });
        }
        setLoading(false);
    }, [id, toast, updateAd, onClose]);

    const handleButtonClick = archived ? handleToggleArchived : onOpen;

    return (
        <>
            <Button
                ml={"auto"}
                isDisabled={isLoading}
                isLoading={isLoading}
                loadingText={"Процесс..."}
                onClick={handleButtonClick}
                colorScheme={archived ? "red" : "blue"}
            >
                {archived ? "Разархивировать" : "Архивировать"}
            </Button>
            <ConfirmDialog
                isOpen={isOpen}
                onCancel={onClose}
                onAccept={handleToggleArchived}
                title="Архивация аккаунта"
                text={`При архивации аккаунта, все проекты будут отвязаны от этого аккаунта. Вы согласны?`}
            />
        </>
    );
};

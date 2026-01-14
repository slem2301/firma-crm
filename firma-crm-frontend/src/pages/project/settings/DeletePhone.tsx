import { IconButton, useBoolean, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import ConfirmDialog from "../../../components/confirmDialog/ConfirmDialog";
import { useAppDispatch } from "../../../hooks/redux";
import { IPhone } from "../../../models/IPhone";
import phoneService from "../../../services/phone-service";
import { getProjectById } from "../../../store/slices/project-slice";

type DeletePhoneProps = {
    projectId: number;
    phone: IPhone;
};

const DeletePhone: React.FC<DeletePhoneProps> = ({ projectId, phone }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useBoolean();
    const dispatch = useAppDispatch();

    const deleteHandler = async () => {
        setLoading.on();
        try {
            onClose();
            const historyInst = phone.history && phone.history[0];
            await phoneService.clear(phone.id, historyInst?.id);
            await dispatch(getProjectById(projectId));
        } catch (e) {}
        setLoading.off();
    };

    return (
        <>
            <IconButton
                isLoading={loading}
                onClick={onOpen}
                ml={2}
                colorScheme="red"
                fontSize={".9em"}
                aria-label="clear"
                size="xs"
                icon={<FaTimes />}
            />
            <ConfirmDialog
                isLoading={loading}
                isOpen={isOpen}
                onCancel={onClose}
                onAccept={deleteHandler}
                title="Удаление номера"
                text="Вы действительно желаете удалить номер с сайта?"
            />
        </>
    );
};

export default DeletePhone;

import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import { useAppSelector } from "../../hooks/redux";
import userService from "../../services/user-service";

type DeleteUserProps = {
    login: string;
    userId: string;
    update: () => void;
};

const DeleteUser: React.FC<DeleteUserProps> = ({ login, userId, update }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user: currentUser } = useAppSelector((state) => state.user);

    const onAccept = async () => {
        try {
            await userService().deleteById(userId);
        } catch (e) { }
        onClose();
        update();
    };

    if (login === currentUser?.login) return null;

    return (
        <>
            <Tooltip
                fontSize="10px"
                label="Удалить пользователя"
                openDelay={500}
            >
                <IconButton
                    position="static"
                    rounded={2}
                    onClick={onOpen}
                    aria-label="remove"
                    fontSize={"10px"}
                    w={"20px"}
                    minW={"20px"}
                    h={"20px"}
                    icon={<FaTimes />}
                    size="xs"
                    colorScheme={"red"}
                />
            </Tooltip>
            <ConfirmDialog
                isOpen={isOpen}
                onAccept={onAccept}
                onCancel={onClose}
                title="Удаление аккаунта"
                text={`Вы уверены, что хотите удалить аккаунт ${login}`}
            />
        </>
    );
};

export default DeleteUser;

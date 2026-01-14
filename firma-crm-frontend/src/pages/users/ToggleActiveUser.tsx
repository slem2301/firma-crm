import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FaTimes, FaUndo } from "react-icons/fa";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import { useAppSelector } from "../../hooks/redux";
import userService from "../../services/user-service";

type ToggleUserProps = {
    login: string;
    userId: string;
    isActive?: boolean;   // <-- новое
    update: () => void;
};

const ToggleUser: React.FC<ToggleUserProps> = ({ login, userId, isActive = true, update }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user: currentUser } = useAppSelector((state) => state.user);

    const onAccept = async () => {
        try {
            if (isActive) {
                await userService().deactivate(userId);
            } else {
                await userService().activate(userId);
            }
        } catch (e) { }
        onClose();
        update();
    };

    if (login === currentUser?.login) return null;

    const title = isActive ? "Отключение аккаунта" : "Восстановление аккаунта";
    const text = isActive
        ? `Вы уверены, что хотите отключить аккаунт ${login}?`
        : `Восстановить аккаунт ${login}?`;

    return (
        <>
            <Tooltip fontSize="10px" label={isActive ? "Отключить пользователя" : "Восстановить пользователя"} openDelay={500}>
                <IconButton
                    position="static"
                    rounded={2}
                    onClick={onOpen}
                    aria-label={isActive ? "deactivate" : "activate"}
                    fontSize={"10px"}
                    w={"20px"}
                    minW={"20px"}
                    h={"20px"}
                    icon={isActive ? <FaTimes /> : <FaUndo />}
                    size="xs"
                    colorScheme={isActive ? "red" : "green"}
                />
            </Tooltip>

            <ConfirmDialog
                isOpen={isOpen}
                onAccept={onAccept}
                onCancel={onClose}
                title={title}
                text={text}
            />
        </>
    );
};

export default ToggleUser;

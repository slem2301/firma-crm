import { Flex, Text } from "@chakra-ui/react";
import { GoogleTableOptions } from "../model";
import Button from "../../../../../components/ui/button/Button";
import { useSafeAction } from "../../../../../utils/safeAction";
import { googleTablesApi } from "../api";
import useAppToast from "../../../../../hooks/useAppToast";
import { isApiError } from "../../../../../axios";
import { SUCCESS_DELETE } from "../../../../../const/http-codes";
import { ManageGoogleTableOptionsModal } from "./ManageGoogleTableOptionsModal";
import { useState } from "react";

interface GoogleTableOptionsItemProps {
    item: GoogleTableOptions;
    acceptedFields: string[];
    refetch: () => void;
}

export const GoogleTableOptionsItem = (props: GoogleTableOptionsItemProps) => {
    const { item, acceptedFields, refetch } = props;
    const { safeAction } = useSafeAction();
    const toast = useAppToast();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleOpen = () => setIsEditOpen(true);
    const handleClose = () => setIsEditOpen(false);

    const handleDelete = () =>
        googleTablesApi
            .deleteByProjectId(item.projectId, item.token)
            .then((response) => response.status === SUCCESS_DELETE && refetch())
            .catch(
                (e) =>
                    isApiError(e) &&
                    toast({
                        title: "Deleting google table options",
                        status: "error",
                        text: JSON.stringify(e.response?.data),
                    })
            );

    return (
        <Flex flexDir={"column"} borderBottomWidth={2} pb={1}>
            <Text>
                {item.token} {item.range}
            </Text>
            <Flex gap={1} justifyContent={"flex-end"}>
                <Button aria-label="edit" size="sm" onClick={handleOpen}>
                    Редактировать
                </Button>
                <Button
                    colorScheme="red"
                    alignSelf={"flex-end"}
                    aria-label="delete"
                    size="sm"
                    onClick={() =>
                        safeAction({
                            title: "Удалить вывод в таблицы?",
                            onAccept: handleDelete,
                        })
                    }
                >
                    Удалить
                </Button>
            </Flex>
            <ManageGoogleTableOptionsModal
                isOpen={isEditOpen}
                item={item}
                refetch={refetch}
                acceptedFields={acceptedFields}
                projectId={item.projectId}
                onClose={handleClose}
            />
        </Flex>
    );
};

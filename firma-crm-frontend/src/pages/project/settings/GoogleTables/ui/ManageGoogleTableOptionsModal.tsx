import { GoogleTableOptions } from "../model";
import { useRef, useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { DataOrderSlotList } from "./DataOrderSlotList";
import useAppToast from "../../../../../hooks/useAppToast";
import ModalLoader from "../../../../../components/ui/modal-loading/ModalLoader";
import { googleTablesApi } from "../api";
import { isApiError } from "../../../../../axios";
import { SUCCESS_PUT } from "../../../../../const/http-codes";
import { SPACE } from "./DataOrderSlot";

interface ManageGoogleTableOptionsModalProps {
    item: GoogleTableOptions | null;
    isOpen: boolean;
    projectId: number;
    acceptedFields: string[];
    onClose: () => void;
    refetch: () => void;
}

interface Form {
    range: string;
    token: string;
}

export const ManageGoogleTableOptionsModal = (
    props: ManageGoogleTableOptionsModalProps
) => {
    const { item, isOpen, projectId, acceptedFields, refetch, onClose } = props;

    const [dataOrder, setDataOrder] = useState<string>(() =>
        item ? item.dataOrder : ""
    );
    const [keyFile, setKeyFile] = useState<File | null>(null);
    const toast = useAppToast();
    const { handleSubmit, register, reset } = useForm<Form>({
        defaultValues: {
            range: item ? item.range : "",
            token: item ? item.token : "",
        },
    });
    const fileRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleClearForm = () => {
        setDataOrder("");
        reset();
    };
    const handleClose = () => {
        handleClearForm();
        onClose();
    };
    const handleValidSave = (data: Form) => {
        if (!dataOrder.trim()) {
            return toast({
                title: "Add Google Tables",
                text: "Data Order cannot be empty",
                status: "error",
            });
        }

        if (!item && !keyFile) {
            return toast({
                title: "Add Google Tables",
                text: "Please, choose file",
                status: "error",
            });
        }

        const request = keyFile
            ? googleTablesApi.updateUpload({
                  range: data.range,
                  token: data.token,
                  project_id: projectId,
                  data_order: dataOrder,
                  file: keyFile,
              })
            : googleTablesApi.update({
                  range: data.range,
                  token: data.token,
                  projectId,
                  dataOrder,
              });

        setIsLoading(true);
        request
            .then((response) => {
                if (response.status === SUCCESS_PUT) {
                    refetch();
                    handleClose();
                    toast({
                        title: `${item ? "Edit" : "Add"} Google Tables`,
                        text: item ? "Updated" : "Added",
                        status: "success",
                    });
                }
            })
            .catch(
                (e) =>
                    isApiError(e) &&
                    toast({
                        title: `${item ? "Edit" : "Add"} Google Tables`,
                        text: JSON.stringify(e.response?.data),
                        status: "error",
                    })
            )
            .finally(() => setIsLoading(false));
    };

    return (
        <Modal size="xl" isOpen={isOpen} onClose={handleClose} isCentered>
            <ModalOverlay />
            {isLoading && <ModalLoader />}
            <ModalContent hidden={isLoading} maxW={1000}>
                <ModalHeader>
                    Google Table {item ? "Edit" : "Add"} Options
                </ModalHeader>
                <ModalBody>
                    <Stack w="100%">
                        <FormControl size="sm">
                            <FormLabel>Token</FormLabel>
                            <Input
                                size="sm"
                                {...register("token", { required: true })}
                                placeholder="SDFHIUSDGFJNKJ7678sdfSDF8&^SDf678"
                            />
                        </FormControl>
                        <FormControl size="sm">
                            <FormLabel>Страница и диапазон</FormLabel>
                            <Input
                                size="sm"
                                {...register("range", { required: true })}
                                placeholder="Конверсии!A:H"
                            />
                        </FormControl>
                        <FormControl size="sm">
                            <FormLabel>Файл с ключом</FormLabel>
                            <Flex gap={2} alignItems={"center"}>
                                <Button
                                    size="sm"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    Choose {item && "Another"} File
                                </Button>
                                <Text>
                                    {keyFile
                                        ? keyFile.name
                                        : item
                                        ? `${item.keyFile}.json`
                                        : "Не выбран"}
                                </Text>
                            </Flex>
                            <Input
                                ref={fileRef}
                                hidden
                                size="sm"
                                type="file"
                                onChange={(e) =>
                                    setKeyFile(
                                        e.target.files
                                            ? e.target.files[0]
                                            : null
                                    )
                                }
                            />
                        </FormControl>
                        <DataOrderSlotList
                            initialItems={
                                item ? item.dataOrder.split(",") : [SPACE]
                            }
                            acceptedFields={acceptedFields}
                            onChange={setDataOrder}
                        />
                    </Stack>
                </ModalBody>
                <ModalFooter gap={1}>
                    <Button size="sm" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="green"
                        onClick={handleSubmit(handleValidSave)}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

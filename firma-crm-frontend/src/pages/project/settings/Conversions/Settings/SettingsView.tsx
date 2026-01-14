import {
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Link,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmDialog from "../../../../../components/confirmDialog/ConfirmDialog";
import { FetchStatus, FETCH_STATUS } from "../../../../../const/http-codes";
import {
    IGoogleConversion,
    IProjectYandexSettings,
} from "../../../../../models/IProject";

type SettingsViewItem<T> = T extends IProjectYandexSettings
    ? IProjectYandexSettings
    : IGoogleConversion;

export type SetSettingsStatus = (status: FetchStatus) => void;

type SettingsViewProps<T> = {
    mode: "google" | "yandex";
    item: SettingsViewItem<T> | null;
    modeName: string;
    projectId: number;
    updateHandler: (
        data: SettingsViewItem<T>,
        setStatus: SetSettingsStatus,
        onUpdated: (data: SettingsViewItem<T>) => void
    ) => void;
    deleteHandler: (id: number, setStatus: SetSettingsStatus) => void;
};

type FormState = {
    counterId: string | number;
    requestEvent: string;
    callEvent: string;
    isAnalytics: boolean;
};

const SettingsView = <T,>(props: PropsWithChildren<SettingsViewProps<T>>) => {
    const {
        mode,
        item: _item,
        modeName,
        projectId,
        deleteHandler,
        updateHandler,
    } = props;

    const {
        isOpen: isConfirmOpen,
        onOpen: confirmOpen,
        onClose: confirmClose,
    } = useDisclosure();

    const [status, setStatus] = useState<FetchStatus>(FETCH_STATUS.IDLE);
    const [item, setItem] = useState<SettingsViewItem<T> | null>(() => _item);

    const isNew = item?.id === -1;

    const isReloading = status === "RELOADING";

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<FormState>({
        mode: "onSubmit",
        defaultValues: item
            ? item
            : {
                  counterId: "",
                  callEvent: "",
                  requestEvent: "",
                  isAnalytics: false,
              },
    });

    const onSubmit = async (_data: FormState) => {
        const data: any = {
            ...item,
            ..._data,
        };

        if (isNew) delete data.id;
        if (mode !== "google") delete data.isAnalytics;

        await updateHandler(data, setStatus, (newItem: SettingsViewItem<T>) =>
            setItem(newItem)
        );
    };

    const onCreate = () => {
        setItem({
            id: -1,
            counterId: -1,
            callEvent: "",
            requestEvent: "",
            projectId,
        } as any);
    };

    const onDelete = async () => {
        if (item) {
            await deleteHandler(item.id, setStatus);
            setItem(null);
            confirmClose();
        }
    };

    return (
        <VStack
            align={item ? "stretch" : "center"}
            pt={item ? 2 : 8}
            pb={item ? 0 : 12}
        >
            {item ? (
                <>
                    <FormControl isInvalid={!!errors.counterId}>
                        <FormLabel>{modeName} | ID Счётчика :</FormLabel>
                        <Input
                            isDisabled={isReloading}
                            autoFocus
                            placeholder={`ID Счётчика`}
                            type="text"
                            {...register("counterId", {
                                required: {
                                    value: true,
                                    message: "Обязательно для заполнения",
                                },
                            })}
                        />
                        {errors.counterId && (
                            <FormErrorMessage>
                                <>{errors.counterId.message}</>
                            </FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl>
                        <FormLabel>{modeName} | Событие звонка:</FormLabel>
                        <Input
                            isDisabled={isReloading}
                            placeholder="Событие звонка"
                            {...register("callEvent")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>{modeName} | Событие заявки:</FormLabel>
                        <Input
                            isDisabled={isReloading}
                            placeholder="Событие заявки"
                            {...register("requestEvent")}
                        />
                    </FormControl>
                    {mode === "google" && (
                        <Checkbox pb={2} pt={3} {...register("isAnalytics")}>
                            Google Аналитика
                        </Checkbox>
                    )}
                    <HStack
                        py={2}
                        justify={isNew ? "flex-end" : "space-between"}
                    >
                        {!isNew && (
                            <Button
                                isLoading={isReloading}
                                loadingText={"Удаление..."}
                                onClick={confirmOpen}
                                colorScheme="red"
                                size="sm"
                            >
                                Удалить настройки
                            </Button>
                        )}
                        <Button
                            isLoading={isReloading}
                            loadingText={
                                isNew ? "Сохранение..." : "Обновление..."
                            }
                            onClick={handleSubmit(onSubmit)}
                            colorScheme="green"
                            size="sm"
                        >
                            {isNew ? "Сохранить" : "Обновить"}
                        </Button>
                    </HStack>
                </>
            ) : (
                <>
                    <Text fontWeight={500} as="h4">
                        Настройки не созданы
                    </Text>
                    <Link onClick={onCreate} fontSize="16px" color="blue.500">
                        Создать настройки
                    </Link>
                </>
            )}
            <ConfirmDialog
                isCentered
                onAccept={onDelete}
                onCancel={confirmClose}
                isOpen={isConfirmOpen}
                isLoading={isReloading}
                title="Удаление настроек"
                text="Вы действительно хотите удалить настройки конверсий этого проекта?"
            />
        </VStack>
    );
};

export default SettingsView;

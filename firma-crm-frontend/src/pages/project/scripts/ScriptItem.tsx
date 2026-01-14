import {
    Badge,
    Box,
    Button,
    HStack,
    IconButton,
    Input,
    Textarea,
    Tooltip,
    useBoolean,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import ConfirmDialog from "../../../components/confirmDialog/ConfirmDialog";
import {
    SUCCESS_DELETE,
    SUCCESS_POST,
    SUCCESS_PUT,
} from "../../../const/http-codes";
import useAppToast from "../../../hooks/useAppToast";
import { IProjectScript } from "../../../models/IProjectScript";
import projectScriptService from "../../../services/project-script-service";

type ScriptItemProps = {
    script: IProjectScript;
    idx?: number;
    fetchScripts: () => void;
    createMode: boolean;
    isNew?: boolean;
    offCreateMode?: () => void;
};

const ScriptItem: React.FC<ScriptItemProps> = ({
    script,
    idx,
    fetchScripts,
    createMode,
    isNew,
    offCreateMode,
}) => {
    const [editMode, setEditMode] = useBoolean(
        isNew === undefined ? false : true
    );

    const toast = useAppToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [loading, setLoading] = useState(false);

    const [selector, setSelector] = useState(script.selector);
    const [code, setCode] = useState(script.code);
    const [position, setPosition] = useState(0);
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.setSelectionRange(position, position);
    }, [position]);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = ref.current?.scrollHeight + 2 + "px";
        }
    }, [code, editMode]);

    const candelEdit = () => {
        setCode(script.code);
        setSelector(script.selector);
        setEditMode.off();
        offCreateMode && offCreateMode();
    };

    const onKeyDown = (e: any) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const target: HTMLInputElement = e.target;
            const position = target.selectionStart || 0;
            setCode(
                target.value.slice(0, position) +
                    "    " +
                    target.value.slice(position)
            );
            setPosition(position + 4);
        }
    };

    const deleteScript = async () => {
        onClose();
        setLoading(true);
        try {
            const response = await projectScriptService.deleteById(script.id);

            if (response.status === SUCCESS_DELETE) {
                await fetchScripts();
                toast({
                    status: "success",
                    text: `Скрипт #${idx} удален успешно`,
                });
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response)
                toast({
                    status: "error",
                    text: "Ошибка удаления: " + error.response.data.message,
                });
        }
        setLoading(false);
    };

    const save = async () => {
        try {
            const response = await projectScriptService.create({
                projectId: script.projectId,
                code,
                selector,
            });

            if (response.status === SUCCESS_POST) {
                await fetchScripts();
                toast({
                    status: "success",
                    text: "Скрипт успешно создан",
                });
                offCreateMode && offCreateMode();
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response)
                toast({
                    status: "error",
                    text: "Ошибка создания: " + error.response.data.message,
                });
        }
    };

    const update = async () => {
        try {
            const response = await projectScriptService.update({
                id: script.id,
                code,
                selector,
            });

            if (response.status === SUCCESS_PUT) {
                await fetchScripts();
                toast({
                    status: "success",
                    text: "Скрипт успешно обновлён",
                });
                setEditMode.off();
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response)
                toast({
                    status: "error",
                    text: "Ошибка обновления: " + error.response.data.message,
                });
        }
    };

    const saveSript = async () => {
        if (!selector)
            return toast({
                status: "error",
                text: "Селектор должен быть заполен",
            });
        if (!code)
            return toast({
                status: "error",
                text: "Код скрипта должен быть заполен",
            });

        setLoading(true);
        await (isNew ? save() : update());
        setLoading(false);
    };

    const onChangeTextArea = (e: any) => {
        setCode(e.target.value);
    };

    return (
        <VStack align="stretch" rounded={2} px={4} py={2} borderWidth={1}>
            <HStack fontWeight={500} borderBottomWidth={1} pb={2}>
                {idx && <span>#{idx}</span>}
                {editMode ? (
                    <Input
                        placeholder="Селектор"
                        fontWeight={500}
                        maxW="300px"
                        size="sm"
                        autoFocus={isNew}
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                    />
                ) : (
                    <Badge colorScheme="green">{script.selector}</Badge>
                )}
                {(!createMode || isNew) && (
                    <HStack spacing={2} flexGrow={1} justify="flex-end">
                        {!editMode ? (
                            <>
                                <Tooltip
                                    label="Изменить скрипт"
                                    fontSize={"10px"}
                                >
                                    <IconButton
                                        bg="transparent"
                                        color={"green"}
                                        size="xs"
                                        fontSize={"1.1em"}
                                        aria-label="edit script"
                                        onClick={setEditMode.on}
                                        icon={<MdModeEditOutline />}
                                    />
                                </Tooltip>
                                <Tooltip
                                    label="Удалить скрипт"
                                    fontSize={"10px"}
                                >
                                    <IconButton
                                        onClick={onOpen}
                                        bg="transparent"
                                        color={"red"}
                                        size="xs"
                                        fontSize={"1.1em"}
                                        aria-label="delete script"
                                        icon={<FaTimes />}
                                    />
                                </Tooltip>
                            </>
                        ) : (
                            <>
                                <Button
                                    isLoading={loading}
                                    size="xs"
                                    colorScheme="green"
                                    onClick={saveSript}
                                    tabIndex={-1}
                                >
                                    Сохранить
                                </Button>
                                <Tooltip label="Отмена" fontSize={"10px"}>
                                    <IconButton
                                        isDisabled={loading}
                                        bg="transparent"
                                        size="xs"
                                        fontSize={"1.1em"}
                                        aria-label="cancel edits"
                                        icon={<FaTimes />}
                                        tabIndex={-1}
                                        onClick={candelEdit}
                                    />
                                </Tooltip>
                            </>
                        )}
                    </HStack>
                )}
            </HStack>
            {editMode ? (
                <Textarea
                    maxH="60vh"
                    placeholder="Код"
                    ref={ref}
                    autoFocus={!isNew}
                    spellCheck="false"
                    autoComplete="off"
                    value={code}
                    size="sm"
                    onKeyDown={onKeyDown}
                    onChange={onChangeTextArea}
                />
            ) : (
                <Box as="pre" textAlign={"left"} whiteSpace="break-spaces">
                    {script.code}
                </Box>
            )}
            <ConfirmDialog
                text={`Вы действительно хотите удалить скрипт #${idx}`}
                onAccept={deleteScript}
                title="Удаление скрипта"
                onCancel={onClose}
                isOpen={isOpen}
            />
        </VStack>
    );
};

export default ScriptItem;

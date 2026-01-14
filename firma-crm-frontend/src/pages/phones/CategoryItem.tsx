import {
    Badge,
    Box,
    Checkbox,
    Flex,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Text,
    Tooltip,
    useBoolean,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import BlockLoader from "../../components/ui/loader/BlockLoader";
import useAppToast from "../../hooks/useAppToast";
import { IPhone } from "../../models/IPhone";
import phoneService from "../../services/phone-service";
import { insertPhoneInMask } from "../project/settings/PhoneModal/PhoneModal";
import { CategoryType } from "./Phones";
import { Link } from "react-router-dom";
import { getPathWithParam } from "../../utils/getPathWithParam";
import { ROUTES } from "../../router/routes";

type CategoryItemProps = {
    category: CategoryType;
    globalEditMode: boolean;
    fetchPhones: () => void;
    globalLoading: boolean;
};

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    globalEditMode,
    fetchPhones,
    globalLoading,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [editMode, setEditMode] = useBoolean();
    const [createMode, setCreateMode] = useBoolean();
    const [loading, setLoading] = useBoolean();
    const [editPhone, setEditPhone] = useState("");
    const [editPhoneId, setEditPhoneId] = useState<null | number>(null);
    const [isReserved, setIsReserved] = useState(false);
    const toast = useAppToast();

    const isMode = editMode || createMode;

    const offMode = () => {
        setEditPhone("");
        setEditPhoneId(null);
        setIsReserved(false);
        setCreateMode.off();
        setEditMode.off();
    };

    const editHandler = (phone: IPhone) => () => {
        setEditPhone(phone.phone);
        setEditPhoneId(phone.id);
        setIsReserved(!!phone.isReserved);
        setEditMode.on();
    };

    const submitHandler = async () => {
        function showError(error?: string) {
            if (error)
                toast({
                    status: "error",
                    text: error,
                });
        }

        if (editPhone.length < 7 || editPhone.length > 15)
            return showError("Некорректная длина номера");

        const options: any = {
            isReserved,
            phone: editPhone,
            regionId: category.region.id,
        };

        if (editMode) options.id = editPhoneId || 0;

        setLoading.on();
        try {
            await phoneService[createMode ? "add" : "update"](options);
            offMode();
            await fetchPhones();
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error) showError(error.response?.data.message);
        }
        setLoading.off();
    };

    const deleteHandler = (id: number) => () => {
        setEditPhoneId(id);
        onOpen();
    };

    const onKeyDown = (e: any) => {
        if (e.key === "Enter") {
            submitHandler();
        }
    };

    const onCancel = () => {
        setEditPhoneId(null);
        onClose();
    };

    const onAccept = async () => {
        setLoading.on();
        try {
            await phoneService.delete(editPhoneId || 0);
            await fetchPhones();
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error && error.response)
                toast({
                    status: "error",
                    text: error.response.data.message,
                });
        }
        setLoading.off();
        onClose();
    };

    return (
        <VStack
            minW="260px"
            p={2}
            borderWidth={1}
            rounded={2}
            alignItems="stretch"
            w="32%"
        >
            <Heading
                pb={2}
                borderBottomWidth={1}
                size="sm"
                display={"flex"}
                alignItems="center"
                justifyContent={"space-between"}
                textAlign={"center"}
            >
                {isMode ? (
                    <>
                        <InputGroup size="sm">
                            <InputLeftElement>
                                {isReserved ? (
                                    <Tooltip label="Резервный номер">
                                        <Badge color="blue">Р</Badge>
                                    </Tooltip>
                                ) : (
                                    <FaPlus fontSize={".7em"} />
                                )}
                            </InputLeftElement>
                            <Input
                                isRequired
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                fontWeight={500}
                                type="number"
                                autoFocus
                                onKeyDown={onKeyDown}
                                placeholder="Номер"
                            />
                            <InputRightElement>
                                <Checkbox
                                    isDisabled={loading}
                                    colorScheme="blue"
                                    isChecked={isReserved}
                                    onChange={(e) =>
                                        setIsReserved(e.target.checked)
                                    }
                                />
                            </InputRightElement>
                        </InputGroup>
                        <IconButton
                            ml={1}
                            colorScheme="green"
                            size="xs"
                            isLoading={loading}
                            aria-label="save"
                            icon={<FaCheck />}
                            onClick={submitHandler}
                        />
                        <IconButton
                            ml={1}
                            isDisabled={loading}
                            onClick={offMode}
                            colorScheme="blue"
                            size="xs"
                            aria-label="save"
                            icon={<FaTimes />}
                        />
                    </>
                ) : (
                    <>
                        <Box>{category.region.name}</Box>
                        <IconButton
                            onClick={setCreateMode.on}
                            size="xs"
                            aria-label="add phone"
                            colorScheme="green"
                            icon={<FaPlus />}
                        />
                    </>
                )}
            </Heading>
            {globalLoading ? (
                <BlockLoader blockProps={{ w: "100%" }} />
            ) : (
                <VStack alignItems="stretch" overflowY={"auto"}>
                    {category.phones.map((phone, i) => {
                        const isEdited = phone.id === editPhoneId;

                        const maskedPhone = getMaskedPhone(
                            category.region.name,
                            editMode && isEdited ? editPhone : phone.phone
                        );

                        return (
                            <Flex
                                gap={1}
                                pl={1.5}
                                key={i}
                                alignItems="center"
                                color={isEdited ? "blue" : {}}
                                _hover={{ color: "blue" }}
                            >
                                <Text as="b" fontWeight={500}>
                                    {i + 1}.
                                </Text>
                                <Text as="span">
                                    <Link
                                        to={getPathWithParam(
                                            ROUTES.phone.path,
                                            phone.id
                                        )}
                                    >
                                        {maskedPhone}
                                    </Link>
                                </Text>
                                {phone.isReserved && (
                                    <Tooltip
                                        fontSize="10px"
                                        label="Резервный номер"
                                    >
                                        <Badge color="blue">Р</Badge>
                                    </Tooltip>
                                )}
                                {globalEditMode && !editMode && (
                                    <>
                                        <IconButton
                                            ml="auto"
                                            size="xs"
                                            aria-label="edit-phone"
                                            colorScheme="blue"
                                            onClick={editHandler(phone)}
                                            icon={<MdEdit />}
                                        />
                                        <IconButton
                                            size="xs"
                                            aria-label="delete-phone"
                                            colorScheme="red"
                                            onClick={deleteHandler(phone.id)}
                                            icon={<FaTimes />}
                                        />
                                    </>
                                )}
                            </Flex>
                        );
                    })}
                </VStack>
            )}
            <ConfirmDialog
                isOpen={isOpen}
                onCancel={onCancel}
                onAccept={onAccept}
                isLoading={loading}
                title="Удаление номера"
                text={`Внимание!\nЕсли Вы удалите номер, то он пропадёт на сайтах к которым он привязан.\nВы действительно желаете удалить номер ${
                    category.phones.find((phone) => phone.id === editPhoneId)
                        ?.phone
                }?`}
            />
        </VStack>
    );
};

export default CategoryItem;

export const maskAssociations: any = {
    Беларусь: "+### (##) ###-##-##",
    Москва: "+# (###) ###-##-##",
    СПБ: "+# (###) ###-##-##",
};

export const getMaskedPhone = (regionName: string, phone: string) => {
    const mask = maskAssociations[regionName];
    if (mask) return insertPhoneInMask(phone, mask);

    return phone;
};

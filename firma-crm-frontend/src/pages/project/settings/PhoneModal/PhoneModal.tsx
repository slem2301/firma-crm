import {
    Button,
    Flex,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { IMask } from "../../../../models/IMask";
import { IPhone, IPhoneOptions } from "../../../../models/IPhone";
import AddMask from "./AddMask";
import AddPhone from "./AddPhone";
import PhoneOptions from "./PhoneOptions";

type PhoneModalProps = {
    phone?: IPhone;
    setPhone: (phone: IPhone | undefined) => void;
    mask?: IMask;
    setMask: (mask: IMask | undefined) => void;
    autoPhoneMode: boolean;
    phoneOptions?: IPhoneOptions;
};

export const insertPhoneInMask = (phone: string, mask: string) => {
    return phone.split("").reduce((_mask, symbol) => {
        const deleted = _mask.replace("/", "");

        if (deleted !== _mask) return deleted;

        return _mask.replace("#", symbol).trim();
    }, mask);
};

export type PhoneModalState =
    | "normal"
    | "phone"
    | "mask"
    | "phone-add"
    | "mask-add";

const PhoneModal: React.FC<PhoneModalProps> = ({
    phone,
    mask,
    setMask,
    setPhone,
    autoPhoneMode,
    phoneOptions,
}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const { phones } = useAppSelector((state) => state.phone);
    const { masks } = useAppSelector((state) => state.mask);

    const [currentPhone, setCurrentPhone] = useState<IPhone | undefined>(phone);
    const [currentMask, setCurrentMask] = useState<IMask | undefined>(mask);

    const [state, setState] = useState<PhoneModalState>("normal");
    const [phoneId, setPhoneId] = useState(currentPhone?.id || 0);
    const [maskId, setMaskId] = useState(currentMask?.id || 0);

    const closeModal = () => {
        setState("normal");
        setCurrentPhone(phone);
        onClose();
    };

    const closeHandler = () => {
        switch (state) {
            case "normal":
                closeModal();
                break;
            case "mask":
            case "phone":
                setState("normal");
                break;
            case "phone-add":
                setState("phone");
                break;
            case "mask-add":
                setState("mask");
                break;
            default:
                break;
        }
    };

    const saveHandler = () => {
        switch (state) {
            case "normal":
                setPhone(currentPhone);
                setMask(currentMask);
                onClose();
                break;
            case "mask":
                if (mask?.id !== maskId && masks) {
                    const newMask = masks.find((mask) => mask.id === maskId);
                    newMask && setCurrentMask(newMask);
                }
                setState("normal");
                break;
            case "phone":
                if (phone?.id !== phoneId && phones) {
                    const newPhone = phones.find(
                        (phone) => phone.id === phoneId
                    );
                    newPhone && setCurrentPhone(newPhone);
                }
                setState("normal");
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Button
                onClick={onOpen}
                size="sm"
                w="100%"
                colorScheme="blue"
                variant={"outline"}
            >
                Редактировать номер
            </Button>
            <Modal
                closeOnOverlayClick={false}
                isCentered
                size="lg"
                isOpen={isOpen}
                onClose={closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Настройки номера</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align="stretch">
                            {state === "normal" ? (
                                <>
                                    <Flex
                                        alignItems={"center"}
                                        justifyContent="space-between"
                                    >
                                        <FormLabel mb={0}>
                                            Номер:{" "}
                                            {currentPhone && (
                                                <>
                                                    {currentMask
                                                        ? insertPhoneInMask(
                                                              currentPhone.phone,
                                                              currentMask.mask
                                                          )
                                                        : currentPhone.phone}
                                                </>
                                            )}
                                        </FormLabel>
                                        <PhoneOptions options={phoneOptions} />
                                    </Flex>
                                    {autoPhoneMode && (
                                        <Text color="red">
                                            Включена автоматическая подстановка
                                            номера
                                        </Text>
                                    )}
                                    <Button
                                        isDisabled={autoPhoneMode}
                                        onClick={() => setState("phone")}
                                        variant="outline"
                                    >
                                        {currentPhone
                                            ? "Изменить номер"
                                            : "Добавить номер"}
                                    </Button>

                                    <FormLabel>
                                        Маска:{" "}
                                        {currentMask && <>{currentMask.mask}</>}
                                    </FormLabel>
                                    <Button
                                        onClick={() => setState("mask")}
                                        variant="outline"
                                    >
                                        {currentMask
                                            ? "Изменить маску"
                                            : "Добавить маску"}
                                    </Button>
                                </>
                            ) : state === "phone" || state === "phone-add" ? (
                                <AddPhone
                                    phoneId={phoneId}
                                    setPhoneId={setPhoneId}
                                    setState={setState}
                                    state={state}
                                />
                            ) : (
                                (state === "mask" || state === "mask-add") && (
                                    <AddMask
                                        state={state}
                                        setState={setState}
                                        setMaskId={setMaskId}
                                        maskId={maskId}
                                    />
                                )
                            )}
                        </VStack>
                    </ModalBody>

                    <ModalFooter
                        pt={8}
                        justifyContent={
                            state === "normal" ? "flex-end" : "space-between"
                        }
                    >
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={closeHandler}
                        >
                            {state === "normal" ? "Закрыть" : "Назад"}
                        </Button>
                        <Button onClick={saveHandler} colorScheme="green">
                            {state === "normal"
                                ? "Сохранить"
                                : (state === "mask" && currentMask) ||
                                  (state === "phone" && currentPhone)
                                ? "Изменить"
                                : "Добавить"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PhoneModal;

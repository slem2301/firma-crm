import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    InputGroup,
    Tooltip,
    useBoolean,
    VStack,
} from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useAppSelector } from "../../hooks/redux";
import useAppToast from "../../hooks/useAppToast";
import { IAd } from "../../models/IAd";
import { decrypt, encrypt } from "../../utils/encription";
import { ChangedText } from "../../pages/project/settings/ChangedTextInput";
import Select from "../../pages/project/settings/Select";
import PasswordField from "./PasswordField";

type AdItemProps = {
    ad: IAd;
    setAds: React.Dispatch<SetStateAction<IAd[]>>;
    editMode: boolean;
    index: number;
    removeAdHandler: (ad: IAd) => () => void;
};

export const nameAssociacions = {
    google: "Google",
    yandex: "Яндекс",
};

const AdItem: React.FC<AdItemProps> = ({
    ad,
    editMode,
    index,
    setAds,
    removeAdHandler,
}) => {
    const [editable, setEditable] = useBoolean(false);
    const [decryptedPassword, setDecryptedPassword] = useState(() =>
        decrypt(ad.password)
    );

    const toast = useAppToast();

    const {
        currency: { currencies },
        ad: { ads },
    } = useAppSelector((state) => state);

    const [currencyId, setCurrencyId] = useState(ad.currency.id);

    const currentCurrency = currencies.find((item) => item.id === currencyId);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            login: ad.login,
            password: decryptedPassword,
            balance: ad.balance,
            delay: ad.delay,
        },
    });

    const save = (data: any) => {
        const candidate = ads.find(
            (item) =>
                item.id !== ad.id &&
                item.type === ad.type &&
                item.login === data.login
        );

        if (candidate) {
            return toast({
                text: "Аккаунт с таким типом и логином уже существует",
                status: "error",
            });
        }

        setAds((prev) =>
            prev.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        ...data,
                        password: encrypt(data.password),
                        currencyId,
                        currency: currentCurrency,
                    };
                }

                return item;
            })
        );

        setEditable.off();
    };

    useEffect(() => {
        if (!editMode) setEditable.off();
    }, [editMode, setEditable]);

    useEffect(() => {
        setDecryptedPassword(decrypt(ad.password));
    }, [ad]);

    return (
        <VStack
            w={"100%"}
            alignItems="stretch"
            borderWidth={1}
            p={2}
            key={`${ad.type}${ad.login}`}
        >
            <HStack borderBottomWidth={1} pb={2} justify="space-between">
                <FormLabel mb={0}>
                    {nameAssociacions[ad.type]} аккаунт
                </FormLabel>
                {editMode && (
                    <HStack spacing={0}>
                        {editable ? (
                            <Tooltip
                                fontSize={"10px"}
                                openDelay={400}
                                label="Сохранить"
                            >
                                <IconButton
                                    aria-label="save"
                                    size="sm"
                                    rounded={20}
                                    overflow="hidden"
                                    bg="transparent"
                                    icon={<FaCheck />}
                                    onClick={handleSubmit(save)}
                                />
                            </Tooltip>
                        ) : (
                            <Tooltip
                                fontSize={"10px"}
                                openDelay={400}
                                label="Изменить"
                            >
                                <IconButton
                                    aria-label="edit"
                                    size="sm"
                                    rounded={20}
                                    overflow="hidden"
                                    bg="transparent"
                                    icon={<MdEdit />}
                                    onClick={setEditable.on}
                                />
                            </Tooltip>
                        )}
                        <Tooltip
                            fontSize={"10px"}
                            openDelay={400}
                            label="Удалить"
                        >
                            <IconButton
                                aria-label="delete"
                                size="sm"
                                rounded={20}
                                overflow="hidden"
                                bg="transparent"
                                icon={<FaTimes />}
                                onClick={removeAdHandler(ad)}
                            />
                        </Tooltip>
                    </HStack>
                )}
            </HStack>
            <FormControl
                isInvalid={!!errors.login}
                display={"flex"}
                alignItems="center"
            >
                <FormLabel mb={0}>Логин:</FormLabel>
                <InputGroup>
                    <ChangedText
                        {...register("login", {
                            required: {
                                message: "Введите логин",
                                value: true,
                            },
                        })}
                        textProps={{ ml: 0 }}
                        isEdited={editable}
                        text={ad.login}
                    />
                </InputGroup>
                <FormErrorMessage>
                    <>{errors?.login?.message}</>
                </FormErrorMessage>
            </FormControl>
            <FormControl
                isInvalid={!!errors.password}
                display={"flex"}
                alignItems="center"
            >
                <FormLabel mb={0}>Пароль:</FormLabel>
                <InputGroup>
                    <ChangedText
                        {...register("password", {
                            required: {
                                message: "Введите пароль",
                                value: true,
                            },
                        })}
                        textProps={{ ml: 0, as: "div" }}
                        isEdited={editable}
                        renderedText={
                            <PasswordField password={decryptedPassword} />
                        }
                        text={decryptedPassword}
                    />
                </InputGroup>
                <FormErrorMessage>
                    <>{errors?.password?.message}</>
                </FormErrorMessage>
            </FormControl>
            <FormControl display={"flex"} alignItems="center">
                <FormLabel mb={0}>Баланс:</FormLabel>
                <InputGroup>
                    <ChangedText
                        {...register("balance")}
                        textProps={{ ml: 0 }}
                        isEdited={editable}
                        text={`${ad.balance} ${
                            ad.type === "yandex" ? currentCurrency?.symbol : "$"
                        }`}
                    />
                </InputGroup>
            </FormControl>
            {ad.type === "yandex" && (
                <FormControl display={"flex"} alignItems="center">
                    <FormLabel mb={0}>Отсрочка:</FormLabel>
                    <InputGroup>
                        <ChangedText
                            {...register("delay")}
                            textProps={{ ml: 0 }}
                            isEdited={editable}
                            text={`${ad.delay} ${currentCurrency?.symbol}`}
                        />
                    </InputGroup>
                </FormControl>
            )}
            <Select
                textProps={{ ml: 0 }}
                props={{ display: "flex", alignItems: "center" }}
                editMode={editable && ad.type !== "google"}
                options={currencies.map(({ name, symbol, id }) => ({
                    name: `${name} ${symbol}`,
                    value: id,
                }))}
                defaultValue={currencyId}
                setValue={setCurrencyId}
                text={`${currentCurrency?.name} ${currentCurrency?.symbol}`}
                name="Валюта"
            />
        </VStack>
    );
};

export default AdItem;

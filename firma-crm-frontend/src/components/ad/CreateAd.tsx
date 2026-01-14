/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SingleSelectFilter, { optionType } from "../filters/SingleSelectFilter";
import { useAppSelector } from "../../hooks/redux";
import { AdType, IAd } from "../../models/IAd";
import { encrypt } from "../../utils/encription";

type CreateAdProps = {
    onClose: () => void;
    ads: IAd[];
    setAds: React.Dispatch<React.SetStateAction<IAd[]>>;
    onSubmit?: (newAd: IAd) => void;
};

const currencyAssociation: any = {
    yandex: "BLR",
    google: "USD",
};

const CreateAd: React.FC<CreateAdProps> = ({
    onClose,
    ads,
    setAds,
    onSubmit: _onSubmit,
}) => {
    const {
        currency: { currencies },
        ad: { ads: allAds },
    } = useAppSelector((state) => state);

    const [options, setOptions] = useState<optionType<AdType>[]>([]);
    const [createAdType, setCreateAdType] = useState<AdType>("yandex");

    const [currencyId, setCurrencyId] = useState<number>(
        currencies.find(
            (currency) => currency.key === currencyAssociation[createAdType]
        )?.id || 0
    );

    const currentCurrency = currencies.find(
        (currency) => currency.id === currencyId
    );

    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
    } = useForm({
        defaultValues: {
            balance: 0,
            login: "",
            password: "",
            delay: 0,
        },
    });

    const onSubmit = (data: any) => {
        const candidate = allAds.find(
            (ad) => ad.login === data.login && ad.type === createAdType
        );
        if (candidate) {
            return setError("login", {
                message: "Аккаунт с таким Логином и типом уже существует",
            });
        }

        const newAd = {
            ...data,
            currency: currentCurrency,
            currencyId: currentCurrency?.id,
            password: encrypt(data.password),
            type: createAdType,
        };

        if (_onSubmit) {
            return _onSubmit(newAd);
        }

        setAds((prev) => [
            ...prev,
            {
                ...data,
                currency: currentCurrency,
                currencyId: currentCurrency?.id,
                password: encrypt(data.password),
                type: createAdType,
            },
        ]);
        onClose();
    };

    useEffect(() => {
        let newOptions: optionType<AdType>[] = [];

        if (!ads.find((ad) => ad.type === "yandex"))
            newOptions.push({
                name: "Яндекс",
                value: "yandex",
            });
        if (!ads.find((ad) => ad.type === "google"))
            newOptions.push({
                name: "Google",
                value: "google",
            });

        setCreateAdType(newOptions[0].value);
        setOptions(newOptions);
    }, [ads]);

    useEffect(() => {
        const id =
            currencies.find(
                (currency) => currency.key === currencyAssociation[createAdType]
            )?.id || 0;
        if (id !== currencyId) setCurrencyId(id);
    }, [createAdType, currencies]);

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Создать рекламный аккаунт</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack alignItems={"stretch"}>
                        <Box>
                            <FormLabel>Тип аккаунта</FormLabel>
                            <SingleSelectFilter<AdType>
                                bold
                                paired
                                setValue={setCreateAdType}
                                options={options}
                                defaultValue={createAdType}
                            />
                        </Box>
                        <Box>
                            <FormLabel>Валюта</FormLabel>
                            <SingleSelectFilter<number>
                                bold
                                paired
                                setValue={setCurrencyId}
                                options={currencies.map(
                                    ({ name, id, symbol }) => ({
                                        name: `${name} ${symbol}`,
                                        value: id,
                                    })
                                )}
                                defaultValue={currencyId}
                                selectProps={{
                                    isDisabled: createAdType !== "yandex",
                                }}
                            />
                        </Box>
                        <FormControl isInvalid={!!errors.login}>
                            <FormLabel>Логин</FormLabel>
                            <Input
                                {...register("login", {
                                    required: {
                                        message: "Введите Логин",
                                        value: true,
                                    },
                                })}
                                size="sm"
                                placeholder={`Логин`}
                            />
                            <FormErrorMessage>
                                <>{errors?.login?.message}</>
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel>Пароль</FormLabel>
                            <Input
                                {...register("password", {
                                    required: {
                                        message: "Введите Пароль",
                                        value: true,
                                    },
                                })}
                                size="sm"
                                placeholder={`Пароль`}
                            />
                            <FormErrorMessage>
                                <>{errors?.password?.message}</>
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Баланс</FormLabel>
                            <InputGroup size="sm">
                                <Input
                                    type="number"
                                    {...register("balance")}
                                    placeholder={`0 ${currentCurrency?.symbol}`}
                                />
                                <InputRightAddon
                                    children={currentCurrency?.symbol}
                                />
                            </InputGroup>
                        </FormControl>
                        {createAdType === "yandex" && (
                            <FormControl>
                                <FormLabel>Отсрочка</FormLabel>
                                <InputGroup size="sm">
                                    <Input
                                        type="number"
                                        {...register("delay")}
                                        placeholder={`0 ${currentCurrency?.symbol}`}
                                    />
                                    <InputRightAddon
                                        children={currentCurrency?.symbol}
                                    />
                                </InputGroup>
                            </FormControl>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        mr={3}
                        onClick={onClose}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        colorScheme="green"
                        size="sm"
                    >
                        Создать
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateAd;

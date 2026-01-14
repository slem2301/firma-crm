import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
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
    Select,
    Tooltip,
    useConst,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { setHours } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { VscAdd } from "react-icons/vsc";
import { SUCCESS_POST } from "../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import useAppToast from "../../../hooks/useAppToast";
import { IExpenseStatisticks } from "../../../models/IStatisticks";
import expenseService from "../../../services/expense-service";
import { addExpense } from "../../../store/slices/statisticks-slice";

type AddExpenseProps = {
    update: () => void;
    item: IExpenseStatisticks;
};

type FormType = {
    yandex: number;
    google: number;
};

const AddExpense: React.FC<AddExpenseProps> = ({ update, item }) => {
    const { onOpen, onClose, isOpen } = useDisclosure();

    const {
        currency: { currencies },
        stat: { addedExpense },
    } = useAppSelector((state) => state);
    const [getLoading, setGetLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();

    const added = addedExpense.find((id) => id === item.id);

    const currentCurrencyKey =
        item.ads.find((ad) => ad.type === "yandex")?.currency.key || "BLR";

    const [currencyKey, setCurrencyKey] = useState(currentCurrencyKey);

    const currentDate = useConst(() => {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        return date;
    });
    const [date, setDate] = useState(currentDate);
    const toast = useAppToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        reset,
    } = useForm();

    const setDefaultValues = useCallback(async () => {
        if (isOpen) {
            setGetLoading(true);

            const values: FormType = {
                google: 0,
                yandex: 0,
            };

            try {
                const response = await expenseService.getOneByDate({
                    projectId: item.id,
                    date: setHours(date, 12),
                });

                if (response.status === SUCCESS_POST) {
                    values.google = response.data.google;
                    values.yandex = response.data.yandex;
                }
            } catch (e) {}

            Object.keys(getValues()).forEach((_key) => {
                const key = _key as keyof FormType;

                setValue(key, values[key]);
            });

            setGetLoading(false);
        }
    }, [item, getValues, setValue, date, isOpen]);

    const closeHandler = () => {
        onClose();
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        setDate(date);
        reset();
    };

    useEffect(() => {
        setDefaultValues();
    }, [setDefaultValues]);

    const onSubmit = async (data: any) => {
        if (setHours(date, 12).getTime() > currentDate.getTime()) {
            toast({
                status: "error",
                text: "Дата должна быть не позднее текущей",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await expenseService.add({
                google: Number(data.google || 0),
                yandex: Number(data.yandex || 0),
                date: setHours(date, 12),
                projectId: item.id,
                currencyKey,
                currencyId:
                    currencies.find((item) => item.key === currencyKey)?.id ||
                    -1,
            });
            if (response.status === SUCCESS_POST) {
                toast({
                    duration: 5000,
                    status: "success",
                    title: item.name,
                    text: `Добавлен расход: google: ${
                        response.data.google
                    }$, yandex: ${response.data.yandex}${
                        currencies.find(
                            (currency) => currency.key === currencyKey
                        )?.symbol
                    }`,
                });

                if (setHours(date, 12).getTime() === currentDate.getTime()) {
                    dispatch(addExpense(item.id));
                }

                await update();
                closeHandler();
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response)
                toast({
                    status: "error",
                    text: error.response.data.message,
                });
        }
        setLoading(false);
    };

    return (
        <>
            <Tooltip
                size="xs"
                label="Добавить расход"
                openDelay={1000}
                fontSize={"12px"}
            >
                <IconButton
                    position="static"
                    rounded={2}
                    onClick={onOpen}
                    aria-label="add"
                    fontSize={"10px"}
                    w={"20px"}
                    minW={"20px"}
                    h={"20px"}
                    icon={added ? <FaCheck /> : <VscAdd />}
                    size="xs"
                    colorScheme={added ? "gray" : "green"}
                />
            </Tooltip>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeHandler}>
                    <ModalOverlay />
                    <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>{item.name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack>
                                <FormControl isInvalid={!!errors.yandex}>
                                    <FormLabel>Яндекс расход</FormLabel>
                                    <InputGroup size="sm">
                                        <Input
                                            disabled={getLoading}
                                            type="number"
                                            {...register("yandex")}
                                            autoFocus
                                            placeholder={`0 ${
                                                currencies.find(
                                                    (item) =>
                                                        item.key === currencyKey
                                                )?.symbol
                                            }`}
                                        />
                                        <InputRightAddon
                                            p={0}
                                            children={
                                                <Select
                                                    h={"32px"}
                                                    fontSize={"14px"}
                                                    cursor="pointer"
                                                    bg="transparent"
                                                    borderWidth={0}
                                                    p={0}
                                                    w={"100%"}
                                                    onChange={(e) =>
                                                        setCurrencyKey(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={currencyKey}
                                                >
                                                    {currencies.map(
                                                        (currency) => (
                                                            <option
                                                                key={
                                                                    currency.key
                                                                }
                                                                value={
                                                                    currency.key
                                                                }
                                                            >
                                                                {
                                                                    currency.symbol
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </Select>
                                            }
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isInvalid={!!errors.google}>
                                    <FormLabel>Google расход</FormLabel>
                                    <InputGroup size="sm">
                                        <Input
                                            disabled={getLoading}
                                            type="number"
                                            {...register("google")}
                                            placeholder="0 $"
                                        />
                                        <InputRightAddon children="$" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Дата</FormLabel>
                                    <ReactDatePicker
                                        locale={"ru"}
                                        onChange={(date) =>
                                            setDate(date || currentDate)
                                        }
                                        selected={date}
                                        dateFormat="dd.MM.yyyy"
                                        customInput={
                                            <Input
                                                size="sm"
                                                placeholder="Выберите период"
                                            />
                                        }
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                disabled={loading || getLoading}
                                size="sm"
                                colorScheme="blue"
                                mr={3}
                                onClick={closeHandler}
                                rounded={2}
                            >
                                Отмена
                            </Button>
                            <Button
                                isLoading={loading || getLoading}
                                type="submit"
                                size="sm"
                                colorScheme="green"
                                rounded={2}
                            >
                                Добавить
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default AddExpense;

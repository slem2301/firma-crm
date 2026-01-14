import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    useConst,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { SUCCESS_POST } from "../../const/http-codes";
import { ICostAccount } from "../../models/cost";
import costService from "../../services/cost-service";
import { getDefaultAccountName } from "./utils/getDefaultName";

interface CreateAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (account: ICostAccount) => void;
}

type CreateAccountFormState = {
    name: string;
};

const defaultState: CreateAccountFormState = {
    name: getDefaultAccountName(),
};

const CreateAccount: React.FC<CreateAccountProps> = ({
    isOpen,
    onClose,
    onCreated,
}) => {
    const [isLoading, setLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
        setValue,
    } = useForm<CreateAccountFormState>({
        mode: "onSubmit",
        defaultValues: {
            name: getDefaultAccountName(),
        },
    });
    const currentDate = useConst(() => new Date());
    const [date, setDate] = useState(currentDate);

    const closeHandler = () => {
        if (!isLoading) onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            reset(defaultState);
        }
    }, [isOpen, reset]);

    useEffect(() => {
        setValue("name", getDefaultAccountName(date));
    }, [date, setValue]);

    const onSubmit = async (formData: CreateAccountFormState) => {
        setLoading(true);
        try {
            const response = await costService.createAccount({
                name: formData.name,
                date,
            });

            if (response.status === SUCCESS_POST) {
                onCreated(response.data);
            }
        } catch (e) {}
        setLoading(false);
    };

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={closeHandler}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton isDisabled={isLoading} />
                <DrawerHeader>Добавление периода</DrawerHeader>

                <DrawerBody as={VStack} align="stretch">
                    <FormControl>
                        <FormLabel>Месяц</FormLabel>
                        <ReactDatePicker
                            locale={"ru"}
                            onChange={(date) => setDate(date || currentDate)}
                            selected={date}
                            dateFormat={"MM/yyyy"}
                            showMonthYearPicker
                            customInput={
                                <Input size="sm" placeholder="Выберите месяц" />
                            }
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.name}>
                        <FormLabel>Название</FormLabel>
                        <Input
                            placeholder="Месяц - Год"
                            {...register("name", {
                                required: {
                                    message: "Введите название!",
                                    value: true,
                                },
                            })}
                        />
                        <FormErrorMessage>
                            <>{errors.name?.message}</>
                        </FormErrorMessage>
                    </FormControl>
                </DrawerBody>

                <DrawerFooter>
                    <Button
                        isDisabled={isLoading}
                        w={"50%"}
                        variant="outline"
                        mr={3}
                        onClick={closeHandler}
                    >
                        Отмена
                    </Button>
                    <Button
                        isLoading={isLoading}
                        loadingText="Сохранение..."
                        w={"50%"}
                        colorScheme="green"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Сохранить
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateAccount;

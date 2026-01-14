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
    FormHelperText,
    FormLabel,
    Input,
    Text,
    Textarea,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
    addPhoneToBlacklist,
    getAllBlockedPhones,
} from "../../store/slices/blacklist-slice";

type AddDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const AddDrawer: React.FC<AddDrawerProps> = ({ isOpen, onClose }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ mode: "onSubmit" });
    const btnRef = useRef(null);
    const dispatch = useAppDispatch();
    const { errorMessage } = useAppSelector((state) => state.blacklist);

    const onSubmit = async (data: any) => {
        const response = await dispatch(addPhoneToBlacklist(data));
        if (response.meta.requestStatus === "fulfilled") {
            await dispatch(getAllBlockedPhones(""));
            onClose();
            reset();
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader fontSize={18}>
                        Добавить номер в черный список
                        {errorMessage && (
                            <Text color="red" fontSize={14} mt={1}>
                                {errorMessage}
                            </Text>
                        )}
                    </DrawerHeader>

                    <DrawerBody>
                        <FormControl isInvalid={!!errors.phone}>
                            <FormLabel>Номер</FormLabel>
                            <Input
                                autoFocus
                                placeholder="Номер, Имя"
                                type="tel"
                                {...register("phone", {
                                    required: {
                                        message: "Введите номер",
                                        value: true,
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                <>{errors.phone && errors.phone.message}</>
                            </FormErrorMessage>
                            <FormHelperText>
                                Введите номер телефона или имя
                            </FormHelperText>
                        </FormControl>
                        <FormLabel mt={2}>Причина</FormLabel>
                        <Textarea
                            placeholder="Причина (не обязательно)"
                            {...register("reason", {})}
                        />
                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            w={"50%"}
                            variant="outline"
                            mr={3}
                            onClick={onClose}
                        >
                            Отмена
                        </Button>
                        <Button w={"50%"} colorScheme="green" type="submit">
                            Добавить
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </form>
        </Drawer>
    );
};

export default AddDrawer;

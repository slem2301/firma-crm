import { Button, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SingleSelectFilter from "../../../../components/filters/SingleSelectFilter";
import BlockLoader from "../../../../components/ui/loader/BlockLoader";
import { SUCCESS_POST } from "../../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import useAppToast from "../../../../hooks/useAppToast";
import phoneService from "../../../../services/phone-service";
import { getAllPhones } from "../../../../store/slices/phone-slice";
import { PhoneModalState } from "./PhoneModal";

type AddPhoneProps = {
    setState: (state: PhoneModalState) => void;
    state: PhoneModalState;
    setPhoneId: (id: number) => void;
    phoneId: number;
};

const AddPhone: React.FC<AddPhoneProps> = ({
    setState,
    state,
    setPhoneId,
    phoneId,
}) => {
    const { phones, loading } = useAppSelector((state) => state.phone);
    const { countries } = useAppSelector((state) => state.country);
    const dispatch = useAppDispatch();

    const [regionId, setRegionId] = useState(0);

    const items = useMemo(() => {
        if (!phones) return [];

        return phones
            .filter((phone) => phone.regionId === regionId)
            .map((phone) => ({
                name: phone.phone,
                value: phone.id,
            }));
    }, [phones, regionId]);

    const [postLoading, setLoading] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const createMode = state === "phone-add";

    const toast = useAppToast();

    const regionItems = useMemo(() => {
        return countries.map((region) => ({
            name: region.name,
            value: region.id,
        }));
    }, [countries]);

    const fetchPhones = useCallback(async () => {
        if (!phones) await dispatch(getAllPhones());
    }, [dispatch, phones]);

    useEffect(() => {
        fetchPhones();
    }, [fetchPhones]);

    useEffect(() => {
        setPhoneId(items[0]?.value || 0);
    }, [regionId, items, setPhoneId]);

    const typeNewPhone = (e: any) => {
        e.preventDefault();
        const arr = e.target.value.split("");
        if (!Number.isNaN(Number(arr.at(-1))) || !arr.length)
            setNewPhone(e.target.value);
    };

    const saveNewPhone = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        try {
            const response = await phoneService.add({
                phone: newPhone.trim(),
                regionId,
                isReserved: false,
            });

            if (response.status === SUCCESS_POST) {
                await dispatch(getAllPhones());
                toast({
                    text: `Создан новый номер: ${newPhone.trim()}`,
                    status: "success",
                });
                setPhoneId(response.data.id);
                setState("phone");
                setNewPhone("");
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            toast({
                text: error?.response?.data?.message,
                status: "error",
            });
        }
        setLoading(false);
    };

    return (
        <>
            <FormLabel>
                {state === "phone" ? "Добавление номера" : "Создание номера"}
            </FormLabel>
            {loading ? (
                <BlockLoader
                    blockProps={{
                        w: "100%",
                        h: "64px",
                    }}
                    spinnerProps={{
                        w: "30px",
                        h: "30px",
                        thickness: "4px",
                    }}
                />
            ) : (
                !!phones && (
                    <>
                        <Text
                            pb={2}
                            display={{ base: "flex", sm: "block" }}
                            flexWrap="wrap"
                            gap={1}
                        >
                            <span>Выбранный номер: </span>
                            <span>
                                {createMode
                                    ? newPhone
                                    : phones.find(
                                          (phone) => phone.id === phoneId
                                      )?.phone || "Не выбран"}
                            </span>
                        </Text>
                        <SingleSelectFilter
                            selectProps={{ size: "md" }}
                            setValue={setRegionId}
                            options={regionItems}
                        />
                        {createMode ? (
                            <VStack
                                onSubmit={saveNewPhone}
                                align={"stretch"}
                                as="form"
                            >
                                <Input
                                    value={newPhone}
                                    placeholder="Новый номер"
                                    onChange={typeNewPhone}
                                    autoFocus
                                    required
                                />
                                <Button
                                    isLoading={postLoading}
                                    type="submit"
                                    colorScheme="green"
                                >
                                    Сохранить номер
                                </Button>
                            </VStack>
                        ) : (
                            <>
                                {!!items.length && (
                                    <SingleSelectFilter
                                        selectProps={{ size: "md" }}
                                        setValue={setPhoneId}
                                        options={items}
                                        defaultValue={phoneId}
                                        paired
                                    />
                                )}
                                <Button
                                    onClick={() => setState("phone-add")}
                                    colorScheme="blue"
                                >
                                    Добавить новый номер
                                </Button>
                            </>
                        )}
                    </>
                )
            )}
        </>
    );
};

export default AddPhone;

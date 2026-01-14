import { Button, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SingleSelectFilter from "../../../../components/filters/SingleSelectFilter";
import BlockLoader from "../../../../components/ui/loader/BlockLoader";
import { SUCCESS_POST } from "../../../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import useAppToast from "../../../../hooks/useAppToast";
import maskService from "../../../../services/mask-service";
import { getAllMasks } from "../../../../store/slices/mask-slice";
import { insertPhoneInMask, PhoneModalState } from "./PhoneModal";

type AddMaskProps = {
    state: PhoneModalState;
    setState: (state: PhoneModalState) => void;
    maskId: number;
    setMaskId: (id: number) => void;
};

export const EXAMPLE_PHONE = "3333333333333333333";

const AddMask: React.FC<AddMaskProps> = ({
    state,
    setState,
    maskId,
    setMaskId,
}) => {
    const { masks, loading } = useAppSelector((state) => state.mask);

    const dispatch = useAppDispatch();

    const items = useMemo(() => {
        if (!masks) return [];

        return masks.map((mask) => ({
            name: mask.mask,
            value: mask.id,
        }));
    }, [masks]);

    const [postLoading, setLoading] = useState(false);
    const [examplePhone, setExamplePhone] = useState(EXAMPLE_PHONE);
    const [newMask, setNewMask] = useState("");
    const createMode = state === "mask-add";

    const toast = useAppToast();

    const fetchMasks = useCallback(async () => {
        if (!masks) await dispatch(getAllMasks());
    }, [dispatch, masks]);

    useEffect(() => {
        fetchMasks();
    }, [fetchMasks]);

    const saveNewMask = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        try {
            const response = await maskService.add({
                mask: newMask.trim(),
            });

            if (response.status === SUCCESS_POST) {
                await dispatch(getAllMasks());
                toast({
                    text: `Создана новая маска: ${newMask.trim()}`,
                    status: "success",
                });
                setMaskId(response.data.id);
                setState("mask");
                setNewMask("");
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
                {state === "mask" ? "Добавление маски" : "Создание маски"}
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
                !!masks && (
                    <>
                        <Text
                            pb={2}
                            display={{ base: "flex", sm: "block" }}
                            flexWrap="wrap"
                            gap={1}
                        >
                            <span>Выбранная маска: </span>
                            <span>
                                {insertPhoneInMask(
                                    examplePhone,
                                    createMode
                                        ? newMask
                                        : masks.find(
                                              (mask) => mask.id === maskId
                                          )?.mask || "Не выбрана"
                                )}
                            </span>
                        </Text>
                        {createMode ? (
                            <VStack
                                onSubmit={saveNewMask}
                                align={"stretch"}
                                as="form"
                            >
                                <FormLabel>Номер для примера:</FormLabel>
                                <Input
                                    autoComplete="off"
                                    value={examplePhone}
                                    placeholder="375299999999"
                                    onChange={(e) =>
                                        setExamplePhone(e.target.value)
                                    }
                                />
                                <Input
                                    autoComplete="off"
                                    value={newMask}
                                    placeholder="+ ### (##) ###-##-##"
                                    onChange={(e) => setNewMask(e.target.value)}
                                    autoFocus
                                    required
                                />
                                <Button
                                    isLoading={postLoading}
                                    type="submit"
                                    colorScheme="green"
                                >
                                    Сохранить маску
                                </Button>
                            </VStack>
                        ) : (
                            <>
                                {!!items.length && (
                                    <SingleSelectFilter
                                        selectProps={{ size: "md" }}
                                        setValue={setMaskId}
                                        options={items}
                                        defaultValue={items[0].value || 0}
                                    />
                                )}
                                <Button
                                    onClick={() => setState("mask-add")}
                                    colorScheme="blue"
                                >
                                    Добавить новую маску
                                </Button>
                            </>
                        )}
                    </>
                )
            )}
        </>
    );
};

export default AddMask;

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    Input,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { useMemo, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { useParams } from "react-router-dom";
import ArraySwitcher from "../../../../components/ui/array-switcher/ArraySwitcher";
import { SUCCESS_PUT } from "../../../../const/http-codes";
import { useAppDispatch } from "../../../../hooks/redux";
import useAppToast from "../../../../hooks/useAppToast";
import { IPhoneOptions } from "../../../../models/IPhone";
import phoneService from "../../../../services/phone-service";
import { getProjectById } from "../../../../store/slices/project-slice";
import PhoneOptionsAttr, { valueIsInherit } from "./PhoneOptionsAttr";

type PhoneOptionsProps = {
    options?: IPhoneOptions;
};

const EXAMPLE_PHONE = "+375 (29) 999-99-99";

export const DEFAULT_VALUE = "inherit";

const PhoneOptions: React.FC<PhoneOptionsProps> = ({ options }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { id } = useParams();
    const projectId = useMemo(() => Number(id), [id]);

    const [loading, setLoading] = useState(false);

    const colorInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const toast = useAppToast();

    const [color, setColor] = useState(
        getAttrFromString("color", options?.options)
    );
    const [fontSize, setFontSize] = useState(
        getAttrFromString("font-size", options?.options, (value) => {
            if (value.includes("em")) {
                const [num] = value.split("em");

                return Number(num) * 16 + "px";
            }

            return value;
        })
    );

    const fontSizeInEm = useMemo(() => {
        if (fontSize.includes("px"))
            return Number(fontSize.replace("px", "")) / 16 + "em";

        return fontSize;
    }, [fontSize]);

    const [fontWeight, setFontWeight] = useState(
        getAttrFromString("font-weight", options?.options)
    );

    const onSubmit = async () => {
        let stringifiedOptions = "";
        if (!valueIsInherit(color)) stringifiedOptions += `color:${color};`;
        if (!valueIsInherit(fontSizeInEm))
            stringifiedOptions += `font-size:${fontSizeInEm};`;
        if (!valueIsInherit(fontWeight))
            stringifiedOptions += `font-weight:${fontWeight};`;

        setLoading(true);
        try {
            const response = await phoneService.updatePhoneOptions({
                projectId,
                options: stringifiedOptions || null,
            });

            if (response.status === SUCCESS_PUT) {
                await dispatch(getProjectById(projectId));
                toast({
                    text: "Настройки стилей номера успешно обновлены",
                });
                onClose();
            }
        } catch (e) {}
        setLoading(false);
    };

    const pickColorHandler = () => {
        if (colorInputRef.current) colorInputRef.current.click();
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                rounded={20}
                bg="transparent"
                size="sm"
                fontSize={"1.2em"}
                aria-label="open phone options"
                icon={<MdSettings />}
            />
            {isOpen && (
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader fontSize={18}>
                            Настройки стилей номера
                        </DrawerHeader>

                        <DrawerBody>
                            <VStack align="stretch">
                                <Text
                                    color={color}
                                    textAlign={"center"}
                                    fontWeight={fontWeight}
                                    fontSize={fontSize}
                                >
                                    {EXAMPLE_PHONE}
                                </Text>
                                <PhoneOptionsAttr
                                    name="Цвет"
                                    editableProp="color"
                                    startValue={color}
                                    onChange={setColor}
                                    input={({ setValue, isInherit }) =>
                                        !isInherit ? (
                                            <>
                                                <Button
                                                    onClick={pickColorHandler}
                                                    size="sm"
                                                    variant={"outline"}
                                                >
                                                    Выбрать цвет
                                                </Button>
                                                <Input
                                                    onChange={(e) =>
                                                        setValue(e.target.value)
                                                    }
                                                    type="color"
                                                    h="0"
                                                    visibility={"hidden"}
                                                    ref={colorInputRef}
                                                />
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                />

                                <PhoneOptionsAttr
                                    name="Жирность"
                                    editableProp="fontWeight"
                                    startValue={fontWeight}
                                    onChange={setFontWeight}
                                    input={({ value, setValue, isInherit }) =>
                                        !isInherit ? (
                                            <ArraySwitcher
                                                value={
                                                    Number(value)
                                                        ? Number(value) / 100
                                                        : 4
                                                }
                                                setValue={(value) =>
                                                    setValue(value.toString())
                                                }
                                                min={3}
                                                max={8}
                                                koef={100}
                                            />
                                        ) : (
                                            <></>
                                        )
                                    }
                                />

                                <PhoneOptionsAttr
                                    name="Размер"
                                    startValue={fontSize}
                                    onChange={setFontSize}
                                    input={({ isInherit, value, setValue }) =>
                                        !isInherit ? (
                                            <ArraySwitcher
                                                value={
                                                    Number(
                                                        value.replace("px", "")
                                                    ) || 16
                                                }
                                                setValue={(value) =>
                                                    setValue(value + "px")
                                                }
                                                min={1}
                                                max={100}
                                                koef={1}
                                            />
                                        ) : (
                                            <></>
                                        )
                                    }
                                />
                            </VStack>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button
                                w={"50%"}
                                variant="outline"
                                mr={3}
                                isDisabled={loading}
                                onClick={onClose}
                            >
                                Отмена
                            </Button>
                            <Button
                                isLoading={loading}
                                w={"50%"}
                                colorScheme="green"
                                onClick={onSubmit}
                            >
                                Сохранить
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    );
};

export default PhoneOptions;

const getAttrFromString = (
    propName: string,
    options?: string,
    transformValue?: (value: string) => string
) => {
    if (!options) return DEFAULT_VALUE;

    const optionsObj = options
        .split(";")
        .filter((part) => !!part)
        .reduce((result: any, prop) => {
            const [key, value] = prop.split(":");
            result[key] = value;
            return result;
        }, {});

    let value = optionsObj[propName];
    if (!value) return DEFAULT_VALUE;
    if (transformValue) return transformValue(value);

    return value;
};

/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    InputGroup,
    InputLeftAddon,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { COLOR_SCHEME } from "../../../const/colors";
import { IProject } from "../../../models/IProject";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { ChangedText } from "./ChangedTextInput";
import { EMAIL_PATTERN } from "../../../const/patterns";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
    deleteProject,
    setProjectResponseError,
    updateProject,
} from "../../../store/slices/project-slice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../router/routes";
import ConfirmDialog from "../../../components/confirmDialog/ConfirmDialog";
import useAppToast from "../../../hooks/useAppToast";
import ChangedCheckbox from "./ChangedCheckbox";
import Select from "./Select";
import { IAd } from "../../../models/IAd";
import Ad from "../../../components/ad/Ad";
import Private from "../../../components/private/Private";
import { ROLES } from "../../../hooks/useRoles";
import ArraySwitcher from "../../../components/ui/array-switcher/ArraySwitcher";
import InfoText from "./InfoText";
import PhoneModal, { insertPhoneInMask } from "./PhoneModal/PhoneModal";
import { IPhone } from "../../../models/IPhone";
import { IMask } from "../../../models/IMask";
import DeletePhone from "./DeletePhone";
import Conversions from "./Conversions/Conversions";
import { GoogleTablesSettings } from "./GoogleTables";

type SettingsProps = {
    project: IProject;
};

type FieldType = {
    key: keyof IProject;
    text: string;
    errorText?: string;
    leftAddon?: string;
    rules?: {
        [key: string]: {
            message: string;
            value: any;
        };
    };
    render?: (i: number) => JSX.Element;
};

const Settings: React.FC<SettingsProps> = ({ project }) => {
    const toast = useAppToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { postLoading, responseError } = useAppSelector(
        (state) => state.project
    );

    const {
        country: { countries },
        product: { products },
    } = useAppSelector((state) => state);

    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const dispatch = useAppDispatch();

    const [ads, setAds] = useState<IAd[]>(project.ads);

    const [autoPhoneMode, setAutoPhoneMode] = useState(!!project.autoPhoneMode);

    const [countryId, setCountryId] = useState(project.countryId);
    const [productId, setProductId] = useState(project.productId);
    const [isTesting, setIsTesting] = useState(project.isTesting);

    const projectPhone: IPhone | undefined = useMemo(
        () => project?.phones[0],
        [project]
    );

    const [mask, setMask] = useState<IMask | undefined>(project.mask);
    const [phone, setPhone] = useState<IPhone | undefined>(projectPhone);

    const [randomRedirect, setRandomRedirect] = useState<number>(
        project.randomRedirect
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        setValue,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            name: project.name,
            domain: project.domain,
            url: project.url,
            mailTo: project.mailTo,
            telegramBotToken: project.telegramBotToken,
            telegramChatId: project.telegramChatId,
        },
    });

    const fields: FieldType[] = [
        {
            key: "section" as keyof IProject,
            text: "Общие параметры",
        },
        {
            key: "name",
            text: "Название проекта",
            errorText: "Введите название проекта",
        },
        {
            key: "domain",
            text: "Домен",
            errorText: "Введите домен",
        },
        {
            key: "url",
            text: "Ссылка на сайт",
            errorText: "Введите ссылку на сайт",
        },
        {
            key: "countryId",
            text: "Страна",
            render: (i) => (
                <Select
                    key={i}
                    name="Регион"
                    setValue={setCountryId}
                    options={countries.map(({ id, name }) => ({
                        value: id,
                        name,
                    }))}
                    text={project.country?.name || "Не выбрана"}
                    defaultValue={countryId}
                    editMode={editMode}
                />
            ),
        },
        {
            key: "productId",
            text: "Продуктовая позиция",
            render: (i) => (
                <Select
                    key={i}
                    name="Продуктовая позиция"
                    setValue={setProductId}
                    options={products.map(({ id, name }) => ({
                        value: id,
                        name,
                    }))}
                    text={project.product?.name || "Не выбрана"}
                    defaultValue={productId}
                    editMode={editMode}
                />
            ),
        },
        {
            key: "phones",
            text: "Номер на сайте",
            render: (i) => (
                <Box
                    key={i}
                    display="flex"
                    flexWrap={"wrap"}
                    alignItems="center"
                >
                    <FormLabel w="100%">Номер на сайте</FormLabel>
                    <InfoText>
                        {phone
                            ? mask
                                ? insertPhoneInMask(phone.phone, mask.mask)
                                : phone.phone
                            : "Не установлен"}
                    </InfoText>
                    {projectPhone && !autoPhoneMode && editMode && (
                        <DeletePhone
                            projectId={project.id}
                            phone={projectPhone}
                        />
                    )}
                </Box>
            ),
        },
        {
            key: "autoPhoneMode",
            text: "autoPhoneMode",
            render: (i) => (
                <ChangedCheckbox
                    key={i}
                    isEditable={editMode}
                    name="Автоматическая подстановка номера"
                    isChecked={autoPhoneMode}
                    onChange={(e) => setAutoPhoneMode(e.target.checked)}
                />
            ),
        },
        {
            key: "section" as keyof IProject,
            text: "Отправка заявок",
        },
        {
            key: "mailTo",
            text: "Почта - получатель",
            errorText: "Введите почту",
            rules: {
                pattern: {
                    value: EMAIL_PATTERN,
                    message: "Введите почту в формате example.com",
                },
            },
        },
        {
            key: "telegramBotToken",
            text: "Токен телеграмм бота",
            errorText: "Введите токен телеграмм бота",
        },
        {
            key: "telegramChatId",
            text: "ID телеграмм чата",
            errorText: "Введите ID телеграмм чата",
        },
        {
            key: "thankUrl",
            text: 'Путь к страничке "Спасибо"',
        },
        {
            key: "fakeThankUrl",
            text: "Путь к страничке-обманке",
        },
    ];

    const setDefaultValues = () => {
        fields.forEach((field) => {
            const key = field.key as keyof typeof errors;
            setValue(key, project[field.key]?.toString() || "");
        });
    };

    const setEditModeHandler = () => {
        setDefaultValues();
        setEditMode(true);
    };

    const cancelEditing = () => {
        const { ads, countryId, productId } = project;
        setAds(ads);
        setCountryId(countryId);
        setProductId(productId);
        setDefaultValues();
        clearErrors();
        setIsTesting(project.isTesting);
        setRandomRedirect(project.randomRedirect);
        dispatch(setProjectResponseError());
        setEditMode(false);
    };

    useEffect(() => {
        cancelEditing();
        setPhone(projectPhone);
    }, [project]);

    const onSubmit = async (data: any) => {
        const response = await dispatch(
            updateProject({
                id: project.id,
                ...data,
                productId,
                countryId,
                isTesting,
                randomRedirect,
                ads,
                phoneId: phone ? phone.id : project.phones[0]?.projectId,
                maskId: mask ? mask.id : project.maskId,
                autoPhoneMode,
            })
        );
        if (response.meta.requestStatus === "fulfilled") {
            toast({
                text: `Проект "${project.name}" успешно изменён.`,
            });
        }
    };

    const deleteProjectHandler = async () => {
        const response = await dispatch(deleteProject(project.id));
        if (response.meta.requestStatus === "fulfilled") {
            toast({
                text: `Проект "${project.name}" удален.`,
            });
            navigate(ROUTES.projects.path, { replace: true });
        }
    };

    return (
        <>
            <HStack
                align={"flex-start"}
                spacing={0}
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                flexDirection={{ base: "column-reverse", md: "row" }}
            >
                <Box flex={1} w={{ base: "100%", md: "auto" }}>
                    <VStack spacing={2} align="flex-start" maxW="450px">
                        {responseError && (
                            <Heading color="red" size="sm">
                                {responseError}
                            </Heading>
                        )}
                        <Conversions projectId={project.id} />
                        {editMode && (
                            <PhoneModal
                                autoPhoneMode={autoPhoneMode}
                                phone={phone}
                                setPhone={setPhone}
                                mask={mask}
                                setMask={setMask}
                                phoneOptions={project.phoneOptions}
                            />
                        )}
                        {fields.map((field, i) => {
                            if (field.key === ("section" as keyof IProject))
                                return (
                                    <Heading
                                        key={field.text}
                                        textAlign={"center"}
                                        fontSize="17px"
                                        p={1}
                                        pb={1.5}
                                        color="white"
                                        w={"100%"}
                                        bg={"blue.500"}
                                    >
                                        {field.text}
                                    </Heading>
                                );

                            if (field.render) return field.render(i);

                            const key = field.key as keyof typeof errors;

                            return (
                                <FormControl
                                    size="sm"
                                    key={field.key}
                                    isInvalid={!!errors[key]}
                                >
                                    <FormLabel fontSize={{ base: 14, sm: 16 }}>
                                        {field.text}:
                                    </FormLabel>
                                    <InputGroup>
                                        {editMode && field.leftAddon && (
                                            <InputLeftAddon
                                                children={field.leftAddon}
                                            />
                                        )}
                                        <ChangedText
                                            text={
                                                project[
                                                    field.key
                                                ]?.toString() || ""
                                            }
                                            isEdited={editMode}
                                            {...register(key, {
                                                required: {
                                                    message:
                                                        field.errorText || "",
                                                    value: !!field.errorText,
                                                },
                                                ...field.rules,
                                            })}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>
                                        {errors[key] && errors[key]?.message}
                                    </FormErrorMessage>
                                </FormControl>
                            );
                        })}
                        <ChangedCheckbox
                            isEditable={editMode}
                            name="Тестовый режим"
                            isChecked={isTesting}
                            onChange={(e) => setIsTesting(e.target.checked)}
                        />
                        <InfoText>
                            <Text fontWeight={500} as="span">
                                Случайное перенаправление:
                            </Text>{" "}
                            {randomRedirect}%
                        </InfoText>
                        <GoogleTablesSettings projectId={project.id} />
                        {editMode && (
                            <ArraySwitcher
                                value={randomRedirect / 10}
                                setValue={setRandomRedirect}
                            />
                        )}
                        <Heading
                            textAlign={"center"}
                            fontSize="17px"
                            p={1}
                            pb={1.5}
                            color="white"
                            w={"100%"}
                            bg={"blue.500"}
                        >
                            Рекламный аккаунт
                        </Heading>
                        <Ad ads={ads} setAds={setAds} editMode={editMode} />
                    </VStack>
                </Box>
                <Flex
                    w={{ base: "100%", md: "200px" }}
                    align="stretch"
                    flexDirection={{ base: "row", md: "column" }}
                    gap={2}
                    pb={3}
                >
                    {editMode ? (
                        <>
                            <Button
                                size={"sm"}
                                colorScheme={COLOR_SCHEME}
                                onClick={cancelEditing}
                                fontSize={{ base: "3.5vw", sm: 15 }}
                                width={{
                                    base: "50% !important",
                                    sm: "auto !important",
                                }}
                            >
                                Отмена
                            </Button>
                            <Button
                                size={"sm"}
                                colorScheme={"green"}
                                type="submit"
                                isLoading={postLoading}
                                loadingText="Cохранение..."
                                fontSize={{ base: "3.5vw", sm: 15 }}
                                width={{
                                    base: "50% !important",
                                    sm: "auto !important",
                                }}
                            >
                                Сохранить
                            </Button>
                        </>
                    ) : (
                        <Button
                            size={"sm"}
                            rightIcon={<FaEdit />}
                            colorScheme={COLOR_SCHEME}
                            onClick={setEditModeHandler}
                            fontSize={{ base: "3.5vw", sm: 15 }}
                            width={{
                                base: "50% !important",
                                sm: "auto !important",
                            }}
                        >
                            Редактировать
                        </Button>
                    )}
                    {!editMode && (
                        <Private roles={[ROLES.ADMIN]}>
                            <Button
                                size="sm"
                                rightIcon={<AiFillDelete />}
                                colorScheme="red"
                                isLoading={postLoading}
                                loadingText="Удаление..."
                                onClick={onOpen}
                                fontSize={{ base: "3.5vw", sm: 15 }}
                                width={{
                                    base: "50% !important",
                                    sm: "auto !important",
                                }}
                            >
                                Удалить проект
                            </Button>
                        </Private>
                    )}
                </Flex>
                <ConfirmDialog
                    isOpen={isOpen}
                    onCancel={onClose}
                    onAccept={deleteProjectHandler}
                    title="Удаление проекта"
                    text={`Вы уверены, что хотите удалить проект "${project.name}"?`}
                    OKButtonText="Удалить"
                />
            </HStack>
        </>
    );
};

export default Settings;

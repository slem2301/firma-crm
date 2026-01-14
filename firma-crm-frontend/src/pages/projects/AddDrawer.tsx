/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Button,
    Checkbox,
    Divider,
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
    Heading,
    Input,
    InputGroup,
    InputRightAddon,
    Spinner,
    Text,
    useBoolean,
    VStack,
} from "@chakra-ui/react";
import React, { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import SingleSelectFilter from "../../components/filters/SingleSelectFilter";
import { COLOR_PRIMARY } from "../../const/colors";
import { EMAIL_PATTERN } from "../../const/patterns";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import useAppToast from "../../hooks/useAppToast";
import { IAd } from "../../models/IAd";
import { IProject } from "../../models/IProject";
import CommonService from "../../services/common-service";
import {
    createProject,
    getAllProjects,
    setProjectResponseError,
} from "../../store/slices/project-slice";
import Ad from "../../components/ad/Ad";
import { itemsPerPage } from "./Projects";

type AddDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const AddDrawer: React.FC<AddDrawerProps> = (props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        clearErrors,
        setError,
    } = useForm({ mode: "onSubmit" });
    const toast = useAppToast();

    const {
        country: { countries },
        app: { period },
        project: { postLoading, responseError },
        product: { products },
    } = useAppSelector((state) => state);

    const [thankPage, setThankPage] = useBoolean(true);

    const [ads, setAds] = useState<IAd[]>([]);

    const [productId, setProductId] = useState<number | null>(null);
    const [countryId, setCountryId] = useState<number | null>(null);

    React.useEffect(() => {
        if (!productId && products.length > 0) {
            setProductId(products[0].id);
        }
        if (!countryId && countries.length > 0) {
            setCountryId(countries[0].id);
        }
    }, [products, countries]);

    const [telegramTokenLoading, setTelegramTokenLoading] = useState(false);
    const [telegramBotName, setTelegramBotName] = useState("");

    const dispatch = useAppDispatch();

    const onClose = () => {
        setAds([]);
        reset();
        dispatch(setProjectResponseError());
        setThankPage.on();
        props.onClose();
    };

    const onSubmit = async (data: any) => {
        if (!productId || !countryId) return;
        const newProject: IProject = {
            ...data,
            productId,
            countryId,
            randomRedirect: false,
            ads,
        };

        const response = await dispatch(createProject(newProject));
        if (response.meta.requestStatus === "fulfilled") {
            toast({
                text: `Проект "${data.name}" успешно создан.`,
            });
            await dispatch(
                getAllProjects({
                    search: "",
                    period,
                    pagination: {
                        page: 1,
                        itemsPerPage,
                    },
                    sort: {
                        key: "createdAt",
                        value: "ASC",
                    },
                    filter: {
                        productIds: products.map((item) => item.id),
                        countryIds: countries.map((item) => item.id),
                        isTesting: false,
                        redirectRange: 0,
                        autoPhoneMode: false,
                    },
                })
            );
            onClose();
        }
    };

    const checkBotToken = async () => {
        const setTokenError = (message: string | undefined) =>
            setError("telegramBotToken", { message });
        const token = getValues().telegramBotToken;
        if (!token) {
            return setTokenError("Введите токен телеграмм бота");
        }

        clearErrors("telegramBotToken");

        setTelegramTokenLoading(true);
        const response = await CommonService.getTelegramBotInfo(token);
        if (response?.status === "ok") setTelegramBotName(response.data);
        else {
            setTokenError(response?.data);
            setTelegramBotName("");
        }
        setTelegramTokenLoading(false);
    };

    return (
        <Drawer
            size={"md"}
            isOpen={props.isOpen}
            placement="right"
            onClose={onClose}
        >
            <DrawerOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        Добавление проекта
                        {responseError && (
                            <Text color="red" fontSize={16} mt={1}>
                                {responseError}
                            </Text>
                        )}
                    </DrawerHeader>
                    <DrawerBody
                        as={VStack}
                        spacing={2}
                        alignItems="flex-start"
                        px={{ base: 3, sm: 6 }}
                    >
                        <SectionTitle>Общие параметры</SectionTitle>
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel>Название проекта</FormLabel>
                            <Input
                                size="sm"
                                type="text"
                                placeholder="Продажа бензопил - Бензомаркет"
                                {...register("name", {
                                    required: {
                                        message: "Введите название",
                                        value: true,
                                    },
                                    minLength: {
                                        message:
                                            "Длина должна больше 4 символов",
                                        value: 4,
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                <>{errors.name && errors.name.message}</>
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.domain}>
                            <FormLabel>Домен</FormLabel>
                            <InputGroup size="sm">
                                <Input
                                    type="text"
                                    placeholder="https://example.com"
                                    {...register("domain", {
                                        required: {
                                            message: "Введите домен",
                                            value: true,
                                        },
                                    })}
                                />
                            </InputGroup>
                            <FormHelperText>
                                Введите домен сайта в формате domain.by
                            </FormHelperText>
                            <FormErrorMessage>
                                <>{errors.domain && errors.domain.message}</>
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.url}>
                            <FormLabel>Ссылка на сайт</FormLabel>
                            <InputGroup size="sm">
                                <Input
                                    type="text"
                                    placeholder="https://example.com"
                                    {...register("url", {
                                        required: {
                                            message: "Введите ссылку",
                                            value: true,
                                        },
                                    })}
                                />
                            </InputGroup>
                            <FormHelperText>
                                Введите ссылку на сайт (может совпадать с
                                доменом)
                            </FormHelperText>
                            <FormErrorMessage>
                                <>{errors.url && errors.url.message}</>
                            </FormErrorMessage>
                        </FormControl>

                        <FormLabel>Продуктовая позиция</FormLabel>
                        <SingleSelectFilter
                            bold
                            w="100%"
                            options={products.map(({ name, id }) => ({
                                name,
                                value: id,
                            }))}
                            setValue={setProductId}
                        />
                        <FormLabel>Регион</FormLabel>
                        <SingleSelectFilter
                            bold
                            w="100%"
                            options={countries.map(({ name, id }) => ({
                                name,
                                value: id,
                            }))}
                            setValue={setCountryId}
                        />

                        <Divider borderColor={"gray.300"} />
                        <SectionTitle>Рекламный аккаунт</SectionTitle>

                        <Ad ads={ads} setAds={setAds} editMode={props.isOpen} />

                        <Divider borderColor={"gray.300"} />
                        <SectionTitle>Отправка заявок</SectionTitle>

                        <FormControl isInvalid={!!errors.mailTo}>
                            <FormLabel>Почта - получатель</FormLabel>
                            <Input
                                size="sm"
                                type="text"
                                placeholder="user@gmail.com"
                                {...register("mailTo", {
                                    required: {
                                        message: "Введите почту",
                                        value: true,
                                    },
                                    pattern: {
                                        value: EMAIL_PATTERN,
                                        message:
                                            'Пожалуйста введите почту в формате "user@example.com"',
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                <>{errors.mailTo && errors.mailTo.message}</>
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.telegramBotToken}>
                            <FormLabel>Токен телеграмм бота</FormLabel>
                            <InputGroup size="sm">
                                <Input
                                    type="text"
                                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                                    {...register("telegramBotToken", {
                                        required: {
                                            message:
                                                "Введите токен телеграмм бота",
                                            value: true,
                                        },
                                    })}
                                />
                                <InputRightAddon
                                    cursor={"pointer"}
                                    children={
                                        telegramTokenLoading ? (
                                            <Spinner />
                                        ) : (
                                            "Проверить"
                                        )
                                    }
                                    onClick={checkBotToken}
                                />
                            </InputGroup>
                            <FormHelperText>
                                {telegramBotName && (
                                    <>
                                        {"Название бота: "}
                                        <Text as="span" color={COLOR_PRIMARY}>
                                            {telegramBotName}
                                        </Text>
                                    </>
                                )}
                            </FormHelperText>
                            <FormErrorMessage>
                                <>
                                    {errors.telegramBotToken &&
                                        errors.telegramBotToken.message}
                                </>
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.telegramChatId}>
                            <FormLabel>ID беседы в телеграмме</FormLabel>
                            <Input
                                size="sm"
                                type="text"
                                placeholder="123456789"
                                {...register("telegramChatId", {
                                    required: {
                                        message:
                                            "Введите ID беседы в телеграмме",
                                        value: true,
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                <>
                                    {errors.telegramChatId &&
                                        errors.telegramChatId.message}
                                </>
                            </FormErrorMessage>
                        </FormControl>
                        <Checkbox
                            isChecked={thankPage}
                            onChange={setThankPage.toggle}
                        >
                            Страница "Спасибо"
                        </Checkbox>
                        {thankPage && (
                            <>
                                <FormControl isInvalid={!!errors.thankUrl}>
                                    <FormLabel>
                                        Путь к странице "Спасибо"
                                    </FormLabel>
                                    <Input
                                        size="sm"
                                        type="text"
                                        placeholder="/thank.html"
                                        {...register("thankUrl", {
                                            required: {
                                                message: `Введите путь к странице "Спасибо"`,
                                                value: true,
                                            },
                                        })}
                                    />
                                    <FormHelperText>
                                        Введите путь к страничке "Спасибо"
                                        относительно основной страницы
                                    </FormHelperText>
                                    <FormErrorMessage>
                                        <>
                                            {errors.thankUrl &&
                                                errors.thankUrl.message}
                                        </>
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.fakeThankUrl}>
                                    <FormLabel>
                                        Путь к странице-обманке
                                    </FormLabel>
                                    <Input
                                        size="sm"
                                        type="text"
                                        placeholder="/thb.html"
                                        {...register("fakeThankUrl", {
                                            required: {
                                                message: `Введите путь к странице-обманке`,
                                                value: true,
                                            },
                                        })}
                                    />
                                    <FormHelperText>
                                        Введите путь к страничке-обманке
                                        относительно основной страницы
                                    </FormHelperText>
                                    <FormErrorMessage>
                                        <>
                                            {errors.fakeThankUrl &&
                                                errors.fakeThankUrl.message}
                                        </>
                                    </FormErrorMessage>
                                </FormControl>
                            </>
                        )}
                    </DrawerBody>

                    <DrawerFooter px={{ base: 3, sm: 6 }}>
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={onClose}
                            disabled={postLoading}
                            w={{ base: "50%", sm: "auto" }}
                        >
                            Отмена
                        </Button>
                        <Button
                            isLoading={postLoading}
                            loadingText="Сохранение"
                            type="submit"
                            colorScheme="green"
                            disabled={postLoading}
                            w={{ base: "50%", sm: "auto" }}
                        >
                            Сохранить
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </form>
        </Drawer>
    );
};

export default AddDrawer;

const SectionTitle = (props: PropsWithChildren) => {
    return (
        <Box w="100%">
            <Heading
                bg="blue.500"
                textAlign={"center"}
                py={1}
                pb={1.5}
                color="white"
                fontSize={"18px"}
                size="sm"
            >
                {props.children}
            </Heading>
            <Divider borderColor={"gray.300"} />
        </Box>
    );
};

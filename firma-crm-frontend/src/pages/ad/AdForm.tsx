import {
    Badge,
    Button,
    Flex,
    Grid,
    GridItem,
    useBoolean,
} from "@chakra-ui/react";
import { IAd } from "../../models/IAd";
import Window from "./Window";
import { AdProp, AdPropStyles } from "./AdProp";
import { useCallback, useMemo } from "react";
import { decrypt, encrypt } from "../../utils/encription";
import { useForm } from "react-hook-form";
import SingleSelectFilter, {
    optionType,
} from "../../components/filters/SingleSelectFilter";
import { useAppSelector } from "../../hooks/redux";
import adService from "../../services/ad-service";
import { SUCCESS_PUT } from "../../const/http-codes";

interface AdFormProps {
    ad: IAd;
    updateAd: (ad: IAd) => void;
}

const CLIENT_ID = process.env.REACT_APP_YANDEX_API_CLIENT_ID;

export const AdForm = ({ ad, updateAd }: AdFormProps) => {
    const [editMode, setEditMode] = useBoolean(false);
    const currencies = useAppSelector((state) => state.currency.currencies);

    const options: optionType<number>[] = useMemo(() => {
        return currencies.map((currency) => ({
            name: `${currency.name} ${currency.symbol}`,
            value: currency.id,
        }));
    }, [currencies]);

    const decryptedPassword = useMemo(() => {
        return decrypt(ad.password);
    }, [ad]);

    const {
        setValue,
        register,
        handleSubmit: submitWrapper,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            login: ad.login,
            password: decryptedPassword,
            currencyId: ad.currencyId,
            delay: ad.delay,
            balance: ad.balance,
        } as IAd,
    });

    const handleSubmit = useCallback(
        async (data: IAd) => {
            try {
                const response = await adService.update({
                    ...data,
                    id: ad.id,
                    password: encrypt(data.password),
                });

                if (response.status === SUCCESS_PUT) {
                    setEditMode.off();
                    updateAd(response.data);
                }
            } catch (e) {}
        },
        [ad.id, updateAd, setEditMode]
    );

    const action = useMemo(() => {
        return (
            <>
                {editMode && (
                    <Button
                        size="sm"
                        colorScheme="green"
                        onClick={submitWrapper(handleSubmit)}
                    >
                        Сохранить
                    </Button>
                )}
                <Button
                    size="sm"
                    onClick={setEditMode.toggle}
                    colorScheme={editMode ? "gray" : "blue"}
                >
                    {editMode ? "Отменить" : "Редактировать"}
                </Button>
            </>
        );
    }, [setEditMode.toggle, editMode, handleSubmit, submitWrapper]);

    const handleGetToken = () => {
        if (!ad) return;

        const url = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${CLIENT_ID}&login_hint=${ad.login}`;

        window.location.href = url;
    };

    const handleChangeCurrency = useCallback(
        (value: number) => {
            setValue("currencyId", value);
        },
        [setValue]
    );

    return (
        <Flex gap={4} flexWrap="wrap">
            <Window title={ad.login} action={action}>
                <Grid gridTemplate={"1fr 1fr 1fr / 1fr 1fr"} gap={2}>
                    <AdProp
                        {...register("login")}
                        label="Логин"
                        text={ad.login}
                        editable={editMode}
                        type="text"
                    />
                    <AdProp
                        {...register("password")}
                        label="Пароль"
                        text={decryptedPassword}
                        editable={editMode}
                        type="text"
                    />
                    <AdProp
                        {...register("balance", { valueAsNumber: true })}
                        label="Баланс"
                        text={`${ad.balance} ${ad.currency.symbol}`}
                        editable={editMode}
                        type="text"
                        inputType="number"
                    />
                    <AdProp
                        label="Валюта"
                        text={ad.currency.name}
                        editable={editMode}
                        type="select"
                        element={
                            <SingleSelectFilter
                                w="100%"
                                selectProps={{ textAlign: "left" }}
                                options={options}
                                setValue={handleChangeCurrency}
                                defaultValue={ad.currencyId}
                            />
                        }
                    />

                    {ad.type === "yandex" && (
                        <AdProp
                            {...register("delay", { valueAsNumber: true })}
                            label="Отсрочка"
                            text={`${ad.delay} ${ad.currency.symbol}`}
                            editable={editMode}
                            type="text"
                            inputType="number"
                        />
                    )}
                    <AdProp text={ad.type} label="Тип аккаунта" type="text" />
                    {ad.type === "yandex" && (
                        <>
                            <GridItem {...AdPropStyles}>
                                Токен:{" "}
                                <Badge colorScheme={ad.token ? "green" : "red"}>
                                    {ad.token ? "Получен" : "Токен не получен"}
                                </Badge>
                            </GridItem>
                            {!ad.token && (
                                <Button onClick={handleGetToken}>
                                    Получить токен
                                </Button>
                            )}
                        </>
                    )}
                </Grid>
            </Window>
        </Flex>
    );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { Text } from "@chakra-ui/react";
import { format, parseISO, toDate } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "../../components/table/Table";
import { SUCCESS_POST } from "../../const/http-codes";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IExpense } from "../../models/IExpense";
import { IProject } from "../../models/IProject";
import expenseService from "../../services/expense-service";
import { setPeriod } from "../../store/slices/app-slice";
import { getCurrentPeriod } from "../../utils/getCurrentPeriod";
import { MoneyText } from "../price/Price";

type ExpenseProps = {
    project: IProject;
};

const Expense: React.FC<ExpenseProps> = ({ project }) => {
    const { id } = useParams();
    const { period } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<IExpense[]>([]);

    const googleAd = project.ads?.find((ad) => ad.type === "google");
    const yandexAd = project.ads?.find((ad) => ad.type === "yandex");

    const totalItem: any = {
        date: "Общая",
        google: items.reduce((result, item) => {
            result += Number(item.google);
            return result;
        }, 0),
        yandex: items.reduce((result, item) => {
            result += Number(item.yandex);
            return result;
        }, 0),
        total: items.reduce((result, item) => {
            result += Number(item.total);
            return result;
        }, 0),
        currency: {
            symbol: yandexAd?.currency.symbol || "",
        },
    };

    const fetchExpense = useCallback(async () => {
        if (id !== project?.id?.toString()) return;

        setLoading(true);

        try {
            const response = await expenseService.getByProjectId({
                period,
                projectId: project.id,
            });

            if (response.status === SUCCESS_POST) setItems(response.data);
        } catch (e) { }

        setLoading(false);
    }, [project, period, id]);

    useEffect(() => {
        fetchExpense();
    }, [fetchExpense]);

    useEffect(() => {
        return () => {
            const currentPeriod = getCurrentPeriod();
            dispatch(setPeriod([currentPeriod[0], currentPeriod[1]]));
        };
    }, []);

    useEffect(() => {
        if (period.from.getDate() === period.to.getDate()) {
            const from = new Date(period.from);

            from.setDate(1);

            dispatch(setPeriod([from, period.to]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Table<{
                currency: string;
                googleBalance: string;
                yandexBalance: string;
                yandexDelay: string;
            }>
                props={{ mb: 4 }}
                headers={[
                    {
                        name: "G. Баланс",
                        key: "googleBalance",
                        props: { w: "25%" },
                        render: (item) => (
                            <MoneyText value={googleAd ? "$" : ""}>
                                {item.googleBalance}
                            </MoneyText>
                        ),
                    },
                    {
                        name: "Я. Баланс",
                        key: "yandexBalance",
                        props: { w: "25%" },
                        render: (item) => (
                            <MoneyText
                                value={yandexAd ? yandexAd.currency.symbol : ""}
                            >
                                {item.yandexBalance}
                            </MoneyText>
                        ),
                    },
                    {
                        name: "Я. Отсрочка",
                        key: "yandexDelay",
                        props: { w: "25%" },
                        render: (item) => (
                            <MoneyText
                                value={yandexAd ? yandexAd.currency.symbol : ""}
                            >
                                {item.yandexDelay}
                            </MoneyText>
                        ),
                    },
                    {
                        name: "Валюта",
                        key: "currency",
                        props: { w: "25%" },
                    },
                ]}
                rows={[
                    {
                        currency: yandexAd
                            ? `${yandexAd.currency.name} ${yandexAd.currency.symbol}`
                            : "Не выбрана",
                        googleBalance: googleAd
                            ? googleAd.balance.toString()
                            : "Не установлен",
                        yandexBalance: yandexAd
                            ? yandexAd.balance.toString()
                            : "Не установлен",
                        yandexDelay: yandexAd
                            ? yandexAd.delay.toString()
                            : "Не установлен",
                    },
                ]}
            />
            <Table<IExpense>
                maxH={"59vh"}
                update={fetchExpense}
                isLoading={loading}
                headers={[
                    {
                        name: "Дата",
                        key: "date",
                        props: { w: "25%" },
                        render: (item) => (
                            <Text>
                                {toDate(
                                    parseISO(item.date.toString())
                                ).toString() !== "Invalid Date" ? (
                                    format(new Date(item.date), "dd-MM-yyyy")
                                ) : (
                                    <>{item.date}</>
                                )}
                            </Text>
                        ),
                    },
                    {
                        name: "Всего",
                        key: "total",
                        props: { w: "25%" },
                        render: (item) => (
                            <MoneyText value={"$"}>{item.total}</MoneyText>
                        ),
                    },
                    {
                        name: "Google",
                        key: "google",
                        props: { w: "25%" },
                        render: (item) => (
                            <MoneyText value={"$"}>{item.google}</MoneyText>
                        ),
                    },
                    {
                        name: "Яндекс",
                        key: "yandex",
                        props: { w: "25%" },
                        render: (item) => (
                            <MoneyText value={item.currency.symbol}>
                                {item.yandex}
                            </MoneyText>
                        ),
                    },
                ]}
                rows={[totalItem, ...items]}
            />
        </>
    );
};

export default Expense;

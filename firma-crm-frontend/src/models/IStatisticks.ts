import { getDates } from "../utils/getDates";
import { IAd } from "./IAd";
import { ICurrency } from "./ICurrency";
import { IPhone } from "./IPhone";

export interface IProjectStatisticksItem {
    total: number;
    yandex: number;
    google: number;
    other: number;
    calls: number;
    url: string;
    id: number;
    name: string;
    projects?: IProjectStatisticksItem[];
    zakaz: number;
    pred: number;
    leasing: number;
    buyPercent: number;
    expenses: number;
    earn: number;
}
export interface ICallsStatisticksData extends Omit<IPhone, "calls"> {
    calls: number;
}

export interface IProjectStatisticks {
    hasMore: boolean;
    total: number;
    totalPages: number;
    projects: IProjectStatisticksItem[];
}

export interface IStatisticks {
    common: IProjectStatisticks;
    projects: IProjectStatisticks[];
}

export interface ICommonStatisticks {
    requests: {
        total: number;
        yandex: number;
        google: number;
        other: number;
        calls: number;
    };
    orders: {
        total: number;
        pred: number;
        povtor: number;
        zakaz: number;
    };
    expenses: {
        expense: number;
        requestCost: number;
        orderCost: number;
        earn: number;
        supposed: number;
    };
}

export interface IExpenseDate {
    value: number;
    symbol: string;
    google: number;
    yandex: number;
}

export interface IExpenseStatisticks {
    name: string;
    url: string;
    total: IExpenseDate;
    id: number;
    ads: IAd[];
    [key: string]: number | string | IExpenseDate | IAd[];
}

export interface IBalanceStatisticks {
    id: number;
    login: string;
    balance: number;
    delay: number;
    balanceUSD: number;
    delayUSD: number;
    total: number;
    currency: ICurrency;
    [key: string]: number | string | ICurrency;
}

export function getBalanceStatisticksSignature(
    from: Date,
    to: Date
): IBalanceStatisticks {
    const dates: { [key: string]: number } = {};
    getDates(from, to).forEach((date) => (dates[date] = 1));

    return {
        id: 1,
        login: "1",
        balance: 1,
        balanceUSD: 1,
        delayUSD: 1,
        delay: 1,
        total: 1,
        currency: {
            id: 1,
            name: "1",
            key: "1",
            symbol: "1",
        },
        ...dates,
    };
}

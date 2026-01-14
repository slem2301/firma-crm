import { ICurrency } from "./ICurrency";

export interface IExpense {
    date: Date;
    projectId: number;
    yandex: number;
    google: number;
    total: number;
    currencyId: number;
    USD: number;
    currency: ICurrency;
}

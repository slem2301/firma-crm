import { ICurrency } from "../ICurrency";
import { ICostCategory } from "./ICostCategory";

export type CostBalanceType = "USD" | "RU";

export type CostType = "PAYMENT" | "REFILL" | "ACCOUNT";

export const COST_TYPE: Record<CostType, CostType> = {
    PAYMENT: "PAYMENT",
    REFILL: "REFILL",
    ACCOUNT: "ACCOUNT",
};

export const COST_BALANCE_TYPE: Record<CostBalanceType, CostBalanceType> = {
    RU: "RU",
    USD: "USD",
};

export interface ICost {
    id: number;
    comment: string;
    type: CostType;
    balanceType: CostBalanceType;
    amount: number;
    currencyAmount: number;
    currencyId: number;
    accountId: number;
    categoryId: number;
    date: string;
    createdAt: string;
    currency: ICurrency;
    category: ICostCategory;
}

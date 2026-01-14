import { ICurrency } from "./ICurrency";

export interface IAd {
    id: number;
    balance: number;
    delay: number;
    type: AdType;
    projectId: number;
    currency: ICurrency;
    currencyId: number;
    login: string;
    archived: boolean;
    password: string;
    token: string | null;
}

export type AdType = "yandex" | "google";

export type BalanceLimitZone = "RED_ZONE" | "ORANGE_ZONE" | "GREEN_ZONE";

export type BalanceLimit = Record<number, BalanceLimitZone>;

export type BalanceLimits = Record<string, BalanceLimit>;

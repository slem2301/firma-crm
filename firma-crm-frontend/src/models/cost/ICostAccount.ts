import { ICost } from "./ICost";

export interface ICostAccount {
    id: number;
    name: string;
    initialBalance: number;
    balance: number;
    balanceRu: number;
    accountId: number | null;
    createdAt: string;
    costs: ICost[];
    accounts: ICostAccount[];
}

import { CostBalanceType, ICost } from "./ICost";

export interface ICostCategory {
    id: number;
    name: string;
    balanceType: CostBalanceType;
    costs: ICost[];
}

import { sortValueType } from "../hooks/useSort";
import { AdType, IAd } from "../models/IAd";
import BaseService from "./base-service";

export interface getCommonStatisticksBody {
    period: {
        from: Date;
        to: Date;
    };
    filter: {
        countryIds: number[];
        productIds: number[];
    };
}

export interface getProjectsStatisticksBody {
    period: {
        from: Date;
        to: Date;
    };
    search: string;
    isActive: boolean;
    filter: {
        countryIds: number[];
        productIds: number[];
    };
}

export interface getExpensesStatisticksBody {
    type: "google" | "yandex" | "total";
    period: {
        from: Date;
        to: Date;
    };
    filter: {
        countryIds: number[];
        productIds: number[];
    };
}

export interface getBalanceStatisticksBody {
    type: AdType;
    search: string;
    period: {
        from: Date;
        to: Date;
    };
    filter: {
        countryIds: number[];
        productIds: number[];
        currencyIds: number[];
    };
    sort: {
        key: string;
        value: sortValueType;
    };
}

export interface getCallsStatisticksBody {
    period: {
        from: Date;
        to: Date;
    };
}

class StatisticksService extends BaseService {
    async getCommon(data: getCommonStatisticksBody) {
        const res = await this.api.post("/statisticks/get-common", data);
        return res.data;
    }

    async getProjects(data: getProjectsStatisticksBody) {
        const res = await this.api.post("/statisticks/get-projects", data);
        return res.data;
    }

    async getExpenses(data: getExpensesStatisticksBody) {
        const res = await this.api.post("/statisticks/get-expense", data);
        return res.data;
    }

    async updateBalances(data: IAd) {
        const res = await this.api.put("/ad", data);
        return res.data;
    }

    async getBalance(data: getBalanceStatisticksBody) {
        const res = await this.api.post("/statisticks/get-balance", data);
        return res.data;
    }

    async getCalls(data: getCallsStatisticksBody) {
        const res = await this.api.post("/statisticks/get-calls", data);
        return res.data;
    }
}

export default new StatisticksService();

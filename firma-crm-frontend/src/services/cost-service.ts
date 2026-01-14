import { CostBalanceType, CostType } from "../models/cost/ICost";
import BaseService from "./base-service";

type CreateAccountDto = {
    readonly name: string;
    readonly balance?: number;
    readonly accountId?: number;
    readonly date?: Date;
};

type UpdateAccountDto = {
    readonly id: number;
    readonly name: string;
    readonly initialBalance?: number;
    readonly accountId?: number;
};

type CreateCategoryDto = {
    readonly name: string;
};

type UpdateCategoryDto = {
    readonly id: number;
    readonly name: string;
};

type CreateCostDto = {
    readonly comment: string;

    readonly amount: number;

    readonly currencyId: number;

    readonly accountId: number;

    readonly categoryId: number;

    readonly balanceType: CostBalanceType;

    readonly type: CostType;

    readonly date: Date;
};

type UpdateCostDto = {
    readonly id: number;
    readonly amount: number;
    readonly comment: string;
};

class CostService extends BaseService {
    async getAllAccounts() {
        return this.api.get("/cost/account");
    }

    async getAccountById(id: number) {
        return this.api.get(`/cost/account/${id}`);
    }

    async deleteAccountById(id: number) {
        return this.api.delete(`/cost/account/${id}`);
    }

    async createAccount(data: CreateAccountDto) {
        return this.api.post("/cost/account", data);
    }

    async updateAccount(data: UpdateAccountDto) {
        return this.api.put("/cost/account", data);
    }

    async createCategory(data: CreateCategoryDto) {
        return this.api.post("/cost/category", data);
    }

    async getAllCategories() {
        return this.api.get("/cost/category");
    }

    async updateCategory(data: UpdateCategoryDto) {
        return this.api.put("/cost/category", data);
    }

    async createCost(data: CreateCostDto) {
        return this.api.post("/cost/cost", data);
    }

    async updateCost(data: UpdateCostDto) {
        return this.api.put("/cost/cost", data);
    }

    async deleteCostById(id: number) {
        return this.api.delete(`/cost/cost/${id}`);
    }
}

export default new CostService();

import { BalanceLimits, IAd } from "../models/IAd";
import BaseService from "./base-service";

interface GetAllWithFilters {
    search: string;
    archived: boolean;
    filters: {
        currencyIds: number[];
        type: string;
    };
}

class AdService extends BaseService {
    async getAll() {
        return this.api.get("/ad");
    }

    async create(ad: IAd) {
        return this.api.post("/ad", ad);
    }

    async update(ad: IAd) {
        return this.api.put<IAd>("/ad", ad);
    }

    async toggleArchived(id: number) {
        return this.api.post<IAd>(`/ad/toggle-archived/${id}`);
    }

    async getAllWithFilters(data: GetAllWithFilters) {
        return this.api.post("/ad/get-all", data);
    }

    async getByLogin(login: string) {
        return this.api.get(`/ad/${login}`);
    }

    async saveToken(login: string, token: string) {
        return this.api.put("/ad/save-token", { login, token });
    }

    async getLimits() {
        return this.api.get<BalanceLimits>("/ad/limits");
    }
}

export default new AdService();

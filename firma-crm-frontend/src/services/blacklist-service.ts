import BaseService from "./base-service";

class BlacklistService extends BaseService {
    async getAll(search: string) {
        return this.api.get("/blacklist", { params: { search } });
    }

    async create(data: { phone: string; reason: string }) {
        return this.api.post("/blacklist", {
            phone: data.phone.trim(),
            reason: data.reason.trim(),
        });
    }

    async delete(id: number) {
        return this.api.delete(`/blacklist/${id}`);
    }
}

export default new BlacklistService();

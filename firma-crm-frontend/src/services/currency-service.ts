import BaseService from "./base-service";

class CurrencyService extends BaseService {
    async getAll() {
        return this.api.get("/currencies");
    }
}

export default new CurrencyService();

import BaseService from "./base-service";

class CountryService extends BaseService {
    async getAll() {
        return this.api.get("/countries");
    }
}

export default new CountryService();

import BaseService from "./base-service";

class ProductService extends BaseService {
    async getAll() {
        return this.api.get("/product");
    }
}

export default new ProductService();
